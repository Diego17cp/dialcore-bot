import { sharedEmbeds } from "@/ui";
import { ChatInputCommandInteraction, PermissionsBitField } from "discord.js";
import { startSettingsFlow } from "./settings.flow";

export const handleSettingsCommand = async (
    interaction: ChatInputCommandInteraction
) => {
    const scope = interaction.options.getSubcommand();
    if (scope === "guild") {
        if (!interaction.inGuild() || !interaction.guild) return await interaction.reply({
            embeds: [sharedEmbeds.serverContextRequired()],
            flags: "Ephemeral",
        })
        if (!interaction.memberPermissions?.has(PermissionsBitField.Flags.ManageGuild)) {
            return await interaction.reply({
                embeds: [sharedEmbeds.permissionDenied()],
                flags: "Ephemeral",
            });
        }
    }
    
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