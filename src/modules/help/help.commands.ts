import { ChatInputCommandInteraction } from "discord.js";
import { buildHelpEmbed, sharedEmbeds } from "@/ui";
import { helpButtons, helpCategorySelect } from "./help.components";
import { getRegistryStats } from "@/commands";

export const handleHelpCommand = async (
    interaction: ChatInputCommandInteraction
) => {
    try {
        return await interaction.reply({
            embeds: [buildHelpEmbed(getRegistryStats())],
            components: [
                helpCategorySelect(getRegistryStats().categoryStats),
                helpButtons()
            ],
            flags: "Ephemeral",
        })
    } catch (error) {
        console.error("Error in handleHelpCommand:", error);
        return await interaction.reply({
            embeds: [sharedEmbeds.errorCommand()],
            flags: "Ephemeral",
        })
    }
}