import { prisma } from '../src/lib/prisma'
async function seed() {}

seed().then(() => {
  console.log('Database seeded')
  prisma
})
