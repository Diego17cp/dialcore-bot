import { StringSelectMenuInteraction, ButtonInteraction } from "discord.js";
import { getCommandsBySection, getRegistryStats } from "@/commands";
import { createPaginationButtons, helpCategorySelect } from "./help.components";
import { createCategoryEmbed } from "@/ui";

export const ITEMS_PER_PAGE = 5;

export const handleHelpHandlers = async (
    interaction: StringSelectMenuInteraction | ButtonInteraction,
) => {
    const [action, subAction, category, pageStr] = interaction.customId.split(":");
    
    if (action === "help") {
        if (interaction.isStringSelectMenu() && subAction === "category") {
            const selectedCategory = interaction.values[0];
            const commands = getCommandsBySection(selectedCategory || "");
            const totalPages = Math.ceil(commands.length / ITEMS_PER_PAGE);
            
            const embed = createCategoryEmbed(selectedCategory || "", commands, 1, ITEMS_PER_PAGE);
            const components = [
                helpCategorySelect(getRegistryStats().categoryStats),
                ...(totalPages > 1 ? [createPaginationButtons(selectedCategory || "", 1, totalPages)] : [])
            ];
            
            return interaction.update({
                embeds: [embed],
                components,
            });
        } else if (interaction.isButton() && subAction === "page") {
            const currentPage = parseInt(pageStr || "1", 10);
            const commands = getCommandsBySection(category || "");
            const totalPages = Math.ceil(commands.length / ITEMS_PER_PAGE);
            
            if (currentPage < 1 || currentPage > totalPages) return;
            
            const embed = createCategoryEmbed(category || "", commands, currentPage, ITEMS_PER_PAGE);
            const components = [
                helpCategorySelect(getRegistryStats().categoryStats),
                createPaginationButtons(category || "", currentPage, totalPages)
            ];
            
            return interaction.update({
                embeds: [embed],
                components,
            });
        } else if (interaction.isButton() && subAction === "close") {
            return interaction.update({
                content: "❌ Help menu closed.",
                embeds: [],
                components: [],
            });
        }
    }
    
    return interaction.reply({
        content: "❌ Unknown action",
        flags: "Ephemeral",
    });
};