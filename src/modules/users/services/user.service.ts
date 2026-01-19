import { UserRepository } from "../repositories/user.repository";

export class UserService {
	private repo = new UserRepository();
	async sync(discordUser: {
		id: string;
		username: string;
		avatar: string | null;
	}) {
		return await this.repo.upsertFromDiscord(discordUser);
	}
}
