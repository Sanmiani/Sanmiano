import fs from 'fs'
import path from 'path'
import { Resend } from 'resend'
import { env } from '../config/env'

export const resend = new Resend(env.RESEND_API_KEY)

interface Branch {
  name: string
  phone: string | null
  email: string | null
  accentColour?: string | null
  logoUrl?: string | null
}

interface Client {
  name: string
  email: string
}

interface Prescription {
  medicationName: string
  estimatedEndDate: Date | null
  expectedEndDate: Date | null
}

let _template: string | null = null

function loadTemplate(): string {
  if (!_template) {
    _template = fs.readFileSync(
      path.join(__dirname, '../assets/email-reminder.html'),
      'utf-8'
    )
  }
  return _template
}

export async function sendReminderEmail(
  prescription: Prescription,
  client: Client,
  branch: Branch,
  daysLeft: number
): Promise<void> {
  const endDate = prescription.expectedEndDate ?? prescription.estimatedEndDate
  const endDateStr = endDate ? new Date(endDate).toLocaleDateString('en-CA') : 'soon'
  const accent = branch.accentColour ?? '#1e40af'
  const logoHtml = branch.logoUrl
    ? `<img src="${branch.logoUrl}" alt="${branch.name} logo" class="header-logo" />`
    : '<div class="header-logo-placeholder"></div>'
  const urgency = daysLeft <= 3 ? 'URGENT: ' : ''

  const html = loadTemplate()
    .replace(/{{PHARMACY_NAME}}/g, branch.name)
    .replace(/{{CLIENT_NAME}}/g, client.name)
    .replace(/{{MEDICATION_NAME}}/g, prescription.medicationName)
    .replace(/{{END_DATE}}/g, endDateStr)
    .replace(/{{DAYS_LEFT}}/g, String(daysLeft))
    .replace(/{{BRANCH_PHONE}}/g, branch.phone ?? 'your pharmacy')
    .replace(/{{BRANCH_EMAIL}}/g, branch.email ?? '')
    .replace(/{{ACCENT_COLOUR}}/g, accent)
    .replace(/{{LOGO_URL}}/g, logoHtml)

  await resend.emails.send({
    from: env.EMAIL_FROM,
    to: client.email,
    subject: `${urgency}Refill reminder: ${prescription.medicationName} (${daysLeft} day${daysLeft === 1 ? '' : 's'} left)`,
    html,
  })
}
