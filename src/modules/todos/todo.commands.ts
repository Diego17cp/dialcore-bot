import { ChatInputCommandInteraction } from "discord.js";
import { TodoService } from "./todos.service";
import { todoEmbeds, sharedEmbeds } from "@/ui";
import { UpdateTodo } from "./todos.model";

export const handleTodoCommand = async (
    interaction: ChatInputCommandInteraction,
) => {
    const sub = interaction.options.getSubcommand();
    const guildId = interaction.guild ? interaction.guild.id : null;
    const userId = interaction.user.id;
    const todoService = new TodoService();
    try {
        switch (sub) {
            case "add": {
                const title = interaction.options.getString("title", true);
                const description = interaction.options.getString("description") || "";
                const exists = await todoService.getTodosByUser(userId);
                if (exists.some(todo => todo.title === title)) {
                    return await interaction.reply({
                        embeds: [todoEmbeds.todoAlreadyExists(title)],
                        flags: "Ephemeral",
                    });
                }
                const newTodo = await todoService.createTodo({ title, description, guildId, userId });
                return await interaction.reply({
                    embeds: [todoEmbeds.todoAdded(title, newTodo.id)],
                    flags: "Ephemeral",
                });
            }
            case "list": {
                const searchTerm = interaction.options.getString("search") || undefined;
                const todos = await todoService.getTodosByUser(userId, searchTerm);
                if (todos.length === 0) {
                    return await interaction.reply({
                        embeds: [todoEmbeds.todoListEmpty()],
                        flags: "Ephemeral",
                    });
                }
                return await interaction.reply({
                    embeds: [todoEmbeds.todoList(todos)],
                    flags: "Ephemeral",
                });
            }
            case "update": {
                const id = interaction.options.getInteger("id", true);
                const exists = await todoService.getTodoById(id);
                if (!exists) {
                    return await interaction.reply({
                        embeds: [todoEmbeds.todoNotFound(id)],
                        flags: "Ephemeral",
                    });
                }
                const title = interaction.options.getString("title") || undefined;
                const description = interaction.options.getString("description") || undefined;
                const updateData: UpdateTodo = {};
                const fields: Array<{ name: string; value: string }> = [];
                if (title) {
                    updateData.title = title;
                    fields.push({
                        name: "📝 New Title",
                        value: `**${title}**`,
                    });
                }
                if (description !== undefined) {
                    updateData.description = description;
                    fields.push({
                        name: "📄 New Description",
                        value: description || "*No description*",
                    });
                }
                await todoService.updateTodo(id, updateData);
                return await interaction.reply({
                    embeds: [todoEmbeds.todoUpdated(id, fields)],
                    flags: "Ephemeral",
                });
            }
            case "delete": {
                const id = interaction.options.getInteger("id", true);
                const exists = await todoService.getTodoById(id);
                if (!exists) {
                    return await interaction.reply({
                        embeds: [todoEmbeds.todoNotFound(id)],
                        flags: "Ephemeral",
                    });
                }
                await todoService.deleteTodo(id);
                return await interaction.reply({
                    embeds: [todoEmbeds.todoDeleted(id)],
                    flags: "Ephemeral",
                });
            }
            case "complete": {
                const id = interaction.options.getInteger("id", true);
                const exists = await todoService.getTodoById(id);
                if (!exists) {
                    return await interaction.reply({
                        embeds: [todoEmbeds.todoNotFound(id)],
                        flags: "Ephemeral",
                    });
                }
                if (exists.done) {
                    return await interaction.reply({
                        embeds: [todoEmbeds.todoAlreadyCompleted(id)],
                        flags: "Ephemeral",
                    });
                }
                await todoService.completeTodo(id);
                return await interaction.reply({
                    embeds: [todoEmbeds.todoCompleted(id)],
                    flags: "Ephemeral",
                });
            }
            default: 
                return await interaction.reply({
                    embeds: [sharedEmbeds.unknownSubcommand()],
                    flags: "Ephemeral",
                });
        }
    } catch (error) {
        console.error(error);
        return await interaction.reply({
            embeds: [sharedEmbeds.errorCommand()],
            flags: "Ephemeral",
        });
    }
};
