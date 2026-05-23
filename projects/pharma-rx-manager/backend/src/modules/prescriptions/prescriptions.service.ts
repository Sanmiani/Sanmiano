import { z } from 'zod'
import { addDays } from 'date-fns'
import { MedicationForm, PrescriptionStatus } from '@prisma/client'
import { prisma } from '../../lib/prisma'
import { AppError } from '../../lib/errors'
import { auditLog, type AuthUser } from '../../lib/audit'

const prescriptionSelect = {
  id: true,
  clientId: true,
  branchId: true,
  medicationName: true,
  medicationForm: true,
  dosage: true,
  frequency: true,
  quantityDispensed: true,
  dailyUsageRate: true,
  dispenseDate: true,
  expectedEndDate: true,
  estimatedEndDate: true,
  reminderDaysThreshold: true,
  status: true,
  notes: true,
  createdBy: true,
  createdAt: true,
  updatedAt: true,
} as const

export const createPrescriptionSchema = z.object({
  clientId: z.string().min(1, 'Client is required'),
  medicationName: z.string().min(1, 'Medication name is required'),
  medicationForm: z.nativeEnum(MedicationForm),
  dosage: z.string().optional(),
  frequency: z.string().optional(),
  quantityDispensed: z.coerce.number().int().positive('Quantity must be a positive integer'),
  dailyUsageRate: z.coerce.number().positive('Daily usage rate must be positive'),
  dispenseDate: z.string().min(1, 'Dispense date is required'),
  expectedEndDate: z.string().optional(),
  reminderDaysThreshold: z.coerce.number().int().positive().default(7),
  notes: z.string().optional(),
})

export type CreatePrescriptionDto = z.infer<typeof createPrescriptionSchema>

export const updatePrescriptionSchema = z.object({
  status: z.nativeEnum(PrescriptionStatus).optional(),
  notes: z.string().nullable().optional(),
  reminderDaysThreshold: z.coerce.number().int().positive().optional(),
})

export type UpdatePrescriptionDto = z.infer<typeof updatePrescriptionSchema>

function branchScope(actor: AuthUser) {
  return actor.role === 'super_admin' ? {} : { branchId: actor.branchId as string }
}

export async function listForClient(clientId: string, actor: AuthUser) {
  const client = await prisma.client.findFirst({
    where: { id: clientId, isDeleted: false, ...branchScope(actor) },
  })
  if (!client) throw new AppError('NOT_FOUND', 'Client not found')

  return prisma.prescription.findMany({
    where: { clientId, ...branchScope(actor) },
    select: prescriptionSelect,
    orderBy: { dispenseDate: 'desc' },
  })
}

export async function getById(id: string, actor: AuthUser) {
  const prescription = await prisma.prescription.findFirst({
    where: { id, ...branchScope(actor) },
    select: prescriptionSelect,
  })
  if (!prescription) throw new AppError('NOT_FOUND', 'Prescription not found')

  await auditLog(actor, 'VIEW_SENSITIVE', 'Prescription', id)

  return prescription
}

export async function create(dto: CreatePrescriptionDto, actor: AuthUser) {
  const client = await prisma.client.findFirst({
    where: { id: dto.clientId, isDeleted: false, ...branchScope(actor) },
  })
  if (!client) throw new AppError('NOT_FOUND', 'Client not found')

  const effectiveBranchId = actor.branchId ?? client.branchId

  const dispenseDate = new Date(dto.dispenseDate)
  const daysSupply = Math.round(dto.quantityDispensed / dto.dailyUsageRate)
  const estimatedEndDate = addDays(dispenseDate, daysSupply)

  const prescription = await prisma.prescription.create({
    data: {
      clientId: dto.clientId,
      branchId: effectiveBranchId,
      medicationName: dto.medicationName,
      medicationForm: dto.medicationForm,
      dosage: dto.dosage ?? null,
      frequency: dto.frequency ?? null,
      quantityDispensed: dto.quantityDispensed,
      dailyUsageRate: dto.dailyUsageRate,
      dispenseDate,
      expectedEndDate: dto.expectedEndDate ? new Date(dto.expectedEndDate) : null,
      estimatedEndDate,
      reminderDaysThreshold: dto.reminderDaysThreshold,
      notes: dto.notes ?? null,
      createdBy: actor.id,
    },
    select: prescriptionSelect,
  })

  await auditLog(actor, 'CREATE', 'Prescription', prescription.id)

  return prescription
}

export async function update(id: string, dto: UpdatePrescriptionDto, actor: AuthUser) {
  const existing = await prisma.prescription.findFirst({
    where: { id, ...branchScope(actor) },
  })
  if (!existing) throw new AppError('NOT_FOUND', 'Prescription not found')

  return prisma.prescription.update({
    where: { id },
    data: dto,
    select: prescriptionSelect,
  })
}

export async function cancel(id: string, actor: AuthUser) {
  const existing = await prisma.prescription.findFirst({
    where: { id, ...branchScope(actor) },
  })
  if (!existing) throw new AppError('NOT_FOUND', 'Prescription not found')

  return prisma.prescription.update({
    where: { id },
    data: { status: 'Cancelled' },
    select: prescriptionSelect,
  })
}

export async function complete(id: string, actor: AuthUser) {
  const existing = await prisma.prescription.findFirst({
    where: { id, status: 'Active', ...branchScope(actor) },
  })
  if (!existing) throw new AppError('NOT_FOUND', 'Active prescription not found')

  await auditLog(actor, 'UPDATE', 'Prescription', id, { statusChange: 'Completed' })

  return prisma.prescription.update({
    where: { id },
    data: { status: 'Completed' },
    select: prescriptionSelect,
  })
}
