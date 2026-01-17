import { ChatInputCommandInteraction } from "discord.js";
import { handlePageCommand } from "./page.commands";
import { handleReviewCommand } from "./review.comands";
import { handleSectionCommand } from "./section.commands";
import { handleTopicCommand } from "./topic.command";

export const handleLearnCommand = async (
    interaction: ChatInputCommandInteraction,
) => {
    const sub = interaction.options.getSubcommandGroup()
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
                return await interaction.reply("Unknown subcommand group.");
        }
    } catch (error) {
        console.error(error);
        return await interaction.reply("An error occurred while processing the command.");
    }
}