import { DatabaseConnection } from "@/config";
import { LearningTopicCreate, LearningTopicUpdate } from "../learning.model";
import { TopicScope, TopicSource } from "../services";

export class TopicRepository {
	private db = DatabaseConnection.getInstance().getClient();

	async findAll() {
		return this.db.learningTopic.findMany();
	}
	async findById(id: number) {
		return this.db.learningTopic.findUnique({
			where: { id },
			include: {
				LearningSection: true,
			},
		});
	}
	async findBySlug(userId: string | null, guildId: string | null, slug: string) {
		return this.db.learningTopic.findFirst({
			where: {
				userId: userId || null,
				guildId: guildId || null,
				slug,
			},
			include: {
				LearningSection: {
					include: {
						LearningPage: true,
					}
				},
			},
		});
	}
	async getTopicBySlug(
		userId: string | null,
		guildId: string | null,
		slug: string,
		scope?: TopicScope
	){
		if (scope === 'personal') {
			const topic = await this.findBySlug(userId, guildId, slug);
			if (topic) return { topic, source: 'personal-server' as TopicSource };
			const globalTopic = await this.findBySlug(userId, null, slug);
			if (globalTopic) return { topic: globalTopic, source: 'personal-global' as TopicSource };
			return null;
		}
		if (scope === 'server') {
			const topic = await this.findBySlug(null, guildId, slug);
			if (topic) return { topic, source: 'server' as TopicSource };
			return null;
		}
		if (scope === 'global') {
			const topic = await this.findBySlug(null, null, slug);
			if (topic) return { topic, source: 'global' as TopicSource };
			return null;
		}
		let topic = await this.findBySlug(userId, guildId, slug);
		if (topic) return { topic, source: 'personal-server' as TopicSource };
		topic = await this.findBySlug(null, guildId, slug);
		if (topic) return { topic, source: 'server' as TopicSource };
		topic = await this.findBySlug(userId, null, slug);
		if (topic) return { topic, source: 'personal-global' as TopicSource };
		topic = await this.findBySlug(null, null, slug);
		if (topic) return { topic, source: 'global' as TopicSource };
		return null;
	}
	async findAvailable(userId: string, guildId: string) {
		return this.db.learningTopic.findMany({
			where: {
				OR: [
					{ userId, guildId },
					{ userId: null, guildId },
					{ userId, guildId: null },
					{ userId: null, guildId: null },
				],
			},
			include: {
				LearningSection: true,
			},
		});
	}
	async findByUser(userId: string, guildId: string | null = null) {
		return this.db.learningTopic.findMany({
			where: { userId, guildId },
			include: { LearningSection: true },
		});
	}

	async findByGuild(guildId: string) {
		return this.db.learningTopic.findMany({
			where: { userId: null, guildId },
			include: { LearningSection: true },
		});
	}

	async findGlobal() {
		return this.db.learningTopic.findMany({
			where: { userId: null, guildId: null },
			include: { LearningSection: true },
		});
	}
	async create(data: LearningTopicCreate) {
		return this.db.learningTopic.create({
			data: {
				userId: data.userId || null,
				guildId: data.guildId || null,
				title: data.title,
				slug: data.slug,
				description: data.description || null,
			},
		});
	}
	async update(id: number, data: LearningTopicUpdate) {
		return this.db.learningTopic.update({
			where: { id },
			data: {
				...data,
			},
		});
	}
	async updateBySlug(slug: string, data: LearningTopicUpdate) {
		return this.db.learningTopic.updateMany({
			where: { slug },
			data: {
				...data,
			},
		});
	}
	async delete(id: number) {
		return this.db.learningTopic.delete({
			where: { id },
		});
	}
	async deleteBySlug(slug: string) {
		return this.db.learningTopic.deleteMany({
			where: { slug },
		});
	}
}
