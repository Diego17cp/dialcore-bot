import { ChatInputCommandInteraction } from "discord.js";
import { LearningService } from "../services";

const learning = new LearningService();

export const handleSectionCommand = async(interaction: ChatInputCommandInteraction) => {
    const sub = interaction.options.getSubcommand();
    const userId = interaction.user.id;
    const guildId = interaction.guildId;

    const topic = interaction.options.getString("topic", true);
    if (sub === "add") {
        const title = interaction.options.getString("title", true);
        await learning.sections.createSection(userId, guildId, topic, title);
        return await interaction.reply(`Section "${title}" created in topic "${topic}".`);
    }
    if (sub === "update") {
        const sectionSlug = interaction.options.getString("section", true);
        const newTitle = interaction.options.getString("title", false);
        const section = await learning.sections.getSectionBySlug(userId, guildId, topic, sectionSlug);
        if (!section) {
            return await interaction.reply(`Section "${sectionSlug}" not found in topic "${topic}".`);
        }
        await learning.sections.updateSection(section.id, newTitle || undefined);
        return await interaction.reply(`Section "${sectionSlug}" updated in topic "${topic}".`);
    }
    if (sub === "delete") {
        const sectionSlug = interaction.options.getString("section", true);
        const section = await learning.sections.getSectionBySlug(userId, guildId, topic, sectionSlug);
        if (!section) {
            return await interaction.reply(`Section "${sectionSlug}" not found in topic "${topic}".`);
        }
        await learning.sections.deleteSection(section.id);
        return await interaction.reply(`Section "${sectionSlug}" deleted from topic "${topic}".`);
    }
    if (sub === "list") {
        const topicData = await learning.topics.getTopicBySlug(userId, guildId, topic);
        if (!topicData) {
            return await interaction.reply(`Topic "${topic}" not found.`);
        }
        const sections = await learning.sections.getSectionsByTopic(topicData.topic.id);
        if (sections.length === 0) {
            return await interaction.reply(`No sections found in topic "${topic}".`);
        }
        const sectionList = sections.map(sec => `- ${sec.title} (slug: ${sec.slug})`).join("\n");
        return await interaction.reply(`Sections in topic "${topic}":\n${sectionList}`);
    }
    return await interaction.reply("Unknown subcommand.");
}