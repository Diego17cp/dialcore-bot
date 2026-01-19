import { ChatInputCommandInteraction } from "discord.js";
import { LearningService } from "../services";
import { isBotAdmin } from "@/core/utils";
import { learningEmbeds, sharedEmbeds } from "@/ui";
import { slugify } from "../utils/learning.utils";

const learning = new LearningService();

export const handleTopicCommand = async(interaction: ChatInputCommandInteraction) => {
    const sub = interaction.options.getSubcommand();
    const userId = interaction.user.id;
    const guildId = interaction.guild ? interaction.guild.id : null;
    
    if (sub === "add") {
        const title = interaction.options.getString("title", true);
        const description = interaction.options.getString("description", false) ?? null;
        const makeGlobal = interaction.options.getBoolean("global", false) || false;
        const topicUserId = makeGlobal ? null : userId;
        const topicGuildId = makeGlobal ? null : guildId;

        if (makeGlobal && !isBotAdmin(userId)){
            return interaction.reply({
                embeds: [sharedEmbeds.permissionDenied()],
                flags: "Ephemeral"
            });
        }
        await learning.topics.createTopic(topicUserId, topicGuildId, title, description);
        const scopeEmoji = makeGlobal ? "🌍" : guildId ? "🏠" : "📝";
        const scopeName = makeGlobal ? "Global" : guildId ? "Server" : "Personal";
        const ownerInfo = makeGlobal 
            ? "Available to all users" 
            : guildId 
                ? `Available to ${interaction.guild?.name} members` 
                : "Only visible to you";
        return interaction.reply({
            embeds: [
                learningEmbeds.topicCreated(
                    title,
                    slugify(title),
                    scopeEmoji,
                    scopeName,
                    description,
                    ownerInfo
                )
            ],
        });
    }
    if (sub === "list") {
        const scope = interaction.options.getString("scope", false) as 'personal' | 'server' | 'global' | 'all' | null;
        
        if (!guildId) {
            const personalTopics = await learning.topics.getTopicsByUser(userId, null);
            const globalTopics = await learning.topics.getGlobalTopics();
            if (scope === 'server') {
                return interaction.reply({
                    embeds: [sharedEmbeds.serverContextRequired()],
                    flags: "Ephemeral" 
                });
            }
            const lines: string[] = [];
            if (scope === 'personal' || scope === 'all' || scope === null) {
                if (personalTopics.length > 0) {
                    lines.push("**📝 Your Personal Topics:**");
                    personalTopics.forEach(t => lines.push(`• \`${t.slug}\` - ${t.title}`));
                    lines.push("");
                }
            }
            if (scope === 'global' || scope === 'all' || scope === null) {
                if (globalTopics.length > 0) {
                    lines.push("**🌍 Global Topics:**");
                    globalTopics.forEach(t => lines.push(`• \`${t.slug}\` - ${t.title}`));
                }
            }
            if (lines.length === 0) {
                return interaction.reply({
                    embeds: [learningEmbeds.noTopicsAvailable()],
                });
            }
            return interaction.reply({
                embeds: [learningEmbeds.topicsList("📚 Available Topics", lines.join("\n"))],
            });
        }
        const topics = await learning.topics.getAvailableTopics(userId, guildId!);

        let topicsToShow = [];
        let scopeLabel = "";
        let scopeEmoji = "";

        switch (scope) {
            case 'personal':
                topicsToShow = [...topics.personalServer, ...topics.personalGlobal];
                scopeLabel = "Your Personal Topics";
                scopeEmoji = "📝";
                break;
            case 'server':
                topicsToShow = topics.server;
                scopeLabel = "Server Topics";
                scopeEmoji = "🏠";
                break;
            case 'global':
                topicsToShow = topics.global;
                scopeLabel = "Global Topics";
                scopeEmoji = "🌍";
                break;
            case 'all':
            default:
                const lines: string[] = [];
                
                if (topics.personalServer.length > 0) {
                    lines.push("**📝 Your Topics (this server):**");
                    topics.personalServer.forEach(t => lines.push(`• \`${t.slug}\` - ${t.title}`));
                    lines.push("");
                }
                
                if (topics.server.length > 0) {
                    lines.push("**🏠 Server Topics:**");
                    topics.server.forEach(t => lines.push(`• \`${t.slug}\` - ${t.title}`));
                    lines.push("");
                }
                
                if (topics.personalGlobal.length > 0) {
                    lines.push("**👤 Your Personal Topics:**");
                    topics.personalGlobal.forEach(t => lines.push(`• \`${t.slug}\` - ${t.title}`));
                    lines.push("");
                }
                
                if (topics.global.length > 0) {
                    lines.push("**🌍 Global Topics:**");
                    topics.global.forEach(t => lines.push(`• \`${t.slug}\` - ${t.title}`));
                }

                const totalTopics = topics.personalServer.length + topics.server.length + topics.personalGlobal.length + topics.global.length;
                
                if (totalTopics === 0) {
                    return interaction.reply({
                        embeds: [learningEmbeds.noTopicsAvailable()],
                    });
                }

                return interaction.reply({
                    embeds: [
                        learningEmbeds.topicsList(
                            "📚 All Available Topics",
                            lines.join("\n"),
                            `Total: ${totalTopics} topics`
                        )
                    ],
                });
        }

        if (topicsToShow.length === 0) {
            return interaction.reply({
                embeds: [learningEmbeds.noTopicsInScope(scope!)],
            });
        }

        const lines = topicsToShow.map(t => 
            `• \`${t.slug}\` - **${t.title}**${t.description ? `\n  *${t.description}*` : ''}`
        );

        return interaction.reply({
            embeds: [
                learningEmbeds.topicsList(
                    `${scopeEmoji} ${scopeLabel}`,
                    lines.join("\n\n"),
                    `Total: ${topicsToShow.length} topics`
                )
            ],
        });
    }
    if (sub === "delete") {
        const slug = interaction.options.getString("topic", true);
        const topic = await learning.topics.getTopicBySlug(userId, guildId, slug);
        if (!topic) {
            return interaction.reply({
                embeds: [learningEmbeds.topicNotFound(slug)],
                flags: "Ephemeral" 
            });
        }
        await learning.topics.deleteTopic(topic.topic.id);
        return interaction.reply({
            embeds: [learningEmbeds.topicDeleted(topic.topic.title, slug)],
        });
    }
    if (sub === "update") {
        const slug = interaction.options.getString("topic", true);
        const title = interaction.options.getString("title", false) || undefined;
        const description = interaction.options.getString("description", false) ?? undefined;
        const topic = await learning.topics.getTopicBySlug(userId, guildId, slug);
        if (!topic) {
            return interaction.reply({
                embeds: [learningEmbeds.topicNotFound(slug)],
                flags: "Ephemeral" 
            });
        }
        
        const fields = [];
        if (title) {
            fields.push({
                name: "📝 New Title",
                value: `**${title}**`,
            });
        }
        if (description !== undefined) {
            fields.push({
                name: "📄 New Description",
                value: description || "*No description*",
            });
        }
        await learning.topics.updateTopic(topic.topic.id, title, description);
        return interaction.reply({
            embeds: [learningEmbeds.topicUpdated(topic.topic.title, slug, fields)],
        });
    }
    if (sub === "view") {
        const slug = interaction.options.getString("topic", true);
        const topicData = await learning.topics.getTopicBySlug(userId, guildId, slug);
        if (!topicData) {
            return interaction.reply({
                embeds: [learningEmbeds.topicNotFound(slug)],
                flags: "Ephemeral" 
            });
        }
        const { topic } = topicData;
        const isGlobal = !topic.userId && !topic.guildId;
        const isServer = !topic.userId && !!topic.guildId;
        const scopeEmoji = isGlobal ? "🌍" : isServer ? "🏠" : "📝";
        const scopeName = isGlobal ? "Global" : isServer ? "Server" : "Personal";

        const totalPages = topic.LearningSection.reduce((sum, section) => sum + section.LearningPage.length, 0);
        const sectionsInfo = topic.LearningSection.map(section => ({
            title: section.title,
            slug: section.slug,
            pageCount: section.LearningPage.length,
        }));
        return interaction.reply({
            embeds: [
                learningEmbeds.topicView(
                    topic.title,
                    topic.slug,
                    topic.description,
                    scopeEmoji,
                    scopeName,
                    sectionsInfo,
                    totalPages
                )
            ],
        });
    }
    return interaction.reply({
        embeds: [sharedEmbeds.unknownSubcommand()],
        flags: "Ephemeral" 
    });
};