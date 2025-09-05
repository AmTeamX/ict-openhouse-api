import { ParticipantDocument } from '~/schemas/Participant.schema'
import dayjs from '~/utils/dayjs'
import { getParticipants } from './getParticipants'

export const groupParticipantsByDate = (
  participants: Awaited<ReturnType<typeof getParticipants>>,
) => {
  return participants.reduce(
    (acc, participant) => {
      const { createdAt } = participant

      const dateFormatted = dayjs(createdAt).format('YYYY-MM-DD')

      if (!acc[dateFormatted]) {
        acc[dateFormatted] = []
      }

      acc[dateFormatted].push(participant)
      return acc
    },
    {} as Record<string, Array<ParticipantDocument>>,
  )
}
