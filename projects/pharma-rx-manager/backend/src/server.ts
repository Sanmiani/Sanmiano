import { prisma } from './lib/prisma'
import { env } from './config/env'
import app from './app'
import { startReminderJob } from './jobs/reminder.job'

async function start(): Promise<void> {
  await prisma.$connect()
  startReminderJob()
  app.listen(env.PORT, () => {
    console.log(`[server] Listening on port ${env.PORT} (${env.NODE_ENV})`)
  })
}

start().catch((err) => {
  console.error('[server] Startup failed:', err)
  process.exit(1)
})
