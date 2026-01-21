import { devEmbeds, sharedEmbeds } from "@/ui";
import { ChatInputCommandInteraction } from "discord.js";
import { handleProfileCommand } from "./profile.command";
import { handleRepoCommand } from "./repo.commands";
import { handleReposCommand } from "./repos.commands";
import { handleDevStatsCommand } from "./dev.stats.commands";
import { GuildSettingsService } from "@/modules/guilds";

const guildSettingsService = new GuildSettingsService();

export const handleDevCommand = async (interaction: ChatInputCommandInteraction) => {
    await interaction.deferReply();
    const sub = interaction.options.getSubcommand();
    const guildId = interaction.guildId;
    if (interaction.inGuild() && guildId) {
        const settings = await guildSettingsService.getSettingsForGuild(guildId);
        if (!settings?.devEnabled) {
            return await interaction.editReply({
                embeds: [devEmbeds.devDisabled()],
            });
        }
    }
    try {
        switch (sub) {
            case "profile":
                return await handleProfileCommand(interaction);
            case "repos":
                return await handleReposCommand(interaction);
            case "repo":
                return await handleRepoCommand(interaction);
            case "stats":
                return await handleDevStatsCommand(interaction);
            default:
                return await interaction.editReply({
                    embeds: [sharedEmbeds.unknownSubcommand()],
                });
        }
    } catch (error) {
        console.error(error);
        return await interaction.editReply({
            embeds: [sharedEmbeds.errorCommand()],
        });
    }
}