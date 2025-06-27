import { RICH_MENU_ID } from '~/const/line/rich-menu'
import { LINEClient } from '~/libs/line'
import Participant from '~/models/participant.model'
import QuestLog from '~/models/questlog.model'
import Registration from '~/models/registration.model'
import { Participant as IParticipant } from '~/types/models/Participant'
import { getLineUserFromIdToken } from './getLineUserFromIdToken'
import { sendTicketToLine } from './sendTicketToLINE'

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

    // Initial quest log
    await QuestLog.create({
      participant: participant._id,
      questNo: 1,
      status: 'success',
    })

    // LINE integration
    if (participant.lineUserId) {
      await sendTicketToLine(participant.lineUserId, participant)
      await LINEClient.linkRichMenuToUser(
        participant.lineUserId,
        RICH_MENU_ID.REGISTERED
      )
    }

    return participant
  } catch (error: any) {
    console.error('Error in registerUser:', error)
    throw new Error(error.message || 'Registration failed')
  }
}

export default registerUser
