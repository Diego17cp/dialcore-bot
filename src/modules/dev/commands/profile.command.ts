import { ChatInputCommandInteraction } from "discord.js";
import { getDevProfile } from "../services/github.service";
import { devEmbeds } from "@/ui";

export const handleProfileCommand = async (interaction: ChatInputCommandInteraction) => {
    const username = interaction.options.getString("username", true);
    const data = await getDevProfile(username);
    return await interaction.reply({
        embeds: [devEmbeds.devProfileEmbed(data)],
    })
}