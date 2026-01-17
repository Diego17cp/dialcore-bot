import { LearningTopicUpdate } from "../learning.model";
import { TopicRepository } from "../repositories";
import { slugify } from "../utils/learning.utils";

export type TopicScope = 'personal' | 'server' | 'global';
export type TopicSource = 'personal-server' | 'server' | 'personal-global' | 'global';

export class TopicService {
	private topicRepository = new TopicRepository();

	async createTopic(
		userId: string | null,
		guildId: string | null,
		title: string,
		description: string | null
	) {
        const slug = slugify(title);
        const exists = await this.topicRepository.findBySlug(userId, guildId, slug);
        if (exists) throw new Error("Topic with this slug already exists.");
        return this.topicRepository.create({
            userId,
            guildId,
            title,
            slug,
            description,
        })
    }
    async updateTopic(
        id: number,
        title?: string,
        description?: string | null
    ) {
        const exists = await this.topicRepository.findById(id);
        if (!exists) throw new Error("Topic not found.");

        const updateData: LearningTopicUpdate = {};
        if (title !== undefined) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        return this.topicRepository.update(id, updateData);
    }
    async deleteTopic(id: number) {
        const exists = await this.topicRepository.findById(id);
        if (!exists) throw new Error("Topic not found.");
        return this.topicRepository.delete(id);
    }
    async getTopicById(id: number) {
        return this.topicRepository.findById(id);
    }
    async getTopicBySlug(
        userId: string | null,
        guildId: string | null,
        slug: string,
        scope?: TopicScope
    ) {
        if (scope === 'personal') {
            const topic = await this.topicRepository.findBySlug(userId, guildId, slug);
            if (topic) return { topic, source: 'personal-server' as TopicSource };
            const globalTopic = await this.topicRepository.findBySlug(userId, null, slug);
            if (globalTopic) return { topic: globalTopic, source: 'personal-global' as TopicSource };
            return null;
        }
        if (scope === 'server') {
            const topic = await this.topicRepository.findBySlug(null, guildId, slug);
            return topic ? { topic, source: 'server' as TopicSource } : null;
        }
        if (scope === 'global') {
            const topic = await this.topicRepository.findBySlug(null, null, slug);
            return topic ? { topic, source: 'global' as TopicSource } : null;
        }
        let topic = await this.topicRepository.findBySlug(userId, guildId, slug);
        if (topic) return { topic, source: 'personal-server' as TopicSource };
        topic = await this.topicRepository.findBySlug(null, guildId, slug);
        if (topic) return { topic, source: 'server' as TopicSource };
        topic = await this.topicRepository.findBySlug(userId, null, slug);
        if (topic) return { topic, source: 'personal-global' as TopicSource };
        topic = await this.topicRepository.findBySlug(null, null, slug);
        if (topic) return { topic, source: 'global' as TopicSource };
        return null;
    }
    async getAvailableTopics(userId: string, guildId: string) {
        const topics = await this.topicRepository.findAvailable(userId, guildId);
        return {
            personalServer: topics.filter(t => t.userId === userId && t.guildId === guildId),
            server: topics.filter(t => t.userId === null && t.guildId === guildId),
            personalGlobal: topics.filter(t => t.userId === userId && t.guildId === null),
            global: topics.filter(t => t.userId === null && t.guildId === null),
        }
    }
    async getTopicsByUser(userId: string, guildId: string | null = null) {
        return this.topicRepository.findByUser(userId, guildId);
    }
    async getTopicsByGuild(guildId: string) {
        return this.topicRepository.findByGuild(guildId);
    }
    async getGlobalTopics() {
        return this.topicRepository.findGlobal();
    }
}
