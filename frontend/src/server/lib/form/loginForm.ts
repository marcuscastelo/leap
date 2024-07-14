import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export type LoginFormData = z.infer<typeof loginSchema>

export function validateLoginForm(data: FormData) {
  const result = loginSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const diagnostics = result.error.flatten().fieldErrors
    const firstDiagnostics = Object.entries(diagnostics).map(
      ([field, diagnostics]) => {
        return {
          [field]: `${field}: ${diagnostics[0] ?? undefined}`,
        }
      },
    )

    const errors = firstDiagnostics.reduce((acc, curr) => {
      return {
        ...acc,
        ...curr,
      }
    }) as Partial<LoginFormData>

    return {
      data: null,
      errors,
    }
  }

  return {
    data: result.data,
    errors: null,
  }
}
