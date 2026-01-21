export type CommandMeta = {
	name: string;
	description: string;
	category: string;
	subcommands?: {
		name: string;
		description: string;
		subcommands?: {
			name: string;
			description: string;
		}[];
	}[];
};

export const commandRegistry: CommandMeta[] = [
	{
		name: "settings",
		description: "Manage bot settings",
		category: "Configuration",
		subcommands: [
			{
				name: "user",
				description: "Manage your personal settings",
			},
			{
				name: "guild",
				description: "Manage server settings (requires admin)",
			},
		],
	},
	{
		name: "learn",
		description: "Learning management system",
		category: "Education",
		subcommands: [
			{
				name: "topic",
				description: "Manage learning topics",
				subcommands: [
					{ name: "add", description: "Create a new topic" },
					{ name: "list", description: "List available topics" },
					{ name: "delete", description: "Delete a topic" },
					{ name: "update", description: "Update topic information" },
					{ name: "view", description: "View topic details" },
				],
			},
			{
				name: "section",
				description: "Manage topic sections",
				subcommands: [
					{ name: "add", description: "Create a new section" },
					{ name: "list", description: "List sections in a topic" },
					{ name: "delete", description: "Delete a section" },
					{
						name: "update",
						description: "Update section information",
					},
					{ name: "view", description: "View section details" },
				],
			},
			{
				name: "page",
				description: "Manage section pages",
				subcommands: [
					{ name: "add", description: "Create a new page" },
					{ name: "list", description: "List pages in a section" },
					{ name: "delete", description: "Delete a page" },
					{ name: "update", description: "Update page content" },
					{ name: "read", description: "Read page content" },
				],
			},
			{
				name: "review",
				description: "Review learning material",
				subcommands: [
					{ name: "start", description: "Start reviewing" },
					{ name: "next", description: "View next due reviews" },
					{ name: "rate", description: "Rate a review" },
				],
			},
		],
	},
	{
		name: "dev",
		description: "Developer tools and utilities",
		category: "Developer",
		subcommands: [
			{
				name: "profile",
				description: "View GitHub profile information",
			},
			{
				name: "repos",
				description: "List GitHub repositories for a user",
			},
			{
				name: "repo",
				description: "Get details about a specific repository",
			},
			{
				name: "stats",
				description: "View GitHub user statistics",
			}
		]
	},
	{
		name: "pomodoro",
		description: "Manage Pomodoro timers",
		category: "Productivity",
		subcommands: [
			{
				name: "start",
				description: "Start a new Pomodoro timer",
			},
			{
				name: "stop",
				description: "Stop the active Pomodoro timer",
			}
		]
	}
];

const countCommandsInCategory = (category: string): number => {
    const commands = commandRegistry.filter(cmd => cmd.name === category);
    let total = 0;
    for (const cmd of commands) {
        total += 1;
        if (cmd.subcommands) {
            for (const sub of cmd.subcommands) {
                total += 1;
                if (sub.subcommands) total += sub.subcommands.length;
            }
        }
    }
    
    return total;
};
const categoryStats = Object.fromEntries(
    Array.from(new Set(commandRegistry.map(cmd => cmd.name))).map(category => [
        category,
        countCommandsInCategory(category),
    ])
);
const totalCommands = commandRegistry.length;
const totalSubcommandsLevel1 = commandRegistry.reduce(
    (sum, cmd) => sum + (cmd.subcommands?.length ?? 0),
    0,
);
const deepCount = commandRegistry.reduce((sum, cmd) => {
    return (
        sum +
        (cmd.subcommands?.reduce(
            (s, sc) => s + (sc.subcommands?.length ?? 0),
            0,
        ) ?? 0)
    );
}, 0)
export const getCommandsBySection = (sectionName: string): {command: string; description: string}[] => {
    const command = commandRegistry.find(cmd => cmd.name === sectionName);
    if (!command) return [];
    
    const commands: {command: string; description: string}[] = [];
    
    if (command.subcommands) {
        for (const sub of command.subcommands) {
            if (sub.subcommands) {
                for (const subsub of sub.subcommands) {
                    commands.push({command: `/${command.name} ${sub.name} ${subsub.name}`, description: subsub.description});
                }
            } else commands.push({command: `/${command.name} ${sub.name}`, description: sub.description});
        }
    }
    
    return commands;
};
export const getRegistryStats = () => ({
    totalCommands,
    totalSubcommands: totalSubcommandsLevel1 + deepCount,
    categoryStats,
});
export const commandIds = new Map<string, string>();

export const getCommandId = (commandName: string): string | undefined => {
    return commandIds.get(commandName);
};

export const setCommandId = (commandName: string, commandId: string) => {
    commandIds.set(commandName, commandId);
};