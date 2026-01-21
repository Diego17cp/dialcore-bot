import dotenv from "dotenv";

dotenv.config();

export const env = {
    DATABASE_URL: process.env.DATABASE_URL || "",
    DISCORD_TOKEN: process.env.DISCORD_TOKEN || "",
    APP_ID: process.env.APP_ID || "",
    NODE_ENV: process.env.NODE_ENV || "development",
    ADMIN_USER_IDS: process.env.ADMIN_USER_IDS ? process.env.ADMIN_USER_IDS.split(",") : [],
    DOCS_URL: process.env.DOCS_URL || "https://dialcore.vercel.app",
    GITHUB_TOKEN: process.env.GITHUB_TOKEN || "",
}