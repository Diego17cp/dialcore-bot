import { Events, Interaction } from "discord.js";
import { interactionContextMiddleware } from "@/middlewares";
import { handleLearnCommand } from "@/modules/learning/commands/learn.commands";
import { handleSettingsCommand, handleSettingsHandlers } from "@/modules/settings";
import { handleHelpCommand, handleHelpHandlers } from "@/modules/help";
import { handleDevCommand } from "@/modules/dev";
import { handlePomodoroCommand } from "@/modules/pomodoro";
import { handleTodoCommand } from "@/modules/todos";

export const name = Events.InteractionCreate;

export const handleInteraction = async (interaction: Interaction) => {
    if (interaction.isStringSelectMenu()) {
        if (interaction.customId.startsWith("settings:")) return handleSettingsHandlers(interaction);
        if (interaction.customId.startsWith("help:")) return handleHelpHandlers(interaction);
    }
    if (interaction.isButton()) {
        if (interaction.customId.startsWith("help:")) return handleHelpHandlers(interaction);
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
        case "help":
            await handleHelpCommand(interaction);
            break;
        case "dev":
            await handleDevCommand(interaction);
            break;
        case "pomodoro":
            await handlePomodoroCommand(interaction);
            break;
        case "todo":
            await handleTodoCommand(interaction);
            break;
        default:
            console.warn(`Unknown command: ${interaction.commandName}`);
    }
    return;
};