import { ChatInputCommandInteraction } from "discord.js";
import { LearningService } from "../services";
import { learningEmbeds, sharedEmbeds } from "@/ui";
import { slugify } from "../utils/learning.utils";

const learning = new LearningService();

export const handleSectionCommand = async(interaction: ChatInputCommandInteraction) => {
    const sub = interaction.options.getSubcommand();
    const userId = interaction.user.id;
    const guildId = interaction.guildId;

    const topic = interaction.options.getString("topic", true);
    const topicData = await learning.topics.getTopicBySlug(userId, guildId, topic);
    if (!topicData) {
        return await interaction.reply(`Topic "${topic}" not found.`);
    }
    if (sub === "add") {
        const title = interaction.options.getString("title", true);
        const slug = slugify(title);
        await learning.sections.createSection(userId, guildId, topic, title);
        return await interaction.reply({
            embeds: [
                learningEmbeds.sectionCreated(title, slug, topic, topicData.topic.title)
            ]
        });
    }
    if (sub === "update") {
        const sectionSlug = interaction.options.getString("section", true);
        const newTitle = interaction.options.getString("title", false);
        const section = await learning.sections.getSectionBySlug(userId, guildId, topic, sectionSlug);
        if (!section) {
            return await interaction.reply({
                embeds: [learningEmbeds.sectionNotFound(topic, sectionSlug)],
                flags: "Ephemeral"
            });
        }
        const fields = [];
        if (newTitle && newTitle !== section.title) {
            fields.push({ name: "📝 New Title", value: `\`${section.title}\` ➔ \`${newTitle}\`` });
            fields.push({ name: "📌 New Slug", value: `\`${section.slug}\` ➔ \`${slugify(newTitle)}\`` });
        }
        await learning.sections.updateSection(section.id, newTitle || undefined);
        return await interaction.reply({
            embeds: [
                learningEmbeds.sectionUpdated(
                    section.title,
                    section.slug,
                    fields
                )
            ]
        })
    }
    if (sub === "delete") {
        const sectionSlug = interaction.options.getString("section", true);
        const section = await learning.sections.getSectionBySlug(userId, guildId, topic, sectionSlug);
        if (!section) {
            return await interaction.reply({
                embeds: [learningEmbeds.sectionNotFound(topic, sectionSlug)],
                flags: "Ephemeral"
            });
        }
        await learning.sections.deleteSection(section.id);
        return await interaction.reply({
            embeds: [learningEmbeds.sectionDeleted(section.title, section.slug)]
        });
    }
    if (sub === "list") {
        const topicData = await learning.topics.getTopicBySlug(userId, guildId, topic);
        if (!topicData) {
            return await interaction.reply({
                embeds: [learningEmbeds.topicNotFound(topic)],
                flags: "Ephemeral"
            });
        }
        const sections = await learning.sections.getSectionsByTopic(topicData.topic.id);
        if (sections.length === 0) {
            return await interaction.reply({
                embeds: [learningEmbeds.noSectionsInTopic(topic)],
                flags: "Ephemeral"
            });
        }
        const sectionList = sections.map(sec => `• \`${sec.slug}\` - ${sec.title}`).join("\n");
        return await interaction.reply({
            embeds: [
                learningEmbeds.sectionsList(
                    `📚 All Available Sections in Topic: ${topicData.topic.title}`,
                    sectionList,
                    `Total: ${sections.length} section${sections.length !== 1 ? 's' : ''}`
                )
            ]
        });
    }
    if (sub === "view") {
        const slug = interaction.options.getString("section", true);
        const section = await learning.sections.getSectionBySlug(userId, guildId, topic, slug);
        if (!section) {
            return await interaction.reply({
                embeds: [learningEmbeds.sectionNotFound(topic, slug)],
                flags: "Ephemeral"
            });
        }
        const pages = await learning.pages.getPagesBySection(section.id);
        return await interaction.reply({
            embeds: [
                learningEmbeds.sectionView(
                    section.title,
                    section.slug,
                    topicData.topic.title,
                    topic,
                    pages.map(p => ({ title: p.title, slug: p.slug })),
                    pages.length
                )
            ]
        })
    }
    return interaction.reply({
        embeds: [sharedEmbeds.unknownSubcommand()],
        flags: "Ephemeral" 
    });
}