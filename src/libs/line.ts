import type { ClientConfig } from '@line/bot-sdk'
import { Client } from '@line/bot-sdk'
import { env } from '~/config/env'

const lineConfig: ClientConfig = {
    channelAccessToken: env.LINE_MESSAGING_API_CHANNEL_ACCESS_TOKEN || '',
    channelSecret: env.LINE_MESSAGING_API_CHANNEL_SECRET || undefined,
}

export const LINEClient = new Client(lineConfig)
