'server-only'

import { JWTPayload } from 'jose'
import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies'
import { decrypt, encrypt } from './jwt'
import { z } from 'zod'

export const ACCESS_TOKEN_COOKIE_NAME = 'LEAPTV_ACCESS_TOKEN'

const generateCookie = (expiresTimestampMs: number) =>
  <ResponseCookie>{
    name: ACCESS_TOKEN_COOKIE_NAME,
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
    expires: expiresTimestampMs,
  }

export const authDataSchema = z.object({
  userId: z.string(),
})

export type AuthData = z.infer<typeof authDataSchema>

export async function createAccessToken(authData: AuthData) {
  const expiresTimestampSeconds = Date.now() + 60 * 60 * 24
  const cookie = generateCookie(expiresTimestampSeconds * 1000)
  const accessTokenPayload: JWTPayload = {
    authData,
    expires: cookie.expires,
  }
  const accessToken = await encrypt(accessTokenPayload, expiresTimestampSeconds)
  return { accessToken, cookie }
}

export async function readAccessToken(token: string | undefined) {
  return await decrypt(token)
}
