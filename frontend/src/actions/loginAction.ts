'use server'

import { redirect } from 'next/navigation'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export async function loginAction(_: unknown, data: FormData) {
  console.dir(data)
  const result = loginSchema.safeParse(Object.fromEntries(data))

  if (result.error) {
    const diagnostics = result.error.flatten().fieldErrors as Record<
      string,
      string[]
    >
    const firstDiagnostics = Object.keys(diagnostics).map((key) => {
      return {
        [key]: `${key}: ${diagnostics[key][0]}`,
      }
    })

    const error = firstDiagnostics.reduce((acc, curr) => {
      return {
        ...acc,
        ...curr,
      }
    })

    return {
      error,
    }
  }

  redirect('/')

  return {
    error: undefined,
  }
}
