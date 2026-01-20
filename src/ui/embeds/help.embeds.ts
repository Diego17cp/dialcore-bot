import { getCommandId } from "@/commands";
import { baseEmbed } from "./base.embed";
import { env } from "@/config";

function formatCategoriesGrid(categoryStats: Record<string, number>): string {
	const names = Object.keys(categoryStats).map(
		(name) => name.charAt(0).toUpperCase() + name.slice(1).toLowerCase(),
	);

	const cols = 3;
	const rows = Math.ceil(names.length / cols);

	let output = "```";
	for (let r = 0; r < rows; r++) {
		for (let c = 0; c < cols; c++) {
			const i = r + c * rows;
			if (names[i]) {
				output += names[i].padEnd(15);
			}
		}
		output += "\n";
	}
	output += "```";

	return output;
}

export const buildHelpEmbed = (stats: {
	totalCommands: number;
	categoryStats: Record<string, number>;
	totalSubcommands: number;
}) =>
	baseEmbed()
		.setTitle("📖 Dialcore Commands")
		.setDescription(
			`» **Help menu**\n` +
				`I have **${stats.totalCommands} categories** and ` +
				`**${stats.totalCommands + stats.totalSubcommands} commands** to explore.`,
		)
		.addFields({
			name: "» Categories",
			value: formatCategoriesGrid(stats.categoryStats),
		});

export const createCategoryEmbed = (
	category: string,
	commands: { command: string; description: string }[],
	page: number,
    ITEMS_PER_PAGE: number,
) => {
	const commandId = getCommandId(category);
	const totalPages = Math.ceil(commands.length / ITEMS_PER_PAGE);
	const startIndex = (page - 1) * ITEMS_PER_PAGE;
	const endIndex = startIndex + ITEMS_PER_PAGE;
	const pageCommands = commands.slice(startIndex, endIndex);

	const embed = baseEmbed()
		.setTitle(`Commands (${commands.length})`)
		.setDescription(
			`You can also view the full command list on the [website](${env.DOCS_URL})`,
		)
		.setFooter({ text: `Page ${page} of ${totalPages}` });

	for (const cmd of pageCommands) {
		embed.addFields({
			name: `<${cmd.command}:${commandId}>`,
			value: cmd.description,
			inline: false,
		});
	}

	return embed;
};
