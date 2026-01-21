import { SlashCommandBuilder } from "discord.js";

export const devCommand = new SlashCommandBuilder()
	.setName("dev")
	.setDescription("Developer related commands")
	.addSubcommand((sub) =>
		sub
			.setName("profile")
			.setDescription("Get GitHub profile information")
			.addStringOption((opt) =>
				opt
					.setName("username")
					.setDescription("GitHub username")
					.setRequired(true),
			),
	)
	.addSubcommand((sub) =>
		sub
			.setName("repos")
			.setDescription("Get GitHub repositories for a user")
			.addStringOption((opt) =>
				opt
					.setName("username")
					.setDescription("GitHub username")
					.setRequired(true),
			),
	)
	.addSubcommand((sub) =>
		sub
			.setName("repo")
			.setDescription("Get a specific GitHub repository")
			.addStringOption((opt) =>
				opt
					.setName("owner")
					.setDescription("Owner of the repository")
					.setRequired(true),
			)
			.addStringOption((opt) =>
				opt
					.setName("repo")
					.setDescription("Repository name")
					.setRequired(true),
			),
	)
    .addSubcommand((sub) =>
        sub
            .setName("stats")
            .setDescription("Get GitHub statistics for a user")
            .addStringOption((opt) =>
                opt
                    .setName("username")
                    .setDescription("GitHub username")
                    .setRequired(true),
            ),
    );
