import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const org = await prisma.organization.create({
    data: { name: 'Pharmacy Organization' },
  })

  const passwordHash = await bcrypt.hash('ChangeMe123!', 12)

  const admin = await prisma.user.create({
    data: {
      organizationId: org.id,
      name: 'Super Admin',
      email: 'admin@pharmacy.ca',
      passwordHash,
      role: 'super_admin',
    },
  })

  console.log('Seed complete.')
  console.log('Organization:', org.id)
  console.log('Super admin email: admin@pharmacy.ca')
  console.log('Super admin password: ChangeMe123!  ← CHANGE THIS IMMEDIATELY')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
