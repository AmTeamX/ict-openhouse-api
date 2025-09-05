import { Participant } from '~/models/Participant.model'
import { getLineUserFromIdToken } from '~/routes/users/helpers/getLineUserFromIdToken'
import { getUserRecordFromLineUId } from '~/routes/users/helpers/getUserRecordFromLineUId'
import Evaluation from '~/schemas/Evaluation.schema'

const submitEvaluation = async (data: Participant, lineToken?: string) => {
  try {
    const payload = {
      ...data,
    }

    if (lineToken) {
      const user = await getLineUserFromIdToken(lineToken)
      const userRecord = await getUserRecordFromLineUId(user.userId)

      if (userRecord) {
        Object.assign(payload, {
          participant: userRecord._id,
        })
      }
    }

    const p = await Evaluation.create(payload)

    return p
  } catch (error: any) {
    throw new Error(error)
  }
}

export default submitEvaluation
