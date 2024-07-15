import fastify from 'fastify'

// Use fastify as a relay that forwards all requests to the backend
const relay = fastify()

const RELAY_URL = process.env.RELAY_URL ?? 'localhost:80'

relay.get('/', async (request, reply) => {
  reply.send({ hello: 'world' })
})

relay.all('/*', async (request, reply) => {
  console.log(`Forwarding request to ${RELAY_URL}${request.url}`)
  const response = await fetch(`${RELAY_URL}${request.url}`, {
    method: request.method,
    headers: request.headers,
    body: request.body,
  })
  console.log(`Received response from ${RELAY_URL}${request.url}`)
  console.log(response)
  reply.send(response)
})

// Listen for incoming requests
relay.listen({ port: process.env.PORT ?? 3000 }).then(() => {
  console.log('Relay running on port 3000')
})
