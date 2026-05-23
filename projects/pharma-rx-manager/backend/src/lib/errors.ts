export const STATUS_MAP: Record<string, number> = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  VALIDATION_ERROR: 422,
  INTERNAL_ERROR: 500,
}

export class AppError extends Error {
  public statusCode: number

  constructor(public code: string, message: string) {
    super(message)
    this.name = 'AppError'
    this.statusCode = STATUS_MAP[code] ?? 400
  }
}
