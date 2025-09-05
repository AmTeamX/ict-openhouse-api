import { Elysia } from 'elysia';
import { ParticipantValidator } from '~/models/Participant.model';
import { getAuthorizationToken } from '~/utils/headers';
import { getLineUserFromRequest } from './helpers/getLineUserFromRequest';
import { getUserRecordFromLineUId } from './helpers/getUserRecordFromLineUId';
import isParticipantRegistered from './helpers/isParticipantRegistered';
import registerUser from './helpers/registerUser';

export const usersRouter = new Elysia({ prefix: '/users' })

  .get('/', () => ({
    success: true,
    payload: {
      message: 'This users endpoint is working!',
    },
  }))

  .post('/register', async (context) => {
    try {
      const userRequestData = ParticipantValidator.parse(context.body)
      const token = getAuthorizationToken(context.request)
      const isRegistered = await isParticipantRegistered(token || "")

      if (isRegistered) {
        throw new Error('Participant already registered')
      }

      await registerUser(userRequestData, token!)

      return {
        success: true,
        payload: {
          message: 'Participant registered',
        },
      }
    } catch (error) {
      return {
        success: false,
        payload: {
          message: error instanceof Error ? error.message : String(error),
        },
      }
    }
  })

  .get('/isRegistered', async (Context) => {
    try {
      const user = await getLineUserFromRequest(Context)
      const isRegistered = user
        ? await isParticipantRegistered(user?.userId)
        : false

      return {
        success: true,
        payload: {
          isRegistered,
        },
      }
    } catch (error) {
      return {
        success: false,
        payload: {
          message: error instanceof Error ? error.message : String(error),
        },
      }
    }
  })

  .get('/me', async (context) => {
    try {
      const user = await getLineUserFromRequest(context)
      if (!user || !user.userId) {
        throw new Error('User not found')
      }
      const userRecord = await getUserRecordFromLineUId(user.userId)

      if (!userRecord) {
        throw new Error('Participant not found')
      }

      return {
        success: true,
        payload: {
          name: `${userRecord.firstName} ${userRecord.lastName}`,
          language: userRecord.language,
          profileImage: userRecord.linePicture,
        },
      }
    } catch (error) {
      return {
        success: false,
        payload: {
          message: error instanceof Error ? error.message : String(error),
        },
      }
    }
  })
