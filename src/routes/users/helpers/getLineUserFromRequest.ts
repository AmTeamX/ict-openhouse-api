import type { Context } from 'elysia'
import { getAuthorizationToken } from '~/utils/headers'
import { getLineUserFromIdToken } from './getLineUserFromIdToken'

export const getLineUserFromRequest = async (ctx: Context) => {
  try {
    const token = getAuthorizationToken(ctx.request)
    if (!token) {

      return null
    }

    const user = await getLineUserFromIdToken(token)
    return user
  } catch (error: any) {
    throw new Error(error.message)
  }
}
