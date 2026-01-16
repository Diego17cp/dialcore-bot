import dotenv from "dotenv";

dotenv.config();

export const env = {
    DATABASE_URL: process.env.DATABASE_URL || "",
    DISCORD_TOKEN: process.env.DISCORD_TOKEN || "",
    APP_ID: process.env.APP_ID || ""
}