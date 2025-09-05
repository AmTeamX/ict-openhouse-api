import axios from 'axios'
import { Elysia, t } from 'elysia'
import { stringify } from 'qs'
import { z } from 'zod'

const LineUserProfileValidator = z.object({
  userId: z.string(),
  displayName: z.string(),
  picture: z.string(),
  email: z.string().email().optional(),
})

export type LineUserProfile = z.infer<typeof LineUserProfileValidator>

interface IVerifyIdTokenResponse {
  iss: string
  sub: string
  aud: string
  exp: number
  iat: number
  nonce: string
  amr: ('pwd' | 'lineautologin' | 'lineqr' | 'linesso')[]
  name: string
  picture: string
  email?: string
}

export const getLineUserFromIdToken = async (
  idToken: string,
): Promise<LineUserProfile> => {
  try {
    const { data } = await axios.post<IVerifyIdTokenResponse>(
      'https://api.line.me/oauth2/v2.1/verify',
      stringify({
        id_token: idToken,
        client_id: process.env.LINE_LOGIN_CHANNEL_ID,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    )

    return {
      userId: data.sub,
      displayName: data.name,
      picture: data.picture,
      email: data.email,
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error verifying LINE Id token:', error.response?.data)
      throw new Error(error.response?.data.error_description ?? 'Unknown error')
    }
    throw new Error('Invalid LINE Id token')
  }
}

export const lineLoginRouter = new Elysia({ prefix: '/line' })

  .post('/verify', async ({ body }) => {
    try {
      const { idToken } = body as { idToken: string }

      const user = await getLineUserFromIdToken(idToken)

      const validated = LineUserProfileValidator.parse(user)

      return {
        success: true,
        payload: validated,
      }
    } catch (error) {
      return {
        success: false,
        payload: {
          message:
            error instanceof Error ? error.message : 'Unknown server error',
        },
      }
    }
  }, {
    body: t.Object({
      idToken: t.String(),
    }),
  })
