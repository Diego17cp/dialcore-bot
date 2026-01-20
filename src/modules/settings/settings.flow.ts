import { ChatInputCommandInteraction } from "discord.js";
import { buildSettingsMenu } from "./settings.components";
import { GuildSettingsService } from "../guilds";
import { UserSettingsService } from "../users";
import { buildGuildSettingsEmbed, buildUserSettingsEmbed } from "@/ui";

const guildSettingsService = new GuildSettingsService();
const userSettingsService = new UserSettingsService();

export const startSettingsFlow = async (
    interaction: ChatInputCommandInteraction,
    scope: "user" | "guild"
) => {
    if (scope === "guild"){
        const settings = await guildSettingsService.getSettingsForGuild(interaction.guildId!);
        if (!settings) throw new Error("Guild settings not found");
        return interaction.reply({
            embeds: [buildGuildSettingsEmbed(settings)],
            components: buildSettingsMenu("guild"),
            flags: "Ephemeral",
        })
    }
    const settings = await userSettingsService.getSettingsForUser(interaction.user.id);
    if (!settings) throw new Error("User settings not found");
    const embed = buildUserSettingsEmbed(settings);
    const components = buildSettingsMenu("user");

    return await interaction.reply({
        embeds: [embed],
        components,
        flags: "Ephemeral",
    });
}