import { Elysia } from 'elysia';
import { getQuestStatus } from '~/routes/quests/helpers/getQuestStatus';
import { getRewardEligibility } from '~/routes/rewards/helpers/getRewardEligibility';
import { isRewardClaimed } from '~/routes/rewards/helpers/isRewardClaimed';
import { ParticipantValidator } from '~/types/models/Participant';
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

  .post('/register', async ({ body, request }) => {
    try {
      const userRequestData = ParticipantValidator.parse(body)
      const token = getAuthorizationToken(request)
      const isRegistered = await isParticipantRegistered(token)

      if (isRegistered) {
        throw new Error('Participant already registered')
      }

      await registerUser(userRequestData, token)

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
          message: error.message,
        },
      }
    }
  })

  .get('/isRegistered', async ({ request }) => {
    try {
      const user = await getLineUserFromRequest(request)
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
          message: error.message,
        },
      }
    }
  })

  .get('/me', async ({ request }) => {
    try {
      const { userId } = await getLineUserFromRequest(request)
      const userRecord = await getUserRecordFromLineUId(userId)

      if (!userRecord) {
        throw new Error('Participant not found')
      }

      const questStatus = await getQuestStatus(userRecord.id)
      const eligibleForReward = await getRewardEligibility(questStatus)
      const isClaimed = await isRewardClaimed(userRecord.id)

      return {
        success: true,
        payload: {
          name: `${userRecord.firstName} ${userRecord.lastName}`,
          language: userRecord.language,
          profileImage: userRecord.linePicture,
          isRewardEligible: eligibleForReward,
          isRewardClaimed: isClaimed,
          quests: questStatus,
        },
      }
    } catch (error) {
      return {
        success: false,
        payload: {
          message: error.message,
        },
      }
    }
  })
