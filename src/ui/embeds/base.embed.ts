import { EmbedBuilder } from "discord.js";

export const baseEmbed = () => new EmbedBuilder()
    .setColor(0x3498db)
    .setFooter({
        text: "Dialcore • Learn smarter, not harder",
    })
    .setTimestamp();
    