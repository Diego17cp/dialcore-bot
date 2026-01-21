import { ChatInputCommandInteraction } from "discord.js";
import { getDevRepo } from "../services/github.service";
import { devEmbeds } from "@/ui";

export const handleRepoCommand = async (interaction: ChatInputCommandInteraction) => {
    const username = interaction.options.getString("owner", true);
    const repo = interaction.options.getString("repo", true);
    const data = await getDevRepo(username, repo);
    return await interaction.editReply({
        embeds: [devEmbeds.devRepoEmbed(data)],
    })
}