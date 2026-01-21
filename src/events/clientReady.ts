import { Client } from "discord.js";
import { startReviewScheduler } from "@/core";

export const handleClientReady = (client: Client) => {
	console.log(`Logged in as ${client.user?.tag}`);
	console.log(`Serving ${client.guilds.cache.size} guild(s)`);
	startReviewScheduler(client);
};
