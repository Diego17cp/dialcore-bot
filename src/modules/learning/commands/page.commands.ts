import { ChatInputCommandInteraction } from "discord.js";
import { LearningService } from "../services";

const learning = new LearningService();

export const handlePageCommand = async (
	interaction: ChatInputCommandInteraction,
) => {
	const sub = interaction.options.getSubcommand();
	const userId = interaction.user.id;
	const guildId = interaction.guildId;

	const topic = interaction.options.getString("topic", true);
	const section = interaction.options.getString("section", true);

	if (sub === "add") {
		const title = interaction.options.getString("title", true);
		const content = interaction.options.getString("content", true);
		const emphasis = interaction.options.getString("emphasis", false) || null;
		await learning.pages.createPage(
			userId,
			guildId,
			topic,
			section,
			title,
			content,
			emphasis,
		);
        return await interaction.reply(`Page "${title}" created in section "${section}" of topic "${topic}".`);
	}
    if (sub === "update") {
        const pageSlug = interaction.options.getString("page", true);
        const newTitle = interaction.options.getString("title", false);
        const newContent = interaction.options.getString("content", false);
        const newEmphasis = interaction.options.getString("emphasis", false) || null;
        const page = await learning.pages.getPageBySlug(userId, guildId, topic, section, pageSlug);
        if (!page) {
            return await interaction.reply(`Page "${pageSlug}" not found in section "${section}" of topic "${topic}".`);
        }
        await learning.pages.updatePage(
            page.id,
            userId,
            newTitle || undefined,
            newContent || undefined,
            newEmphasis !== null ? newEmphasis : undefined
        );
        return await interaction.reply(`Page "${pageSlug}" updated in section "${section}" of topic "${topic}".`);
    }
    if (sub === "delete") {
        const pageSlug = interaction.options.getString("page", true);
        const page = await learning.pages.getPageBySlug(userId, guildId, topic, section, pageSlug);
        if (!page) {
            return await interaction.reply(`Page "${pageSlug}" not found in section "${section}" of topic "${topic}".`);
        }
        await learning.pages.deletePage(page.id, userId);
        return await interaction.reply(`Page "${pageSlug}" deleted from section "${section}" of topic "${topic}".`);
    }
    if (sub === "list") {
        const topicData = await learning.topics.getTopicBySlug(userId, guildId, topic);
        if (!topicData) {
            return await interaction.reply(`Topic "${topic}" not found.`);
        }
        const sectionData = await learning.sections.getSectionBySlug(userId, guildId, topic, section);
        if (!sectionData) {
            return await interaction.reply(`Section "${section}" not found in topic "${topic}".`);
        }
        const pages = await learning.pages.getPagesBySection(sectionData.id);
        if (pages.length === 0) {
            return await interaction.reply(`No pages found in section "${section}" of topic "${topic}".`);
        }
        const pageList = pages.map(pg => `- ${pg.title} (slug: ${pg.slug})`).join("\n");
        return await interaction.reply(`Pages in section "${section}" of topic "${topic}":\n${pageList}`);
    }
    return await interaction.reply("Unknown subcommand.");
};
