import { EMBED_COLORS } from "../colors";
import { baseEmbed } from "./base.embed";

export const sharedEmbeds = {
    errorCommand: () => 
        baseEmbed()
            .setTitle("❌ Error")
            .setDescription("An error occurred while processing your command. Please try again later.")
            .setColor(EMBED_COLORS.ERROR),
    unknownSubcommand: () =>
        baseEmbed()
            .setColor(EMBED_COLORS.ERROR)
            .setTitle("❌ Unknown Subcommand")
            .setDescription("The subcommand you used is not recognized."),
    serverContextRequired: () =>
        baseEmbed()
            .setColor(EMBED_COLORS.WARNING)
            .setTitle("⚠️ Server Context Required")
            .setDescription("This command can only be used in a server."),
    permissionDenied: () => 
        baseEmbed()
            .setColor(EMBED_COLORS.ERROR)
            .setTitle("❌ Permission Denied")
            .setDescription("You do not have permission to perform this action."),
}