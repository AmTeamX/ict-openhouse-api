import { Elysia } from 'elysia'
import { getParticipants } from './getParticipants'

export const groupParticipantsByType = (
  participants: Awaited<ReturnType<typeof getParticipants>>,
) => {
  const participantsGroupByRegType = participants.reduce(
    (acc, participant) => {
      const { regType, educationLevel } = participant
      let type = regType

      if (type === 'student' || type === 'uni_student') {
        type = `student_${educationLevel}`
      }

      if (!acc[type]) {
        acc[type] = []
      }

      acc[type].push(participant)
      return acc
    },
    {} as Record<string, Array<any>>,
  )

  return participantsGroupByRegType
}

// Elysia app route
const app = new Elysia()

app.get('/grouped-participants', async () => {
  const participants = await getParticipants()
  const grouped = groupParticipantsByType(participants)
  return grouped
})

app.listen(3000)
console.log('Server is running on http://localhost:3000')
