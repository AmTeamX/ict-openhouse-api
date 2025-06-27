import { Elysia } from 'elysia'
import { BASE_URL } from '~/const/config'
import { LINEClient } from '~/libs/line'
import QuestLog, { QuestLogStatus } from '~/models/questlog.model'
import { getQuestStatus } from '../quests/helpers/getQuestStatus'
import { getLineUserFromRequest } from '../users/helpers/getLineUserFromRequest'
import { getUserRecordFromLineUId } from '../users/helpers/getUserRecordFromLineUId'
import { getRewardEligibility } from './helpers/getRewardEligibility'
import { isRewardClaimed } from './helpers/isRewardClaimed'

export const rewardsRouter = new Elysia({ prefix: '/rewards' })

  .get('/', () => {
    return new Response(null, { status: 204 })
  })

  .get('/isEligible', async ({ request }) => {
    try {
      const user = await getLineUserFromRequest(request)
      const userRecord = await getUserRecordFromLineUId(user.userId)

      const questStatus = await getQuestStatus(userRecord.id)
      const eligibleForReward = await getRewardEligibility(questStatus)
      const isClaimed = await isRewardClaimed(userRecord.id)

      return {
        success: true,
        payload: {
          name: `${userRecord.firstName} ${userRecord.lastName}`,
          language: userRecord.language,
          profileImage: userRecord.linePicture,
          isEligible: eligibleForReward,
          isClaimed,
          quests: questStatus,
        },
      }
    } catch (error: any) {
      return {
        success: false,
        payload: {
          message: error.message,
        },
      }
    }
  })

  .get('/claim', async ({ request }) => {
    try {
      const user = await getLineUserFromRequest(request)
      const userRecord = await getUserRecordFromLineUId(user.userId)

      if (!userRecord) {
        throw new Error('Participant not found')
      }

      const questStatus = await getQuestStatus(userRecord.id)
      const eligibleForReward = await getRewardEligibility(questStatus)
      const isClaimed = await isRewardClaimed(userRecord.id)

      if (!eligibleForReward || isClaimed) {
        return {
          success: true,
          payload: {
            isEligible: false,
            isClaimed,
          },
        }
      }

      await QuestLog.create({
        participant: userRecord.id,
        questNo: 0,
        status: QuestLogStatus.REWARD_CLAIM,
      })

      await LINEClient.unlinkRichMenuFromUser(user.userId)

      await LINEClient.pushMessage(user.userId, [
        {
          type: 'imagemap',
          baseUrl: `${BASE_URL}/static/line/images/op-thankyou`,
          altText: 'Thank you for joining the event!',
          baseSize: {
            width: 1040,
            height: 1749.65,
          },
          actions: [],
        },
        {
          type: 'text',
          text:
            'ติดตามพวกเราได้ที่\n\n' +
            'Facebook: fb.com/ict.mahidol.university\n' +
            'Instagram: instagram.com/ict_mahidol\n' +
            'Twitter: twitter.com/ict_mahidol\n' +
            'YouTube: youtube.com/ICTMahidol\n' +
            'Website: ict.mahidol.ac.th\n',
        },
      ])

      return {
        success: true,
        payload: {
          message: 'Reward claimed',
        },
      }
    } catch (error: any) {
      return {
        success: false,
        payload: {
          message: error.message,
        },
      }
    }
  })
