import ParticipantSchema from "~/schemas/Participant.schema"

export const getUserRecordFromLineUId = async (
  uId: string,
  toThrow = false
) => {
  const user = await ParticipantSchema.findOne({ lineUserId: uId }).exec()
  if (!user && toThrow) {
    throw new Error('Participant not found')
  }
  return user
}
