import { EMBED_COLORS } from "../colors";
import { baseEmbed } from "./base.embed";

export const pomodoroEmbeds = {
    pomodoroDisabled: () =>
        baseEmbed()
            .setColor(EMBED_COLORS.WARNING)
            .setTitle("⚠️ Pomodoro Module Disabled")
            .setDescription("The Pomodoro module is currently disabled for this server. Please contact an administrator to enable it."),
    alreadyActivePomodoro: (startDate: Date, durationMinutes: number) =>
        baseEmbed()
            .setColor(EMBED_COLORS.ERROR)
            .setTitle("Active Pomodoro Exists ❌")
            .setDescription("You already have an active Pomodoro session.")
            .addFields(
                { name: "Start Time", value: `<t:${Math.floor(startDate.getTime() / 1000)}:T>`, inline: true },
                { name: "End Time", value: `<t:${Math.floor((startDate.getTime() + durationMinutes * 60000) / 1000)}:T>`, inline: true }
            ),
    pomodoroStarted: (durationMinutes: number, startDate: Date) => 
        baseEmbed()
            .setColor(EMBED_COLORS.SUCCESS)
            .setTitle("Pomodoro Started 🍅")
            .setDescription(`Your Pomodoro session has started for **${durationMinutes} minutes**.\nYou will receive a DM when the session ends.`)
            .addFields(
                { name: "Start Time", value: `<t:${Math.floor(startDate.getTime() / 1000)}:T>`, inline: true },
                { name: "End Time", value: `<t:${Math.floor((startDate.getTime() + durationMinutes * 60000) / 1000)}:T>`, inline: true }
            ),
    noActivePomodoro: () =>
        baseEmbed()
            .setColor(EMBED_COLORS.ERROR)
            .setTitle("No Active Pomodoro ❌")
            .setDescription("You do not have any active Pomodoro sessions to stop."),
    pomodoroEnded: (endDate: Date) =>
        baseEmbed()
            .setColor(EMBED_COLORS.SUCCESS)
            .setTitle("Pomodoro Ended 🍅")
            .addFields(
                { name: "End Time", value: `<t:${Math.floor(endDate.getTime() / 1000)}:T>`, inline: true }
            ),
    pomodoroCancelled: (cancelDate: Date, startDate: Date, durationMinutes: number) => 
        baseEmbed()
            .setColor(EMBED_COLORS.WARNING)
            .setTitle("Pomodoro Cancelled ❌")
            .setDescription("Your Pomodoro session has been cancelled.")
            .addFields(
                { name: "Cancelled At", value: `<t:${Math.floor(cancelDate.getTime() / 1000)}:T>`, inline: true },
                { name: "Original Start Time", value: `<t:${Math.floor(startDate.getTime() / 1000)}:T>`, inline: true },
                { name: "Planned End Time", value: `<t:${Math.floor((startDate.getTime() + durationMinutes * 60000) / 1000)}:T>`, inline: true },
                { name: "Elapsed Time", value: `${Math.floor((cancelDate.getTime() - startDate.getTime()) / 60000)} minutes`, inline: true }
            ),
}