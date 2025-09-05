import { Participant as IParticipant } from '~/models/Participant.model'
import Participant from '~/schemas/Participant.schema'
import Registration from '~/schemas/Registration.schema'
import { getLineUserFromIdToken } from './getLineUserFromIdToken'

const registerUser = async (
  data: IParticipant,
  lineToken?: string
) => {
  try {
    const payload: Partial<IParticipant> & {
      lineUserId?: string
      lineDisplayName?: string
      linePicture?: string
    } = { ...data }

    if (lineToken) {
      const user = await getLineUserFromIdToken(lineToken)
      if (user) {
        Object.assign(payload, {
          lineUserId: user.userId,
          lineDisplayName: user.displayName,
          linePicture: user.picture,
        })
      }
    }

    const participant = await Participant.create(payload)

    // Register record creation
    await Registration.create({ participant: participant._id })

    // LINE integration
    if (participant.lineUserId) {
      // await sendTicketToLine(participant.lineUserId, participant)
      // await LINEClient.linkRichMenuToUser(
      //   participant.lineUserId,
      //   RICH_MENU_ID.REGISTERED
      // )
      console.log('LINE integration skipped')
    }

    return participant
  } catch (error: any) {
    console.error('Error in registerUser:', error)
    throw new Error(error.message || 'Registration failed')
  }
}

export default registerUser
