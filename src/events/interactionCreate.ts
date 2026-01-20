import { Events, Interaction } from "discord.js";
import { interactionContextMiddleware } from "@/middlewares";
import { handleLearnCommand } from "@/modules/learning/commands/learn.commands";
import { handleSettingsCommand, handleSettingsHandlers, handleSettingsModal } from "@/modules/settings";

export const name = Events.InteractionCreate;

export const handleInteraction = async (interaction: Interaction) => {
    if (interaction.isStringSelectMenu()) {
        if (interaction.customId.startsWith("settings:")) return handleSettingsHandlers(interaction);
    }
    if (interaction.isModalSubmit()) {
        if (interaction.customId.startsWith("settings:")) return handleSettingsModal(interaction);
    }
    if (!interaction.isChatInputCommand()) return;
    
    await interactionContextMiddleware(interaction);
    switch (interaction.commandName) {
        case "learn":
            await handleLearnCommand(interaction);
            break;
        case "settings":
            await handleSettingsCommand(interaction);
            break;
        default:
            console.warn(`Unknown command: ${interaction.commandName}`);
    }
    return;
};