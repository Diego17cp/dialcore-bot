import { sharedEmbeds } from "@/ui";
import { ChatInputCommandInteraction } from "discord.js";
import { startSettingsFlow } from "./settings.flow";

export const handleSettingsCommand = async (
    interaction: ChatInputCommandInteraction
) => {
    const scope = interaction.options.getSubcommand();
    if (scope === "guild" && !interaction.guildId) return await interaction.reply({
        embeds: [sharedEmbeds.serverContextRequired()],
        flags: "Ephemeral",
    })
    
    try {
        return await startSettingsFlow(interaction, scope as "user" | "guild");
    } catch (error) {
        console.error("Error in handleSettingsCommand:", error);
        const errorEmbed = sharedEmbeds.errorCommand();
        return await interaction.reply({
            embeds: [errorEmbed],
            flags: "Ephemeral",
        });
    }
}