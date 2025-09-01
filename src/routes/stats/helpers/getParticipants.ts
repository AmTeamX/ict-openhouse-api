import { Elysia } from 'elysia'
import EduLevels from '~/const/register/eduLevel'
import Provinces from '~/const/register/province'
import Participant from '~/models/participant.model'

export const participantsRoute = new Elysia().get('/participants', async ({ query }) => {
  try {
    const participants = await Participant.find(query)

    const participantFormatted = participants
      .filter((value, index, self) => {
        return (
          self.findIndex((v) =>
            (v.lineUserId && v.lineUserId === value.lineUserId) ||
            v.email === value.email
          ) === index
        )
      })
      .map((participant) => {
        const participantJson = participant.toJSON()

        participantJson.__v = undefined
        participantJson.updatedAt = undefined

        participantJson.province =
          Provinces.find((x) => x.province_id === participant.province)?.value ||
          'ไม่ระบุ'

        participantJson.educationLevel =
          EduLevels.find((x) => x.id === participant.educationLevel)?.value ||
          'ไม่ระบุ'

        return participantJson
      })

    console.log('[getParticipants]', participantFormatted.length, 'records')

    return {
      success: true,
      count: participantFormatted.length,
      data: participantFormatted,
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    }
  }
})
