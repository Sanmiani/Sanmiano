import { z } from 'zod'
import { prisma } from '../../lib/prisma'
import { AppError } from '../../lib/errors'
import { auditLog, type AuthUser } from '../../lib/audit'

const clientSummarySelect = {
  id: true,
  branchId: true,
  name: true,
  email: true,
  phone: true,
  dateOfBirth: true,
  emailConsent: true,
  consentDate: true,
  createdAt: true,
} as const

const clientFullSelect = {
  id: true,
  branchId: true,
  name: true,
  email: true,
  phone: true,
  dateOfBirth: true,
  conditions: true,
  allergies: true,
  insuranceProvider: true,
  insurancePolicyNum: true,
  emailConsent: true,
  consentDate: true,
  isDeleted: true,
  deletedAt: true,
  createdBy: true,
  createdAt: true,
  updatedAt: true,
} as const

export const listQuerySchema = z.object({
  search: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
})

export type ListQuery = z.infer<typeof listQuerySchema>

export const createClientSchema = z.object({
  branchId: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().optional(),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  conditions: z.string().optional(),
  allergies: z.string().optional(),
  insuranceProvider: z.string().optional(),
  insurancePolicyNum: z.string().optional(),
  emailConsent: z.boolean().default(false),
})

export type CreateClientDto = z.infer<typeof createClientSchema>

export const updateClientSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().nullable().optional(),
  dateOfBirth: z.string().optional(),
  conditions: z.string().nullable().optional(),
  allergies: z.string().nullable().optional(),
  insuranceProvider: z.string().nullable().optional(),
  insurancePolicyNum: z.string().nullable().optional(),
  emailConsent: z.boolean().optional(),
})

export type UpdateClientDto = z.infer<typeof updateClientSchema>

function branchScope(actor: AuthUser) {
  return actor.role === 'super_admin' ? {} : { branchId: actor.branchId as string }
}

export async function list(actor: AuthUser, query: ListQuery) {
  const { search, page, limit } = query

  const searchFilter = search
    ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { email: { contains: search, mode: 'insensitive' as const } },
        ],
      }
    : {}

  const where = { ...branchScope(actor), isDeleted: false, ...searchFilter }

  const [clients, total] = await prisma.$transaction([
    prisma.client.findMany({
      where,
      select: clientSummarySelect,
      orderBy: { name: 'asc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.client.count({ where }),
  ])

  return { clients, total, page, limit }
}

export async function getById(id: string, actor: AuthUser) {
  const client = await prisma.client.findFirst({
    where: { id, isDeleted: false, ...branchScope(actor) },
    select: clientFullSelect,
  })
  if (!client) throw new AppError('NOT_FOUND', 'Client not found')

  await auditLog(actor, 'VIEW_SENSITIVE', 'Client', id)

  return client
}

export async function create(dto: CreateClientDto, actor: AuthUser) {
  const branchId = actor.role === 'super_admin' ? dto.branchId : actor.branchId
  if (!branchId) throw new AppError('VALIDATION_ERROR', 'Branch is required')

  const branch = await prisma.branch.findUnique({ where: { id: branchId } })
  if (!branch) throw new AppError('NOT_FOUND', 'Branch not found')
  if (!branch.isActive) throw new AppError('VALIDATION_ERROR', 'Branch is deactivated')

  const client = await prisma.client.create({
    data: {
      branchId,
      name: dto.name,
      email: dto.email,
      phone: dto.phone ?? null,
      dateOfBirth: new Date(dto.dateOfBirth),
      conditions: dto.conditions ?? null,
      allergies: dto.allergies ?? null,
      insuranceProvider: dto.insuranceProvider ?? null,
      insurancePolicyNum: dto.insurancePolicyNum ?? null,
      emailConsent: dto.emailConsent,
      consentDate: dto.emailConsent ? new Date() : null,
      createdBy: actor.id,
    },
    select: clientFullSelect,
  })

  if (dto.conditions || dto.allergies) {
    await auditLog(actor, 'CREATE', 'Client', client.id, { phiOnCreate: true })
  }

  return client
}

export async function update(id: string, dto: UpdateClientDto, actor: AuthUser) {
  const existing = await prisma.client.findFirst({
    where: { id, isDeleted: false, ...branchScope(actor) },
  })
  if (!existing) throw new AppError('NOT_FOUND', 'Client not found')

  const phiChanged = 'conditions' in dto || 'allergies' in dto
  const consentBeingEnabled = dto.emailConsent === true && !existing.emailConsent

  const updated = await prisma.client.update({
    where: { id },
    data: {
      ...dto,
      dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
      ...(consentBeingEnabled ? { consentDate: new Date() } : {}),
    },
    select: clientFullSelect,
  })

  if (phiChanged) {
    await auditLog(actor, 'UPDATE', 'Client', id, { phiFieldsChanged: true })
  }

  return updated
}

export async function softDelete(id: string, actor: AuthUser) {
  const existing = await prisma.client.findFirst({
    where: { id, isDeleted: false, ...branchScope(actor) },
  })
  if (!existing) throw new AppError('NOT_FOUND', 'Client not found')

  await auditLog(actor, 'DELETE', 'Client', id)

  return prisma.client.update({
    where: { id },
    data: { isDeleted: true, deletedAt: new Date() },
    select: clientSummarySelect,
  })
}

export async function exportCsv(id: string, actor: AuthUser): Promise<string> {
  const client = await prisma.client.findFirst({
    where: { id, isDeleted: false, ...branchScope(actor) },
    include: { prescriptions: { orderBy: { dispenseDate: 'desc' } } },
  })
  if (!client) throw new AppError('NOT_FOUND', 'Client not found')

  await auditLog(actor, 'VIEW_SENSITIVE', 'Client', id, { action: 'export_csv' })

  const esc = (val: unknown): string => {
    if (val === null || val === undefined) return ''
    const s = String(val)
    return s.includes(',') || s.includes('"') || s.includes('\n')
      ? `"${s.replace(/"/g, '""')}"`
      : s
  }

  const rows = [
    '=== Client Record ===',
    'Field,Value',
    `Name,${esc(client.name)}`,
    `Email,${esc(client.email)}`,
    `Phone,${esc(client.phone)}`,
    `Date of Birth,${esc(client.dateOfBirth?.toISOString().slice(0, 10))}`,
    `Conditions,${esc(client.conditions)}`,
    `Allergies,${esc(client.allergies)}`,
    `Insurance Provider,${esc(client.insuranceProvider)}`,
    `Insurance Policy #,${esc(client.insurancePolicyNum)}`,
    `Email Consent,${esc(client.emailConsent)}`,
    `Consent Date,${esc(client.consentDate?.toISOString().slice(0, 10))}`,
    '',
    '=== Prescriptions ===',
    'Medication,Form,Dosage,Frequency,Qty,Daily Rate,Dispense Date,Est. End Date,Status',
    ...client.prescriptions.map((p) =>
      [
        esc(p.medicationName),
        esc(p.medicationForm),
        esc(p.dosage),
        esc(p.frequency),
        esc(p.quantityDispensed),
        esc(p.dailyUsageRate),
        esc(p.dispenseDate?.toISOString().slice(0, 10)),
        esc(p.estimatedEndDate?.toISOString().slice(0, 10)),
        esc(p.status),
      ].join(',')
    ),
  ]

  return rows.join('\n')
}
