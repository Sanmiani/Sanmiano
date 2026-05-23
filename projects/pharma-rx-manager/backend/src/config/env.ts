import { z } from 'zod'

const schema = z.object({
  DATABASE_URL: z.string().min(1),
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  RESEND_API_KEY: z.string().min(1),
  EMAIL_FROM: z.string().email().default('reminders@pharmarx.ca'),
  FRONTEND_URL: z.string().url().default('http://localhost:5173'),
  PORT: z.coerce.number().default(4000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
})

const result = schema.safeParse(process.env)

if (!result.success) {
  console.error('Missing or invalid environment variables:')
  console.error(result.error.flatten().fieldErrors)
  process.exit(1)
}

export const env = result.data
