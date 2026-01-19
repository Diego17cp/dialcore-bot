import { Client, GatewayIntentBits, Partials } from "discord.js";
import { DatabaseConnection, env } from "./config";
import { registerCommands } from "./scripts/register-commands";
import { startReviewScheduler } from "./core";
import { handleInteraction } from "./events";

const start = async () => {
    try {
        console.log("Application started.");
        await registerCommands();
        const client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent
            ],
            partials: [Partials.Channel]
        })

        await DatabaseConnection.getInstance().connect();
        console.log(DatabaseConnection.getInstance().getStatus());

        client.once("clientReady", () => {
            console.log(`Logged in as ${client.user?.tag}`);
            console.log(`Serving ${client.guilds.cache.size} guild(s)`);
            startReviewScheduler(client);
        },);
        client.on("interactionCreate", handleInteraction)

        await client.login(env.DISCORD_TOKEN);
        
        console.log("Dialcore Bot is running.");
    } catch (error) {
        console.error("Error during application startup:", error);
        process.exit(1);
    }
}
start();