import { ITodo } from "@/modules/todos";
import { EMBED_COLORS } from "../colors";
import { baseEmbed } from "./base.embed";

export const todoEmbeds = {
    todoListEmpty: () =>
        baseEmbed()
            .setColor(EMBED_COLORS.WARNING)
            .setTitle("📝 No To-Do Items Found")
            .setDescription("You currently have no to-do items. Use the `/todo add` command to create one!")
            .setFooter({ text: "💡 Tip: Start by adding your first task!" }),

    todoAdded: (title: string, id: number) =>
        baseEmbed()
            .setColor(EMBED_COLORS.SUCCESS)
            .setTitle("✅ To-Do Item Added")
            .setDescription(`Your to-do item "**${title}**" has been added with ID **${id}**.`)
            .addFields({
                name: "📌 ID",
                value: `\`${id}\``,
                inline: true,
            })
            .setFooter({ text: "Use /todo list to view all your tasks" }),

    todoUpdated: (id: number, fields: Array<{ name: string; value: string }>) =>
        baseEmbed()
            .setColor(EMBED_COLORS.SUCCESS)
            .setTitle("✏️ To-Do Item Updated")
            .setDescription(`Your to-do item with ID **${id}** has been successfully updated.`)
            .addFields(fields)
            .setFooter({ text: `ID: ${id}` }),

    todoDeleted: (id: number) =>
        baseEmbed()
            .setColor(EMBED_COLORS.SUCCESS)
            .setTitle("🗑️ To-Do Item Deleted")
            .setDescription(`Your to-do item with ID **${id}** has been successfully deleted.`)
            .addFields({
                name: "📌 ID",
                value: `\`${id}\``,
                inline: true,
            }),

    todoAlreadyExists: (title: string) =>
        baseEmbed()
            .setColor(EMBED_COLORS.ERROR)
            .setTitle("❌ To-Do Item Already Exists")
            .setDescription(`You already have a to-do item with the title "**${title}**". Please choose a different title.`)
            .setFooter({ text: "💡 Try adding a number or emoji to make it unique!" }),

    todoNotFound: (id: number) =>
        baseEmbed()
            .setColor(EMBED_COLORS.ERROR)
            .setTitle("❌ To-Do Item Not Found")
            .setDescription(`No to-do item found with ID **${id}**.`)
            .addFields({
                name: "🔍 Searched ID",
                value: `\`${id}\``,
                inline: true,
            })
            .setFooter({ text: "Use /todo list to see your available tasks" }),

    todoList: (todos: ITodo[]) => {
        const description = todos
            .map(todo => {
                const status = todo.done ? "✅" : "⏳";
                const title = `**#${todo.id}. ${todo.title}**`;
                const desc = todo.description || "*No description*";
                return `${status} ${title} - ${desc}`;
            })
            .join("\n");
        return baseEmbed()
            .setColor(EMBED_COLORS.INFO)
            .setTitle("📋 Your To-Do Items")
            .setDescription(description)
            .setFooter({ text: "Tasks completed for more than a month will be automatically deleted." });
    },

    todoCompleted: (id: number) =>
        baseEmbed()
            .setColor(EMBED_COLORS.SUCCESS)
            .setTitle("🎉 To-Do Item Completed")
            .setDescription(`Your to-do item with ID **${id}** has been marked as complete.`)
            .addFields({
                name: "📌 ID",
                value: `\`${id}\``,
                inline: true,
            })
            .setFooter({ text: "Great job! Keep up the good work!" }),

    todoAlreadyCompleted: (id: number) =>
        baseEmbed()
            .setColor(EMBED_COLORS.WARNING)
            .setTitle("⚠️ To-Do Item Already Completed")
            .setDescription(`Your to-do item with ID **${id}** is already marked as complete.`)
            .addFields({
                name: "📌 ID",
                value: `\`${id}\``,
                inline: true,
            }),

    todoError: (message: string) =>
        baseEmbed()
            .setColor(EMBED_COLORS.ERROR)
            .setTitle("❌ To-Do Error")
            .setDescription(message),
};