import { prisma } from '~/lib/prisma'
async function seed() {
  const user = await prisma.user.create({
    data: {
      name: 'Marucs',
      email: 'test@abc.com',
      password: '123456',
      slug: 'marcus',
    },
  })
  console.log(`Created user with id: ${user.id}`)

  const channel = await prisma.channel.create({
    data: {
      name: 'Marucs Channel',
      slug: 'marcus-channel',
      description: 'This is Marcus channel',
      picture: 'https://via.placeholder.com/150',
      ownerId: user.id,
    },
  })
  console.log(`Created channel with id: ${channel.id}`)
}

seed().then(async () => {
  console.log('Database seeded')

  const users = await prisma.user.findMany()
  const channels = await prisma.channel.findMany()

  console.dir(users)
  console.dir(channels)

  prisma.$disconnect()
})
