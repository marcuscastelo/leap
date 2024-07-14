'server-only'

import { JWTPayload, SignJWT, jwtVerify } from 'jose'

const PRIVATE_KEY = new TextEncoder().encode('secret')
const ENCRYPTION_ALGORITHM = 'HS256'

export async function encrypt(
  payload: JWTPayload,
  expiresTimestampSeconds: number,
): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: ENCRYPTION_ALGORITHM })
    .setIssuedAt(Date.now() / 1000)
    .setIssuer('leaptv.com')
    .setExpirationTime(expiresTimestampSeconds)
    .sign(PRIVATE_KEY)
}

export async function decrypt(token: string | undefined) {
  if (!token) {
    return null
  }

  try {
    const { payload } = await jwtVerify(token, PRIVATE_KEY, {
      algorithms: [ENCRYPTION_ALGORITHM],
    })
    return payload
  } catch (error) {
    return null
  }
}
