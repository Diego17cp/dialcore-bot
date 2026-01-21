import { devEmbeds } from "@/ui";
import { ChatInputCommandInteraction } from "discord.js";
import { buildStats } from "../services/dev-stats.service";

export const handleDevStatsCommand = async (interaction: ChatInputCommandInteraction) => {
    const username = interaction.options.getString("username", true);
    const stats = await buildStats(username);
    return await interaction.editReply({
        embeds: [devEmbeds.devStatsEmbed(username, stats)],
    })
}