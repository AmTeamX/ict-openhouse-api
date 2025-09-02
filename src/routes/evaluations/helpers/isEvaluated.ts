import { getLineUserFromIdToken } from '~/routes/users/helpers/getLineUserFromIdToken'
import { getUserRecordFromLineUId } from '~/routes/users/helpers/getUserRecordFromLineUId'

const isEvaluated = async (token?: string) => {
  try {
    if (!token) {
      return false
    }

    const user = await getLineUserFromIdToken(token)
    const userRecord = await getUserRecordFromLineUId(user.userId)

    if (!userRecord) {
      return false
    }

    return true
  } catch (error: any) {
    throw new Error(error)
  }
}

export default isEvaluated
