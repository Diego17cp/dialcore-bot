import { DatabaseConnection, env } from "./config";
import { registerCommands } from "./scripts/register-commands";
import { handleClientReady, handleInteraction } from "./events";
import { client } from "./core";

const start = async () => {
    try {
        console.log("Application started.");
        await registerCommands();

        await DatabaseConnection.getInstance().connect();
        console.log(DatabaseConnection.getInstance().getStatus());

        client.once("clientReady", () => handleClientReady(client));
        client.on("interactionCreate", handleInteraction)

        await client.login(env.DISCORD_TOKEN);
        
        console.log("Dialcore Bot is running.");
    } catch (error) {
        console.error("Error during application startup:", error);
        process.exit(1);
    }
}
start();