'use server'

import { redirect } from 'next/navigation'
import { validateLoginForm } from '../lib/form/loginForm'
import { createAccessToken } from '../lib/auth'
import { cookies } from 'next/headers'

export async function loginAction(_: unknown, data: FormData) {
  const result = validateLoginForm(data)

  if (result.errors) {
    return {
      errors: result.errors,
    }
  }

  const { accessToken, cookie } = await createAccessToken({
    userId: result.data.email,
  })

  cookies().set(cookie.name, accessToken, cookie)

  redirect('/')
}
