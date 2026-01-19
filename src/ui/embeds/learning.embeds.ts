import { baseEmbed } from "./base.embed";
import { EMBED_COLORS } from "../colors";

export const learningEmbeds = {
    permissionDenied: () => 
        baseEmbed()
            .setColor(EMBED_COLORS.ERROR)
            .setTitle("❌ Permission Denied")
            .setDescription("You do not have permission to perform this action."),
    topicNotFound: (slug: string) =>
        baseEmbed()
            .setColor(EMBED_COLORS.ERROR)
            .setTitle("❌ Topic Not Found")
            .setDescription(`Could not find a topic with slug \`${slug}\``),

    serverContextRequired: () =>
        baseEmbed()
            .setColor(EMBED_COLORS.WARNING)
            .setTitle("⚠️ Server Context Required")
            .setDescription("This command can only be used in a server."),

    unknownSubcommand: () =>
        baseEmbed()
            .setColor(EMBED_COLORS.ERROR)
            .setTitle("❌ Unknown Subcommand")
            .setDescription("The subcommand you used is not recognized."),

    topicCreated: (title: string, slug: string, scopeEmoji: string, scopeName: string, description: string | null, ownerInfo: string) =>
        baseEmbed()
            .setColor(EMBED_COLORS.SUCCESS)
            .setTitle("✅ Topic Created Successfully")
            .setDescription(`${scopeEmoji} **${title}** has been created as a ${scopeName.toLowerCase()} topic.`)
            .addFields(
                {
                    name: "📌 Slug",
                    value: `\`${slug}\``,
                    inline: true,
                },
                {
                    name: "🔖 Scope",
                    value: `${scopeEmoji} ${scopeName}`,
                    inline: true,
                },
                {
                    name: "📝 Description",
                    value: description || "*No description provided*",
                },
                {
                    name: "👥 Access",
                    value: ownerInfo,
                }
            )
            .setFooter({ text: `Use /learn section add ${slug} to add a new section to this topic.` }),

    topicDeleted: (title: string, slug: string) =>
        baseEmbed()
            .setColor(EMBED_COLORS.SUCCESS)
            .setTitle("🗑️ Topic Deleted")
            .setDescription(`**${title}** has been deleted successfully.`)
            .addFields({
                name: "📌 Slug",
                value: `\`${slug}\``,
                inline: true,
            }),

    topicUpdated: (title: string, slug: string, fields: Array<{ name: string; value: string }>) =>
        baseEmbed()
            .setColor(EMBED_COLORS.SUCCESS)
            .setTitle("✏️ Topic Updated")
            .setDescription(`**${title}** has been updated successfully.`)
            .addFields(fields)
            .setFooter({ text: `Slug: ${slug}` }),

    noTopicsAvailable: () =>
        baseEmbed()
            .setColor(EMBED_COLORS.INFO)
            .setTitle("📚 No Topics Found")
            .setDescription("No topics are available yet. Create one with `/learn topic add`"),

    noTopicsInScope: (scope: string) =>
        baseEmbed()
            .setColor(EMBED_COLORS.INFO)
            .setTitle("📚 No Topics Found")
            .setDescription(`No topics found in scope: **${scope}**. Try a different scope or create a new topic.`),

    topicsList: (title: string, description: string, footer?: string) =>
        baseEmbed()
            .setColor(EMBED_COLORS.INFO)
            .setTitle(title)
            .setDescription(description)
            .setFooter(footer ? { text: footer } : null),
    topicView: (
        title: string, 
        slug: string, 
        description: string | null,
        scopeEmoji: string,
        scopeName: string,
        sections: Array<{ title: string; slug: string; pageCount: number }>,
        totalPages: number
    ) => {
        const embed = baseEmbed()
            .setColor(EMBED_COLORS.INFO)
            .setTitle(`📖 ${title}`)
            .setDescription(description || "*No description provided*")
            .addFields(
                {
                    name: "📌 Slug",
                    value: `\`${slug}\``,
                    inline: true,
                },
                {
                    name: "🔖 Scope",
                    value: `${scopeEmoji} ${scopeName}`,
                    inline: true,
                },
                {
                    name: "📄 Total Pages",
                    value: `${totalPages}`,
                    inline: true,
                }
            );
        if (sections.length === 0) {
            embed.addFields({
                name: "📑 Sections",
                value: "*No sections yet. Create one with `/learn section add`*"
            });
        } else {
            const sectionsList = sections.map(s => 
                `• **${s.title}** (\`${s.slug}\`) - ${s.pageCount} page${s.pageCount !== 1 ? 's' : ''}`
            ).join("\n");
            
            embed.addFields({
                name: `📑 Sections (${sections.length})`,
                value: sectionsList
            });
        }
        embed.setFooter({ 
            text: sections.length > 0 
                ? `Use /learn page read ${slug} <section> <page> to read content` 
                : `Use /learn section add ${slug} to add your first section`
        });
        return embed;
    },
    // =================== SECTION EMBEDS ===================
    sectionNotFound: (topicSlug: string, sectionSlug: string) =>
        baseEmbed()
            .setColor(EMBED_COLORS.ERROR)
            .setTitle("❌ Section Not Found")
            .setDescription(`Could not find a section with slug \`${sectionSlug}\` in topic \`${topicSlug}\`.`),
    noSectionsInTopic: (topicSlug: string) => 
        baseEmbed()
            .setColor(EMBED_COLORS.INFO)
            .setTitle("📂 No Sections Found")
            .setDescription(`No sections found in topic \`${topicSlug}\`. Add one with \`/learn section add ${topicSlug} <section info>\`.`),
    sectionCreated: (title: string, slug: string, topicSlug: string, topicName: string) =>
        baseEmbed()
            .setColor(EMBED_COLORS.SUCCESS)
            .setTitle("✅ Section Created Successfully")
            .setDescription(`**${title}** has been created in topic **${topicName}**(${topicSlug}).`)
            .addFields(
                {
                    name: "📌 Slug",
                    value: `\`${slug}\``,
                    inline: true,
                },
            )
            .setFooter({ text: `Use /learn page add <${topicSlug}> <${slug}> <page info> to add a new page to this section.` }),
    sectionDeleted: (title: string, slug: string) =>
        baseEmbed()
            .setColor(EMBED_COLORS.SUCCESS)
            .setTitle("🗑️ Section Deleted")
            .setDescription(`**${title}** has been deleted successfully.`)
            .addFields({
                name: "📌 Slug",
                value: `\`${slug}\``,
                inline: true,
            }),
    sectionUpdated: (title: string, slug: string, fields: Array<{ name: string; value: string }>) =>
        baseEmbed()
            .setColor(EMBED_COLORS.SUCCESS)
            .setTitle("✏️ Section Updated")
            .setDescription(`**${title}** has been updated successfully.`)
            .addFields(fields)
            .setFooter({ text: `Slug: ${slug}` }),
    sectionsList: (title: string, description: string, footer?: string) => 
        baseEmbed()
            .setColor(EMBED_COLORS.INFO)
            .setTitle(title)
            .setDescription(description)
            .setFooter(footer ? { text: footer } : null),
    sectionView: (
        title: string, 
        slug: string, 
        topicTitle: string,
        topicSlug: string,
        pages: Array<{ title: string; slug: string }>,
        totalPages: number
    ) => {
        const embed = baseEmbed()
            .setColor(EMBED_COLORS.INFO)
            .setTitle(`📑 ${title}`)
            .setDescription(`Part of topic: **${topicTitle}** (\`${topicSlug}\`)`)
            .addFields(
                {
                    name: "📌 Slug",
                    value: `\`${slug}\``,
                    inline: true,
                },
                {
                    name: "📄 Total Pages",
                    value: `${totalPages}`,
                    inline: true,
                }
            );
        
        if (pages.length === 0) {
            embed.addFields({
                name: "📄 Pages",
                value: "*No pages yet. Create one with `/learn page add`*"
            });
        } else {
            const pagesList = pages
                .slice(0, 10)
                .map(p => `• **${p.title}** (\`${p.slug}\`)`)
                .join("\n");
            
            embed.addFields({
                name: `📄 Pages (${pages.length})`,
                value: pagesList + (pages.length > 10 ? `\n*...and ${pages.length - 10} more*` : "")
            });
        }
        
        embed.setFooter({ 
            text: pages.length > 0 
                ? `Use /learn page read ${topicSlug} ${slug} <page> to read content` 
                : `Use /learn page add ${topicSlug} ${slug} <page info> to add your first page`
        });
        
        return embed;
    },
};

