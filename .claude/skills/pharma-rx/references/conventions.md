# Pharma RX — Code Conventions

## API response shape

All backend endpoints return a consistent envelope:

```typescript
// Success
{ success: true, data: T }

// Error
{ success: false, error: { code: string, message: string } }
```

Error codes: `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `VALIDATION_ERROR`, `INTERNAL_ERROR`

## Controller pattern

```typescript
// clients.controller.ts
export const getClient = async (req: Request, res: Response) => {
  try {
    const client = await clientService.getById(req.params.id, req.user)
    res.json({ success: true, data: client })
  } catch (err) {
    next(err)
  }
}
```

Use a global error handler in `app.ts` — never write `res.status(500)` inline.

## Service pattern

```typescript
// clients.service.ts
export async function getById(id: string, actor: AuthUser) {
  const client = await prisma.client.findFirst({
    where: {
      id,
      branchId: actor.role === 'super_admin' ? undefined : actor.branchId,
      isDeleted: false,
    },
  })
  if (!client) throw new AppError('NOT_FOUND', 'Client not found')

  // PHI accessed — write audit log
  await auditLog(actor, 'VIEW_SENSITIVE', 'Client', id)

  return client
}
```

## Custom error class

```typescript
// lib/errors.ts
export class AppError extends Error {
  constructor(public code: string, message: string) {
    super(message)
  }
}
```

## Branch scoping rule

Every Prisma query on `Client`, `Prescription`, `ReminderLog` must scope by branch unless the actor is `super_admin`:

```typescript
const branchFilter = actor.role === 'super_admin' ? {} : { branchId: actor.branchId }
```

Never trust a `branchId` from the request body — always derive it from `req.user.branchId`.

## Audit logging helper

```typescript
// lib/audit.ts
export async function auditLog(
  actor: AuthUser,
  action: AuditAction,
  resourceType: string,
  resourceId: string,
  metadata?: Record<string, unknown>
) {
  await prisma.auditLog.create({
    data: { userId: actor.id, branchId: actor.branchId, action, resourceType, resourceId, metadata },
  })
}
```

Call `auditLog` in the service, not the controller.

## Frontend API hooks (React Query)

One hook file per resource in `frontend/src/hooks/`:

```typescript
// hooks/useClients.ts
export function useClients() {
  return useQuery({ queryKey: ['clients'], queryFn: () => api.clients.list() })
}

export function useCreateClient() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: api.clients.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['clients'] }),
  })
}
```

## Frontend typed API layer

```typescript
// api/clients.ts
export const clients = {
  list: () => axios.get<ApiResponse<Client[]>>('/clients').then(r => r.data.data),
  getById: (id: string) => axios.get<ApiResponse<Client>>(`/clients/${id}`).then(r => r.data.data),
  create: (body: CreateClientDto) => axios.post<ApiResponse<Client>>('/clients', body).then(r => r.data.data),
}
```

## Environment variables (backend)

Required in `.env`:

```
DATABASE_URL=postgresql://...
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
RESEND_API_KEY=
PORT=4000
NODE_ENV=development
```

Never hard-code secrets. Use `config/env.ts` with Zod validation to parse `.env` at startup and fail fast if any are missing.

## Naming conventions

| Thing | Convention | Example |
|---|---|---|
| DB tables | snake_case (Prisma maps) | `reminder_logs` |
| Prisma model fields | camelCase | `emailConsent` |
| API routes | kebab-case | `/api/prescription-records` |
| TypeScript files | kebab-case | `reminder.job.ts` |
| React components | PascalCase | `ClientProfile.tsx` |
| Hooks | camelCase, `use` prefix | `useClients.ts` |
| Env vars | SCREAMING_SNAKE_CASE | `RESEND_API_KEY` |
