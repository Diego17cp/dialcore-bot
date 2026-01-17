import { SlashCommandBuilder, SlashCommandStringOption, SlashCommandIntegerOption } from "discord.js";

const scopeOption = (option: SlashCommandStringOption) =>
    option
        .setName("scope")
        .setDescription("Filter by scope")
        .setRequired(false)
        .addChoices(
            { name: "All", value: "all" },
            { name: "📝 Personal", value: "personal" },
            { name: "🏠 Server", value: "server" },
            { name: "🌍 Global", value: "global" }
        );

const topicOption = (option: SlashCommandStringOption, required = true) =>
    option
        .setName("topic")
        .setDescription("Slug of the topic")
        .setRequired(required);

const sectionOption = (option: SlashCommandStringOption, required = true) =>
    option
        .setName("section")
        .setDescription("Slug of the section")
        .setRequired(required);

const pageOption = (option: SlashCommandStringOption, required = true) =>
    option
        .setName("page")
        .setDescription("Slug of the page")
        .setRequired(required);

export const learnCommand = new SlashCommandBuilder()
    .setName("learn")
    .setDescription("Learning module commands")
    
    // ==================== TOPIC ====================
    .addSubcommandGroup((group) =>
        group
            .setName("topic")
            .setDescription("Manage learning topics")
            .addSubcommand((sub) =>
                sub
                    .setName("add")
                    .setDescription("Create a new topic")
                    .addStringOption((opt) =>
                        opt.setName("title").setDescription("Topic title").setRequired(true)
                    )
                    .addStringOption((opt) =>
                        opt.setName("description").setDescription("Topic description").setRequired(false)
                    )
                    .addBooleanOption((opt) =>
                        opt
                            .setName("global")
                            .setDescription("Make topic global (requires admin)")
                            .setRequired(false)
                    )
            )
            .addSubcommand((sub) =>
                sub
                    .setName("list")
                    .setDescription("List available topics")
                    .addStringOption(scopeOption)
            )
            .addSubcommand((sub) =>
                sub
                    .setName("view")
                    .setDescription("View a specific topic")
                    .addStringOption(topicOption)
            )
            .addSubcommand((sub) =>
                sub
                    .setName("update")
                    .setDescription("Update a topic")
                    .addStringOption(topicOption)
                    .addStringOption((opt) =>
                        opt.setName("title").setDescription("New title").setRequired(false)
                    )
                    .addStringOption((opt) =>
                        opt.setName("description").setDescription("New description").setRequired(false)
                    )
            )
            .addSubcommand((sub) =>
                sub
                    .setName("delete")
                    .setDescription("Delete a topic")
                    .addStringOption(topicOption)
            )
    )
    
    // ==================== SECTION ====================
    .addSubcommandGroup((group) =>
        group
            .setName("section")
            .setDescription("Manage learning sections")
            .addSubcommand((sub) =>
                sub
                    .setName("add")
                    .setDescription("Add a section to a topic")
                    .addStringOption(topicOption)
                    .addStringOption((opt) =>
                        opt.setName("title").setDescription("Section title").setRequired(true)
                    )
            )
            .addSubcommand((sub) =>
                sub
                    .setName("list")
                    .setDescription("List sections in a topic")
                    .addStringOption(topicOption)
            )
            .addSubcommand((sub) =>
                sub
                    .setName("view")
                    .setDescription("View a specific section")
                    .addStringOption(topicOption)
                    .addStringOption(sectionOption)
            )
            .addSubcommand((sub) =>
                sub
                    .setName("update")
                    .setDescription("Update a section")
                    .addStringOption(topicOption)
                    .addStringOption(sectionOption)
                    .addStringOption((opt) =>
                        opt.setName("title").setDescription("New title").setRequired(false)
                    )
            )
            .addSubcommand((sub) =>
                sub
                    .setName("delete")
                    .setDescription("Delete a section")
                    .addStringOption(topicOption)
                    .addStringOption(sectionOption)
            )
    )
    
    // ==================== PAGE ====================
    .addSubcommandGroup((group) =>
        group
            .setName("page")
            .setDescription("Manage learning pages")
            .addSubcommand((sub) =>
                sub
                    .setName("add")
                    .setDescription("Add a page to a section")
                    .addStringOption(topicOption)
                    .addStringOption(sectionOption)
                    .addStringOption((opt) =>
                        opt.setName("title").setDescription("Page title").setRequired(true)
                    )
                    .addStringOption((opt) =>
                        opt.setName("content").setDescription("Page content").setRequired(true)
                    )
                    .addStringOption((opt) =>
                        opt.setName("emphasis").setDescription("Page emphasis").setRequired(false)
                    )
            )
            .addSubcommand((sub) =>
                sub
                    .setName("list")
                    .setDescription("List pages in a section")
                    .addStringOption(topicOption)
                    .addStringOption(sectionOption)
            )
            .addSubcommand((sub) =>
                sub
                    .setName("view")
                    .setDescription("View a specific page")
                    .addStringOption(topicOption)
                    .addStringOption(sectionOption)
                    .addStringOption(pageOption)
            )
            .addSubcommand((sub) =>
                sub
                    .setName("update")
                    .setDescription("Update a page")
                    .addStringOption(topicOption)
                    .addStringOption(sectionOption)
                    .addStringOption(pageOption)
                    .addStringOption((opt) =>
                        opt.setName("title").setDescription("New title").setRequired(false)
                    )
                    .addStringOption((opt) =>
                        opt.setName("content").setDescription("New content").setRequired(false)
                    )
                    .addStringOption((opt) =>
                        opt.setName("emphasis").setDescription("New emphasis").setRequired(false)
                    )
            )
            .addSubcommand((sub) =>
                sub
                    .setName("delete")
                    .setDescription("Delete a page")
                    .addStringOption(topicOption)
                    .addStringOption(sectionOption)
                    .addStringOption(pageOption)
            )
    )
    
    // ==================== REVIEW ====================
    .addSubcommandGroup((group) =>
        group
            .setName("review")
            .setDescription("Manage learning reviews")
            .addSubcommand((sub) =>
                sub
                    .setName("rate")
                    .setDescription("Review a page")
                    .addStringOption(topicOption)
                    .addStringOption(sectionOption)
                    .addStringOption(pageOption)
                    .addIntegerOption((opt: SlashCommandIntegerOption) =>
                        opt
                            .setName("confidence")
                            .setDescription("How well you understood (1-5)")
                            .setRequired(false)
                            .setMinValue(1)
                            .setMaxValue(5)
                    )
            )
            .addSubcommand((sub) =>
                sub
                    .setName("next")
                    .setDescription("List pages due for review")
            )
            .addSubcommand((sub) =>
                sub
                    .setName("stats")
                    .setDescription("View your review statistics")
                    .addStringOption((opt: SlashCommandStringOption) => topicOption(opt, false))
            )
    );
