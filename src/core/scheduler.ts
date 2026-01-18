import { DatabaseConnection, env } from "@/config";
import { Client } from "discord.js";
import { baseEmbed } from "@/ui";


const db = DatabaseConnection.getInstance().getClient();

const lastNotificationTime = new Map<string, Date>();

const interval = env.NODE_ENV === "development"
	? 1000 * 60 // Every 5 minutes in development
	: 1000 * 60 * 60; // Every 1 hours in production

export const startReviewScheduler = (client: Client) => {
    console.log("Review scheduler started.");
    setInterval(async () => await sendDailyReviewReminders(client),
        interval,
    );
    setTimeout(() => sendDailyReviewReminders(client), 5000);
};

const sendDailyReviewReminders = async (client: Client) => {
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
            User: {
                include: {
                    UserSettings: true,
                },
            },
        },
    });
    const reviewsByUser = new Map<string, typeof pendingReviews>();
    for (const review of pendingReviews) {
        if (!reviewsByUser.has(review.userId)) reviewsByUser.set(review.userId, []);
        reviewsByUser.get(review.userId)!.push(review);
    }
    for (const [userId, userReviews] of reviewsByUser) {
        try {
            const firstReview = userReviews[0];
            const notificationsEnabled = firstReview?.User.UserSettings?.notificationsEnabled ?? true;
            if (!notificationsEnabled) {
                console.log(`Skipping notification for user ${userId} (notifications disabled)`);
                continue;
            }
            const lastNotification = lastNotificationTime.get(userId);
            const hoursSinceLastNotification = lastNotification
                ? (now.getTime() - lastNotification.getTime()) / (1000 * 60 * 60)
                : 24;
            if (hoursSinceLastNotification < 24) {
                console.log(`Skipping notification for user ${userId} (notified ${hoursSinceLastNotification.toFixed(1)}h ago)`);
                continue;
            }
            const user = await client.users.fetch(userId);
            
            const summaryEmbed = baseEmbed()
                .setTitle("📚 Daily Review Reminder")
                .setDescription(`You have **${userReviews.length}** page(s) ready for review!\n\u200B`);
            const topReviews = userReviews.slice(0, 5);
            for (const review of topReviews) {
                const topic = review.LearningPage.LearningSection.LearningTopic?.title || "Unknown";
                const section = review.LearningPage.LearningSection?.title || "Unknown";
                const page = review.LearningPage.title;
                const daysOverdue = Math.floor((now.getTime() - review.nextReviewAt!.getTime()) / (1000 * 60 * 60 * 24));
                
                const urgency = daysOverdue > 7 ? "🔴" : daysOverdue > 3 ? "🟡" : "🟢";
                summaryEmbed.addFields({
                    name: `${urgency} ${topic} › ${section}`,
                    value: `**${page}**${daysOverdue > 0 ? ` • Overdue by ${daysOverdue} day(s)` : ""}`,
                    inline: false,
                });
            }
            if (userReviews.length > 5) {
                summaryEmbed.addFields({
                    name: "\u200B",
                    value: `*...and ${userReviews.length - 5} more page(s)*`,
                });
            }
            summaryEmbed.addFields(
                {
                    name: "\u200B",
                    value: "\u200B",
                    inline: false,
                },
                {
                    name: "🚀 Get Started",
                    value:
                        "• `/learn review next` - See all pending reviews\n" +
                        "• `/learn review rate` - Start reviewing\n" +
                        "• `/settings notifications off` - Disable reminders",
                }
            );
            await user.send({ embeds: [summaryEmbed] });            
            lastNotificationTime.set(userId, now);
            console.log(`✅ Sent review reminder to user ${userId} (${userReviews.length} pending reviews)`);
        } catch (error) {
            console.error(
                `❌ Failed to send review reminder to user ${userId}:`,
                error
            );
        }
    }
    
    console.log(`Review scheduler check completed at ${now.toISOString()}`);
};
