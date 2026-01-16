import { env } from "@/config"

export const isBotAdmin = (userId: string): boolean => env.ADMIN_USER_IDS.includes(userId)