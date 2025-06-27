import { getUserRecordFromLineUId } from './getUserRecordFromLineUId'

const isParticipantRegistered = async (uid?: string): Promise<boolean> => {
  if (!uid) {
    return false
  }

  try {
    const userRecord = await getUserRecordFromLineUId(uid)
    return !!userRecord
  } catch (error) {
    console.error('Error checking participant registration:', error)
    return false
  }
}

export default isParticipantRegistered
