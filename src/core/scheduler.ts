import { DatabaseConnection } from "@/config";
import { Client } from "discord.js";

const db = DatabaseConnection.getInstance().getClient();

export const startReviewScheduler = (client: Client) => {
	console.log("Review scheduler started.");
	setInterval(
		async () => {
			const now = new Date();
			const pendingReviews = await db.learningReview.findMany({
				where: {
					nextReviewAt: {
						lte: now,
					},
				},
				include: {
					LearningPage: {
						include: {
							LearningSection: {
								include: {
									LearningTopic: true,
								},
							},
						},
					},
					User: true,
				},
			});
			for (const review of pendingReviews) {
				try {
					const user = await client.users.fetch(review.userId);
					await user.send(`
                    You have a pending review for the page "${review.LearningPage.title}" in the topic "${review.LearningPage.LearningSection?.LearningTopic?.title || "Unknown Topic"}". It's time to review it!`);
				} catch (error) {
					console.error(
						`Failed to send review reminder to user ${review.userId}:`,
						error,
					);
				}
			}
		},
		1000 * 60 * 15,
	); // Check every 15 minutes
};
