import { StringSelectMenuInteraction, ModalSubmitInteraction } from "discord.js";
import { GuildSettingsService } from "../guilds";
import { UserSettingsService } from "../users";
import { buildBooleanToggleMenu, buildEnumMenu, buildPrefixInput } from "./settings.components";

const guildSettingsService = new GuildSettingsService();
const userSettingsService = new UserSettingsService();

export const handleSettingsModal = async (
    interaction: ModalSubmitInteraction,
) => {
    const [_, __, action] = interaction.customId.split(":");
    
    if (action === "prefix") {
        const newPrefix = interaction.fields.getTextInputValue("settings:guild:prefix");        
        if (!newPrefix || newPrefix.length > 5) {
            return interaction.reply({
                content: "❌ Prefix must be 1-5 characters long.",
                flags: "Ephemeral",
            });
        }
        const currentSettings = await guildSettingsService.getSettingsForGuild(interaction.guildId!);
        await guildSettingsService.upsertSettingsForGuild(
            interaction.guildId!,
            {
                prefix: newPrefix,
                language: currentSettings?.language || "en",
                learningEnabled: currentSettings?.learningEnabled || false,
                pomodoroEnabled: currentSettings?.pomodoroEnabled || false,
            },
        );
        
        return interaction.reply({
            content: `🔤 Prefix updated to \`${newPrefix}\``,
            flags: "Ephemeral",
        });
    }
    
    return interaction.reply({
        content: "❌ Unknown modal action",
        flags: "Ephemeral",
    });
};
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
        if (interaction.values[0] === "prefix") {
            const currentPrefix = (await guildSettingsService.getSettingsForGuild(interaction.guildId!))?.prefix || "/";
            return interaction.showModal({
                customId: "settings:guild:prefix",
                title: "Set Prefix",
                components: [
                    buildPrefixInput(
                        `settings:guild:prefix`,
                        currentPrefix,
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
                    prefix: currentSettings?.prefix || "!",
                    language: currentSettings?.language || "en",
                    learningEnabled: selected.has("learningEnabled"),
                    pomodoroEnabled: selected.has("pomodoroEnabled"),
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
                    prefix: currentSettings?.prefix || "!",
                    language: interaction.values[0] || "en",
                    learningEnabled: currentSettings?.learningEnabled || false,
                    pomodoroEnabled: currentSettings?.pomodoroEnabled || false,
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
    if (action === "prefix") {
        const newPrefix = interaction.values[0];
        const currentSettings = await guildSettingsService.getSettingsForGuild(
            interaction.guildId!,
        );
        await guildSettingsService.upsertSettingsForGuild(
            interaction.guildId!,
            {
                prefix: newPrefix || "/",
                language: currentSettings?.language || "en",
                learningEnabled: currentSettings?.learningEnabled || false,
                pomodoroEnabled: currentSettings?.pomodoroEnabled || false,
            },
        );
        return interaction.reply({
            content: `🔤 Prefix updated to \`${newPrefix}\``,
            flags: "Ephemeral",
        });
    }
    return interaction.reply({
        content: "❌ Unknown action",
        flags: "Ephemeral",
    });
};
