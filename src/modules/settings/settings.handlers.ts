import { StringSelectMenuInteraction } from "discord.js";
import { GuildSettingsService } from "../guilds";
import { UserSettingsService } from "../users";
import { buildBooleanToggleMenu, buildEnumMenu } from "./settings.components";

const guildSettingsService = new GuildSettingsService();
const userSettingsService = new UserSettingsService();
export const handleSettingsHandlers = async (
    interaction: StringSelectMenuInteraction,
) => {
    const [_, scope, action] = interaction.customId.split(":");
    if (action === "menu") {
        if (interaction.values[0] === "booleans") {
            if (scope === "guild") {
                const s = await guildSettingsService.getSettingsForGuild(
                    interaction.guildId!,
                );
                return interaction.update({
                    components: [
                        buildBooleanToggleMenu("guild", {
                            learningEnabled: s?.learningEnabled || false,
                            pomodoroEnabled: s?.pomodoroEnabled || false,
                            devEnabled: s?.devEnabled || false,
                        }),
                    ],
                });
            }
            const s = await userSettingsService.getSettingsForUser(
                interaction.user.id,
            );
            return interaction.update({
                components: [
                    buildBooleanToggleMenu("user", {
                        notificationsEnabled: s?.notificationsEnabled || false,
                    }),
                ],
            });
        }
        if (interaction.values[0] === "language") {
            return interaction.update({
                components: [
                    buildEnumMenu(
                        `settings:${scope}:language`,
                        ["en", "es", "fr", "de", "it", "pt"],
                        scope === "guild"
                            ? (
                                    await guildSettingsService.getSettingsForGuild(
                                        interaction.guildId!,
                                    )
                                )?.language || "en"
                            : (
                                    await userSettingsService.getSettingsForUser(
                                        interaction.user.id,
                                    )
                                )?.language || "en",
                    ),
                ],
            });
        }
        if (interaction.values[0] === "timezone") {
            return interaction.update({
                components: [
                    buildEnumMenu(
                        `settings:user:timezone`,
                        ["UTC", "PST", "EST", "CET", "IST", "JST"],
                        (
                            await userSettingsService.getSettingsForUser(
                                interaction.user.id,
                            )
                        )?.timezone || "UTC",
                    ),
                ],
            });
        }
    }
    if (action === "booleans") {
        const selected = new Set(interaction.values);
        if (scope === "guild") {
            const currentSettings =
                await guildSettingsService.getSettingsForGuild(
                    interaction.guildId!,
                );
            await guildSettingsService.upsertSettingsForGuild(
                interaction.guildId!,
                {
                    language: currentSettings?.language || "en",
                    learningEnabled: selected.has("learningEnabled"),
                    pomodoroEnabled: selected.has("pomodoroEnabled"),
                    devEnabled: selected.has("devEnabled"),
                },
            );
        } else {
            const currentSettings =
                await userSettingsService.getSettingsForUser(
                    interaction.user.id,
                );
            await userSettingsService.upsertSettingsForUser(
                interaction.user.id,
                {
                    language: currentSettings?.language || "en",
                    timezone: currentSettings?.timezone || "UTC",
                    notificationsEnabled: selected.has("notificationsEnabled"),
                },
            );
        }
        return interaction.reply({
            content: "✅ Settings updated",
            flags: "Ephemeral",
        });
    }
    if (action === "language") {
        if (scope === "guild") {
            const currentSettings =
                await guildSettingsService.getSettingsForGuild(
                    interaction.guildId!,
                );
            await guildSettingsService.upsertSettingsForGuild(
                interaction.guildId!,
                {
                    language: interaction.values[0] || "en",
                    learningEnabled: currentSettings?.learningEnabled || false,
                    pomodoroEnabled: currentSettings?.pomodoroEnabled || false,
                    devEnabled: currentSettings?.devEnabled || false,
                },
            );
        } else {
            const currentSettings =
                await userSettingsService.getSettingsForUser(
                    interaction.user.id,
                );
            await userSettingsService.upsertSettingsForUser(
                interaction.user.id,
                {
                    language: interaction.values[0] || "en",
                    timezone: currentSettings?.timezone || "UTC",
                    notificationsEnabled:
                        currentSettings?.notificationsEnabled || false,
                },
            );
        }
        return interaction.reply({
            content: "🌍 Language updated",
            flags: "Ephemeral",
        });
    }
    if (action === "timezone") {
        const currentSettings = await userSettingsService.getSettingsForUser(
            interaction.user.id,
        );
        await userSettingsService.upsertSettingsForUser(interaction.user.id, {
            timezone: interaction.values[0] || "UTC",
            notificationsEnabled:
                currentSettings?.notificationsEnabled || false,
            language: currentSettings?.language || "en",
        });
        return interaction.reply({
            content: "🕒 Timezone updated",
            flags: "Ephemeral",
        });
    }
    return interaction.reply({
        content: "❌ Unknown action",
        flags: "Ephemeral",
    });
};
