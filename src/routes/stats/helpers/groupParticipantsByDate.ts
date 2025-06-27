import { Elysia } from 'elysia'
import dayjs from '~/utils/dayjs'
import { getParticipants } from './getParticipants'
import { ParticipantDocument } from '~/models/participant.model'

const groupParticipantsByDate = (
  participants: Awaited<ReturnType<typeof getParticipants>>,
) => {
  return participants.reduce((acc, participant) => {
    const dateFormatted = dayjs(participant.createdAt).format('YYYY-MM-DD')

    if (!acc[dateFormatted]) {
      acc[dateFormatted] = []
    }

    acc[dateFormatted].push(participant)
    return acc
  }, {} as Record<string, Array<ParticipantDocument>>)
}

const app = new Elysia()

app.get('/participants/grouped-by-date', async () => {
  const participants = await getParticipants()
  const grouped = groupParticipantsByDate(participants)
  return grouped
})

app.listen(3000)

console.log('🦊 Elysia server running at http://localhost:3000')
