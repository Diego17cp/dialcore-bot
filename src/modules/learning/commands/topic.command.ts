import { ChatInputCommandInteraction } from "discord.js";
import { LearningService } from "../services";
import { isBotAdmin } from "@/core/utils";

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
                content: "You do not have permission to create global topics.",
                flags: "Ephemeral",
            });
        }
        await learning.topics.createTopic(topicUserId, topicGuildId, title, description);
        const scope = makeGlobal ? "🌍 global" : guildId ? "🏠 server" : "📝 personal";
        return interaction.reply({
            content: `Topic **${title}** created successfully in ${scope} scope.`,
        });
    }
    
    if (sub === "list") {
        const scope = interaction.options.getString("scope", false) as 'personal' | 'server' | 'global' | 'all' | null;
        
        if (!guildId) {
            const personalTopics = await learning.topics.getTopicsByUser(userId, null);
            const globalTopics = await learning.topics.getGlobalTopics();
            if (scope === 'server') {
                return interaction.reply({
                    content: "This command can only be used in a server.",
                    flags: "Ephemeral",
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
                    content: "No topics available.",
                });
            }
        }

        const topics = await learning.topics.getAvailableTopics(userId, guildId!);

        let topicsToShow = [];
        let scopeLabel = "";

        switch (scope) {
            case 'personal':
                topicsToShow = [...topics.personalServer, ...topics.personalGlobal];
                scopeLabel = "📝 Your Personal Topics";
                break;
            case 'server':
                topicsToShow = topics.server;
                scopeLabel = "🏠 Server Topics";
                break;
            case 'global':
                topicsToShow = topics.global;
                scopeLabel = "🌍 Global Topics";
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
                        content: "No topics available.",
                    });
                }

                return interaction.reply({
                    content: lines.join("\n") || "No topics available.",
                });
        }

        if (topicsToShow.length === 0) {
            return interaction.reply({
                content: `No topics found in scope: **${scope}**.`,
            });
        }

        const lines = [
            `${scopeLabel}`,
            "",
            ...topicsToShow.map(t => `• \`${t.slug}\` - ${t.title}${t.description ? `\n  ${t.description}` : ''}`),
        ];

        return interaction.reply({
            content: lines.join("\n"),
        });
    }

    if (sub === "delete") {
        const slug = interaction.options.getString("slug", true);
        const topic = await learning.topics.getTopicBySlug(userId, guildId, slug);
        if (!topic) {
            return interaction.reply({
                content: `Topic with slug **${slug}** not found.`,
                flags: "Ephemeral",
            });
        }
        await learning.topics.deleteTopic(topic.topic.id);
        return interaction.reply({
            content: `Topic **${topic.topic.title}** deleted successfully.`,
        });
    }

    if (sub === "update") {
        const slug = interaction.options.getString("topic", true);
        const title = interaction.options.getString("title", false) || undefined;
        const description = interaction.options.getString("description", false) ?? undefined;
        const topic = await learning.topics.getTopicBySlug(userId, guildId, slug);
        if (!topic) {
            return interaction.reply({
                content: `Topic with slug **${slug}** not found.`,
                flags: "Ephemeral",
            });
        }
        await learning.topics.updateTopic(topic.topic.id, title, description);
        return interaction.reply({
            content: `Topic **${topic.topic.title}** updated successfully.`,
        });
    }

    return interaction.reply({
        content: "Unknown subcommand.",
    });
};