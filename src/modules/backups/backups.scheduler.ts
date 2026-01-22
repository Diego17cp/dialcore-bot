import { DatabaseConnection, env } from "@/config";
import { client, scheduler } from "@/core";

const db = DatabaseConnection.getInstance().getClient();
const OWNER_ID = env.ADMIN_USER_IDS[0];
const INTERVAL =
	env.NODE_ENV === "development"
		? 1000 * 60 * 5 // 5 minutes
		: 1000 * 60 * 60 * 24; // 24 hours

scheduler.register({
	name: "backup-database",
	interval: INTERVAL,
	run: async () => {
		try {
			const backup = {
				meta: {
					createdAt: new Date().toISOString(),
					env: env.NODE_ENV,
				},
				users: await db.user.findMany(),
				userSettings: await db.userSettings.findMany(),
				guilds: await db.guild.findMany(),
				guildConfigs: await db.guildConfig.findMany(),
				guildUsers: await db.guildUser.findMany(),
				learningTopics: await db.learningTopic.findMany(),
				learningSections: await db.learningSection.findMany(),
				learningPages: await db.learningPage.findMany(),
				learningReviews: await db.learningReview.findMany(),
				todos: await db.todo.findMany(),
				pomodoros: await db.pomodoro.findMany(),
			};
            const json = JSON.stringify(backup, null, 2);
            const buffer = Buffer.from(json, "utf-8");
            const owner = await client.users.fetch(OWNER_ID!);
            await owner.send({
                content: `Database Backup - ${new Date().toISOString()}`,
                files: [
                    {
                        attachment: buffer,
                        name: `dialcore-backup-${new Date().toISOString().slice(0, 10)}.json`,
                    }
                ]
            })
            console.log("Database backup sent to owner.");
		} catch (error) {
			console.error("Error during database backup:", error);
		}
	},
});
