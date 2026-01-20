import { ChatInputCommandInteraction } from "discord.js";
import { handlePageCommand } from "./page.commands";
import { handleReviewCommand } from "./review.comands";
import { handleSectionCommand } from "./section.commands";
import { handleTopicCommand } from "./topic.command";
import { learningEmbeds, sharedEmbeds } from "@/ui";
import { GuildSettingsService } from "@/modules/guilds";

const guildSettingsService = new GuildSettingsService();

export const handleLearnCommand = async (
    interaction: ChatInputCommandInteraction,
) => {
    const guildId = interaction.guildId;
    const sub = interaction.options.getSubcommandGroup()
    if (guildId) {
        const settings = await guildSettingsService.getSettingsForGuild(guildId);
        if (!settings?.learningEnabled) {
            return await interaction.reply({
                embeds: [learningEmbeds.learningDisabled()],
                flags: "Ephemeral",
            });
        }
    }
    try {
        switch (sub) {
            case "topic":
                return await handleTopicCommand(interaction);
            case "section":
                return await handleSectionCommand(interaction);
            case "page":
                return await handlePageCommand(interaction);
            case "review":
                return await handleReviewCommand(interaction);
            default:
                return await interaction.reply({
                    embeds: [sharedEmbeds.unknownSubcommand()],
                    flags: "Ephemeral",
                });
        }
    } catch (error) {
        console.error(error);
        return await interaction.reply({
            embeds: [sharedEmbeds.errorCommand()]
        });
    }
}