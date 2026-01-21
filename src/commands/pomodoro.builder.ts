import { SlashCommandBuilder } from "discord.js";

export const pomodoroCommand = new SlashCommandBuilder()
    .setName("pomodoro")
    .setDescription("Manage your Pomodoro sessions")
    .addSubcommand((sub) => 
        sub
            .setName("start")
            .setDescription("Start a new Pomodoro session")
            .addIntegerOption((opt) => 
                opt
                    .setName("duration")
                    .setDescription("Duration in minutes")
                    .setRequired(true)
            )
    )
    .addSubcommand((sub) =>
        sub
            .setName("stop")
            .setDescription("Stop your active Pomodoro session")
    )