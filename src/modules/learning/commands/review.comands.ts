import { ChatInputCommandInteraction } from "discord.js";
import { LearningService } from "../services";
import { learningEmbeds } from "@/ui";

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
			return await interaction.reply({
				embeds: [learningEmbeds.noDueReviews()],
				flags: "Ephemeral",
			});
		}
		const review = reviews[0];
		return await interaction.reply({
			embeds: [learningEmbeds.nextReview(
				review?.LearningPage.title || "",
				review?.LearningPage.LearningSection.title || "", 
				review?.LearningPage.LearningSection.LearningTopic.title || "", 
				review?.LearningPage.content || ""
			)],
		});
	}
    if (sub === "rate") {
        const topicSlug = interaction.options.getString("topic", true);
        const sectionSlug = interaction.options.getString("section", true);
        const pageSlug = interaction.options.getString("page", true);
        const rating = interaction.options.getInteger("confidence", true);

        const page = await learning.pages.getPageBySlug(userId, guildId, topicSlug, sectionSlug, pageSlug);
        if (!page) return await interaction.reply({
			embeds: [learningEmbeds.pageNotFound(topicSlug, sectionSlug, pageSlug)],
			flags: "Ephemeral",
		});
        await learning.reviews.reviewPage(page.id, userId, guildId, rating, username);
        return await interaction.reply({
			embeds: [learningEmbeds.ratedPage(
				page.title,
				rating
			)],
		});
    }
    return await interaction.reply({
		embeds: [learningEmbeds.unknownSubcommand()],
		flags: "Ephemeral",
	});
};
