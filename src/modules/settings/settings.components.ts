import { ActionRowBuilder, StringSelectMenuBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { getBooleanLabel, getLanguageLabel, getTimezoneLabel } from "./settings.utils";

export const buildSettingsMenu = (scope: "user" | "guild") => {
    return [
        new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId(`settings:${scope}:menu`)
                .setPlaceholder("Choose what to edit")
                .addOptions(
                    scope === "guild"
                        ? [
                                { label: "🔧 Toggles", value: "booleans", description: "Enable/disable features" },
                                { label: "🌍 Language", value: "language", description: "Server language" },
                                { label: "🔤 Prefix", value: "prefix", description: "Command prefix" },
                            ]
                        : [
                                { label: "🔧 Toggles", value: "booleans", description: "Enable/disable features" },
                                { label: "🌍 Language", value: "language", description: "Your language" },
                                { label: "🕒 Timezone", value: "timezone", description: "Your timezone" },
                            ],
                ),
        ),
    ];
};

export const buildBooleanToggleMenu = (
    scope: "user" | "guild",
    current: Record<string, boolean>,
) =>
    new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
        new StringSelectMenuBuilder()
            .setCustomId(`settings:${scope}:booleans`)
            .setPlaceholder("Select options to enable")
            .setMinValues(0)
            .setMaxValues(Object.keys(current).length)
            .addOptions(
                Object.entries(current).map(([key, enabled]) => ({
                    label: getBooleanLabel(key),
                    value: key,
                    description: enabled ? "✅ Currently enabled" : "❌ Currently disabled",
                    default: enabled,
                })),
            ),
    );

export const buildEnumMenu = (
    customId: string,
    values: string[],
    current: string,
) => {
    const isLanguage = customId.includes("language");
    const isTimezone = customId.includes("timezone");
    
    return new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
        new StringSelectMenuBuilder()
            .setCustomId(customId)
            .setPlaceholder(isLanguage ? "Choose language" : isTimezone ? "Choose timezone" : "Choose option")
            .addOptions(
                values.map((v) => ({
                    label: isLanguage ? getLanguageLabel(v) : isTimezone ? getTimezoneLabel(v) : v,
                    value: v,
                    default: v === current,
                })),
            ),
    );
};

export const buildPrefixInput = (
    customId: string,
    currentPrefix: string,
) =>
    new ActionRowBuilder<TextInputBuilder>().addComponents(
        new TextInputBuilder()
            .setCustomId(customId)
            .setLabel("New Prefix")
            .setStyle(TextInputStyle.Short)
            .setValue(currentPrefix)
            .setRequired(true)
            .setMaxLength(5)
            .setPlaceholder("Enter new prefix (1-5 characters)"),
    );