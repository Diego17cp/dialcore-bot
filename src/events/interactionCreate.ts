import { Events, Interaction } from "discord.js";
import { interactionContextMiddleware } from "@/middlewares";
import { handleLearnCommand } from "@/modules/learning/commands/learn.commands";

export const name = Events.InteractionCreate;

export const handleInteraction = async (interaction: Interaction) => {
    if (!interaction.isChatInputCommand()) return;
    
    await interactionContextMiddleware(interaction);
    switch (interaction.commandName) {
        case "learn":
            await handleLearnCommand(interaction);
            break;
        default:
            console.warn(`Unknown command: ${interaction.commandName}`);
    }
};