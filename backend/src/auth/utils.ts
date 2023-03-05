import { decode } from 'jsonwebtoken'

import { JwtPayload } from './JwtPayload'

export function parseToken(jwtToken: string): string {
  const decodedJwt = decode(jwtToken) as JwtPayload
  return decodedJwt.sub
}
