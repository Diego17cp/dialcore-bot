import { Client } from "discord.js";
import { scheduler } from "@/core";

import "@/modules/learning/learning.scheduler";
import "@/modules/pomodoro/pomodoro.scheduler";
import "@/modules/backups/backups.scheduler";

export const handleClientReady = (client: Client) => {
	console.log(`Logged in as ${client.user?.tag}`);
	console.log(`Serving ${client.guilds.cache.size} guild(s)`);
	scheduler.start();
};
