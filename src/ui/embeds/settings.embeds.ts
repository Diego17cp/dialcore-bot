import { getLanguageLabel, getTimezoneLabel } from "@/modules/settings";
import { baseEmbed } from "./base.embed";

export const buildGuildSettingsEmbed = (settings: {
	language: string;
	learningEnabled: boolean;
	pomodoroEnabled: boolean;
}) =>
	baseEmbed()
		.setTitle("🏠 Server Settings")
        .addFields(
            {
                name: "🌍 Language",
                value: getLanguageLabel(settings.language),
                inline: true,
            },
            {
                name: "🔧 Features",
                value: [
                    settings.learningEnabled ? "📚 Learning: ✅ Enabled" : "📚 Learning: ❌ Disabled",
                    settings.pomodoroEnabled ? "⏱️ Pomodoro: ✅ Enabled" : "⏱️ Pomodoro: ❌ Disabled",
                ].join("\n"),
                inline: false,
            },
        );
export const buildUserSettingsEmbed = (settings: {
	language: string;
	timezone: string;
	notificationsEnabled: boolean;
}) =>
	baseEmbed()
		.setTitle("👤 Your Settings")
        .addFields(
            {
                name: "🌍 Language",
                value: getLanguageLabel(settings.language),
                inline: true,
            },
            {
                name: "🕒 Timezone",
                value: getTimezoneLabel(settings.timezone),
                inline: true,
            },
            {
                name: "🔧 Features",
                value: settings.notificationsEnabled 
                    ? "🔔 Review Notifications: ✅ Enabled" 
                    : "🔔 Review Notifications: ❌ Disabled",
                inline: false,
            },
        );
