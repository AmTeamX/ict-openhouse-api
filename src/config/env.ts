import { config } from 'dotenv'
import { z } from 'zod'

config()

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']),
    PORT: z.string().optional().default('5001'),
    APP_BASE_URL: z.string().url(),
    LIFF_ID: z.string(),
    MONGODB_URI: z.string(),
    LINE_MESSAGING_API_CHANNEL_ACCESS_TOKEN: z.string(),
    LINE_MESSAGING_API_CHANNEL_SECRET: z.string(),
    LINE_LOGIN_CHANNEL_ID: z.string(),
    LINE_RICH_MENU_ID_DEFAULT: z.string(),
    LINE_RICH_MENU_ID_REGISTERED: z.string(),
})

export const env = envSchema.parse(process.env)