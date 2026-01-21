import { SlashCommandBuilder } from "discord.js";

export const todoCommand = new SlashCommandBuilder()
    .setName("todo")
    .setDescription("Manage your to-do list")
    .addSubcommand((sub) =>
        sub
            .setName("add")
            .setDescription("Add a new to-do item")
            .addStringOption((option) =>
                option
                    .setName("title")
                    .setDescription("Title of the to-do item")
                    .setRequired(true),
            )
            .addStringOption((option) =>
                option
                    .setName("description")
                    .setDescription("Description of the to-do item")
                    .setRequired(false),
            )
    )
    .addSubcommand((sub) =>
        sub
            .setName("list")
            .setDescription("List your to-do items")
            .addStringOption((option) =>
                option
                    .setName("search")
                    .setDescription("Search term to filter to-do items")
                    .setRequired(false),
            )
    )
    .addSubcommand((sub) =>
        sub
            .setName("update")
            .setDescription("Update an existing to-do item")
            .addIntegerOption((option) =>
                option
                    .setName("id")
                    .setDescription("ID of the to-do item to update")
                    .setRequired(true),
            )
            .addStringOption((option) =>
                option
                    .setName("title")
                    .setDescription("New title of the to-do item")
                    .setRequired(false),
            )
            .addStringOption((option) =>
                option
                    .setName("description")
                    .setDescription("New description of the to-do item")
                    .setRequired(false),
            )
    )
    .addSubcommand((sub) =>
        sub
            .setName("delete")
            .setDescription("Delete a to-do item")
            .addIntegerOption((option) =>
                option
                    .setName("id")
                    .setDescription("ID of the to-do item to delete")
                    .setRequired(true),
            )
    );