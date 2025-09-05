import { LINEClient } from '~/libs/line'
import { Participant } from '~/models/Participant.model'
import { BASE_URL } from '~/static/config'
import { FLEX_IG_FILTER, FLEX_TICKET_BUBBLE } from '~/static/line/flex-messages'
import { getLiffUrl } from '~/static/line/liff'

export const sendTicketToLine = async (
  lineUid: string,
  profile: Participant
): Promise<void> => {
  const isThai = profile.language === 'th'

  const welcomeText = isThai
    ? `ยินดีต้อนรับ ${profile.firstName} ${profile.lastName} สู่กิจกรรม MUICT Open House 2025`
    : `Welcome ${profile.firstName} ${profile.lastName} to MUICT Open House 2025`

  const altTicketText = isThai
    ? 'นี่คือตั๋วของคุณ ขอให้คุณสนุกกับการเข้าร่วมกิจกรรมมหิดลวิชาการ เปิดบ้านมหิดล 2568'
    : 'This is your ticket, Enjoy the ICT Mahidol Open House 2025'

  const carouselContents = [
    {
      type: "bubble" as const,
      hero: {
        type: "image" as const,
        url: `${BASE_URL}/static/line/images/carousel-agenda.jpg`,
        size: "full" as const,
        aspectRatio: "765:657",
        aspectMode: "cover" as const,
        action: {
          type: "uri" as const,
          label: "Agenda",
          uri: getLiffUrl("/agenda"),
        },
      },
    },
    {
      type: "bubble" as const,
      hero: {
        type: "image" as const,
        url: `${BASE_URL}/static/line/images/carousel-my-passport.jpg`,
        size: "full" as const,
        aspectRatio: "765:657",
        aspectMode: "cover" as const,
        action: {
          type: "uri" as const,
          label: "My Passport",
          uri: getLiffUrl("/quest"),
        },
      },
    },
    {
      type: "bubble" as const,
      hero: {
        type: "image" as const,
        url: `${BASE_URL}/static/line/images/carousel-scan.jpg`,
        size: "full" as const,
        aspectRatio: "765:657",
        aspectMode: "cover" as const,
        action: {
          type: "uri" as const,
          label: "Scan",
          uri: "https://line.me/R/nv/QRCodeReader",
        },
      },
    },
  ]

  await LINEClient.pushMessage(lineUid, [
    {
      type: 'text',
      text: welcomeText,
    },
    {
      type: 'flex',
      altText: 'Ticket Filter',
      contents: FLEX_IG_FILTER(),
    },
    {
      type: 'flex',
      altText: 'Important Links',
      contents: {
        type: 'carousel',
        contents: carouselContents,
      },
    },
    {
      type: 'flex',
      altText: altTicketText,
      contents: FLEX_TICKET_BUBBLE(
        profile.lineDisplayName || "",
        profile.linePicture || ""
      ),
    },
  ])
}
