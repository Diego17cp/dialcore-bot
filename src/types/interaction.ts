import { Guild, User, Interaction } from "discord.js";

import {
	GuildConfig,
	UserSettings,
	GuildUser,
	Guild as IGuild,
	User as IUser,
} from "generated/prisma/client";

export interface InteractionContext {
	interaction: Interaction;
	guild: Guild;
	user: User;
	userGuild: GuildUser;
	guildSettings: GuildConfig & { Guild: IGuild };
	userSettings: UserSettings & { User: IUser };
}
