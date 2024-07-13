import fastify from 'fastify'
import { env } from '~/env'

const app = fastify()

app.get('/', (request, reply) => {
  reply.send({ hello: 'world' })
})

app.listen({ port: 3333 }).then(() => {
  console.log('Server running on port 3333')
})

console.log(env.DATABASE_URL) // Prints the value of process.
