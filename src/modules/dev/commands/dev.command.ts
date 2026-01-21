import { sharedEmbeds } from "@/ui";
import { ChatInputCommandInteraction } from "discord.js";
import { handleProfileCommand } from "./profile.command";
import { handleRepoCommand } from "./repo.commands";
import { handleReposCommand } from "./repos.commands";
import { handleDevStatsCommand } from "./dev.stats.commands";

export const handleDevCommand = async (interaction: ChatInputCommandInteraction) => {
    await interaction.deferReply();
    const sub = interaction.options.getSubcommand();
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