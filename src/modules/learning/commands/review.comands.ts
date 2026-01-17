import { ChatInputCommandInteraction } from "discord.js";
import { LearningService } from "../services";

const learning = new LearningService();

export const handleReviewCommand = async (
	interaction: ChatInputCommandInteraction,
) => {
	const sub = interaction.options.getSubcommand();
	const userId = interaction.user.id;
    const username = interaction.user.username;
	const guildId = interaction.guildId;

	if (sub === "next") {
		const reviews = await learning.reviews.listDueReviews(userId, guildId);
		if (reviews.length === 0) {
			return await interaction.reply(
				"You have no reviews due right now.",
			);
		}
		const review = reviews[0];
		return await interaction.reply(
			`Your next review is for page "${review?.LearningPage.title}" in section "${review?.LearningPage.LearningSection.title}" of topic "${review?.LearningPage.LearningSection.LearningTopic.title}".\n\nContent:\n${review?.LearningPage.content}`,
		);
	}
    if (sub === "rate") {
        const topicSlug = interaction.options.getString("topic", true);
        const sectionSlug = interaction.options.getString("section", true);
        const pageSlug = interaction.options.getString("page", true);
        const rating = interaction.options.getInteger("confidence", true);

        const page = await learning.pages.getPageBySlug(userId, guildId, topicSlug, sectionSlug, pageSlug);
        if (!page) return await interaction.reply(`Page "${pageSlug}" not found in section "${sectionSlug}" of topic "${topicSlug}".`);
        await learning.reviews.reviewPage(page.id, userId, guildId, rating, username);
        return await interaction.reply(`You rated page ID ${page.id} with a rating of ${rating}.`);
    }
    return await interaction.reply("Unknown subcommand.");
};
