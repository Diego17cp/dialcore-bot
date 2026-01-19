import { ChatInputCommandInteraction } from "discord.js";
import { LearningService } from "../services";
import { learningEmbeds, sharedEmbeds } from "@/ui";
import { slugify } from "../utils/learning.utils";
import { title } from "node:process";

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
        if (!await learning.topics.getTopicBySlug(userId, guildId, topic)) return await interaction.reply({
            embeds: [learningEmbeds.topicNotFound(topic)],
            flags: "Ephemeral"
        })
        if (!await learning.sections.getSectionBySlug(userId, guildId, topic, section)) return await interaction.reply({
            embeds: [learningEmbeds.sectionNotFound(section, topic)],
            flags: "Ephemeral"
        })
		await learning.pages.createPage(
			userId,
			guildId,
			topic,
			section,
			title,
			content,
			emphasis,
		);
        return await interaction.reply({
            embeds: [learningEmbeds.pageCreated(title, slugify(title), section, topic)],
        });
	}
    if (sub === "update") {
        const pageSlug = interaction.options.getString("page", true);
        const newTitle = interaction.options.getString("title", false);
        const newContent = interaction.options.getString("content", false);
        const newEmphasis = interaction.options.getString("emphasis", false) || null;
        const page = await learning.pages.getPageBySlug(userId, guildId, topic, section, pageSlug);
        if (!page) return await interaction.reply({ embeds: [learningEmbeds.pageNotFound(pageSlug, section, topic)], flags: "Ephemeral" });
        await learning.pages.updatePage(
            page.id,
            userId,
            newTitle || undefined,
            newContent || undefined,
            newEmphasis !== null ? newEmphasis : undefined
        );
        const fields = [];
        if (newTitle && newTitle !== page.title) {
            fields.push({ name: "📝 New Title", value: `\`${page.title}\` ➔ \`${newTitle}\`` });
            fields.push({ name: "📌 New Slug", value: `\`${page.slug}\` ➔ \`${slugify(newTitle)}\`` });
        }
        if (newContent && newContent !== page.content) fields.push({ name: "✏️ Content Updated", value: `The content of the page has been updated.` });
        if (newEmphasis !== null && newEmphasis !== page.emphasis) fields.push({ name: "💡 New Emphasis", value: `\`${page.emphasis || "None"}\` ➔ \`${newEmphasis}\`` });

        return await interaction.reply({
            embeds: [learningEmbeds.pageUpdated(title, page.slug, fields)],
        });
    }
    if (sub === "delete") {
        const pageSlug = interaction.options.getString("page", true);
        const page = await learning.pages.getPageBySlug(userId, guildId, topic, section, pageSlug);
        if (!page) return await interaction.reply({ embeds: [learningEmbeds.pageNotFound(pageSlug, section, topic)], flags: "Ephemeral" });
        await learning.pages.deletePage(page.id, userId);
        return await interaction.reply({ embeds: [learningEmbeds.pageDeleted(page.title, page.slug)] });
    }
    if (sub === "list") {
        const topicData = await learning.topics.getTopicBySlug(userId, guildId, topic);
        if (!topicData) return await interaction.reply({ embeds: [learningEmbeds.topicNotFound(topic)], flags: "Ephemeral" });
        
        const sectionData = await learning.sections.getSectionBySlug(userId, guildId, topic, section);
        if (!sectionData) return await interaction.reply({ embeds: [learningEmbeds.sectionNotFound(section, topic)], flags: "Ephemeral" });
        const pages = await learning.pages.getPagesBySection(sectionData.id);
        if (pages.length === 0) return await interaction.reply({ embeds: [learningEmbeds.noPagesInSection(section, topic)], flags: "Ephemeral" });
        const pageList = pages.map(pg => `• **${pg.title}** (\`${pg.slug}\`)`).join("\n");
        return await interaction.reply({
            embeds: [learningEmbeds.pagesList(
                `📚 All available pages in section **${section}** of topic **${topic}**`,
                pageList,
                `Total Pages: ${pages.length}`
            )],
        });
    }
    if (sub === "read") {
        const pageSlug = interaction.options.getString("page", true);
        const page = await learning.pages.getPageBySlug(userId, guildId, topic, section, pageSlug);
        if (!page) return await interaction.reply({ embeds: [learningEmbeds.pageNotFound(pageSlug, section, topic)], flags: "Ephemeral" });
        return await interaction.reply({
            embeds: [learningEmbeds.pageContent(
                page.title,
                page.slug,
                section,
                topic,
                page.content,
                page.emphasis
            )],
        });
    }
    return await interaction.reply({
        embeds: [sharedEmbeds.unknownSubcommand()],
        flags: "Ephemeral"
    });
};
