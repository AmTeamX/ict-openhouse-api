import { Elysia } from 'elysia'
import { getParticipants } from './helpers/getParticipants'
import { groupParticipantsByDate } from './helpers/groupParticipantsByDate'

export const statsRouter = new Elysia({ prefix: '/stats' })
  .get('/', () => {
    return new Response(
      JSON.stringify({
        message: 'This stats endpoint is working!',
      }),
      {
        status: 204,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  })
  .get('/total', async () => {
    try {
      const participants = await getParticipants()
      const participantsByDate = groupParticipantsByDate(participants)

      const totalParticipants = Object.values(participantsByDate).reduce(
        (acc: number, arr) => acc + (arr as any[]).length,
        0
      )

      const totalParticipantsByDate = Object.fromEntries(
        Object.entries(participantsByDate).map(([date, list]) => [date, (list as any[]).length])
      )

      return {
        success: true,
        payload: {
          total: totalParticipants,
          dates: totalParticipantsByDate,
          timestamp: new Date().toISOString(),
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
