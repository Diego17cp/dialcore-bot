import { env } from "@/config";
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    StringSelectMenuBuilder,
} from "discord.js";
import { getCommandLabel, getCommandDescription } from "./help.utils";

export const helpCategorySelect = (categories: Record<string, number>) => {
    return new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
        new StringSelectMenuBuilder()
            .setCustomId("help:category")
            .setPlaceholder("Select a category")
            .addOptions([
                ...Object.keys(categories).map((name) => ({
                    label: getCommandLabel(name),
                    description: getCommandDescription(name),
                    value: name,
                })),
            ]),
    );
};
export const helpButtons = () => {
	return new ActionRowBuilder<ButtonBuilder>().addComponents(
		new ButtonBuilder()
			.setCustomId("help:close")
			.setEmoji("✖️")
			.setStyle(ButtonStyle.Danger),
		new ButtonBuilder()
			.setLabel("Check web page")
			.setURL(env.DOCS_URL)
			.setStyle(ButtonStyle.Link),
	);
};
export const createPaginationButtons = (category: string, currentPage: number, totalPages: number) => {
    const row = new ActionRowBuilder<ButtonBuilder>();    
    row.addComponents(
        new ButtonBuilder()
            .setCustomId(`help:page:${category}:${currentPage - 1}`)
            .setEmoji("⬅️")
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(currentPage === 1)
    );    
    row.addComponents(
        new ButtonBuilder()
            .setCustomId(`help:page:${category}:${currentPage}`)
            .setLabel(`${currentPage}/${totalPages}`)
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(true)
    );    
    row.addComponents(
        new ButtonBuilder()
            .setCustomId(`help:page:${category}:${currentPage + 1}`)
            .setEmoji("➡️")
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(currentPage === totalPages)
    );    
    row.addComponents(
        new ButtonBuilder()
            .setCustomId("help:close")
            .setEmoji("✖️")
            .setStyle(ButtonStyle.Danger)
    );
    
    return row;
};
