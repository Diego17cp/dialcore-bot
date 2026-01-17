import { isBotAdmin } from "@/core/utils";
import { LearningPageUpdate } from "../learning.model";
import { PageRepository, SectionRepository } from "../repositories";
import { slugify } from "../utils/learning.utils";
import { TopicService } from "./topic.service";

export class PageService {
	private pageRepository = new PageRepository();
	private sectionRepository = new SectionRepository();
	private topicService = new TopicService();

	private validateTopicPermission(
		topic: any,
		userId: string | null,
		action: string,
	) {
		if (topic.userId && topic.userId !== userId)
			throw new Error(
				`You don't have permission to ${action} this page.`,
			);
		if (topic.userId === null && topic.guildId !== null && userId === null)
			throw new Error(
				`You must be logged in to ${action} server topics.`,
			);
		if (topic.userId === null && topic.guildId === null) {
			if (!userId || !isBotAdmin(userId))
				throw new Error(
					`Only bot administrators can ${action} global topics.`,
				);
		}
	}

	async createPage(
		userId: string | null,
		guildId: string | null,
		topicSlug: string,
		sectionSlug: string,
		title: string,
		content: string,
		emphasis: string | null = null,
	) {
		const result = await this.topicService.getTopicBySlug(
			userId,
			guildId,
			topicSlug,
		);
		if (!result) throw new Error("Topic not found.");

		const { topic } = result;

		const section = await this.sectionRepository.findBySlug(
			topic.id,
			sectionSlug,
		);
		if (!section) throw new Error("Section not found.");

		this.validateTopicPermission(topic, userId, "create");

		const slug = slugify(title);
		const exists = await this.pageRepository.findBySlug(section.id, slug);
		if (exists)
			throw new Error(
				"Page with this slug already exists in the section.",
			);
		return this.pageRepository.create({
			sectionId: section.id,
			title,
			slug,
			content,
			emphasis,
		});
	}

	async updatePage(
		id: number,
		userId: string | null,
		title?: string,
		content?: string,
		emphasis?: string | null,
	) {
		const page = await this.pageRepository.findById(id);
		if (!page) throw new Error("Page not found.");

		const topic = page.LearningSection?.LearningTopic;
		if (!topic) throw new Error("Topic not found.");

		this.validateTopicPermission(topic, userId, "edit");

		const updateData: LearningPageUpdate = {};
		if (title !== undefined) {
			const slug = slugify(title);
			const slugExists = await this.pageRepository.findBySlug(
				page.sectionId,
				slug,
			);
			if (slugExists && slugExists.id !== id)
				throw new Error(
					"Page with this slug already exists in the section.",
				);
			updateData.title = title;
			updateData.slug = slug;
		}
		if (content !== undefined) {
			updateData.content = content;
		}
		if (emphasis !== undefined) {
			updateData.emphasis = emphasis;
		}
		return this.pageRepository.update(id, updateData);
	}

	async deletePage(id: number, userId: string | null) {
		const page = await this.pageRepository.findById(id);
		if (!page) throw new Error("Page not found.");

		const topic = page.LearningSection?.LearningTopic;
		if (!topic) throw new Error("Topic not found.");

		this.validateTopicPermission(topic, userId, "delete");

		return this.pageRepository.delete(id);
	}

	async getPageById(id: number) {
		return this.pageRepository.findById(id);
	}

	async getPageBySlug(
		userId: string | null,
		guildId: string | null,
		topicSlug: string,
		sectionSlug: string,
		slug: string,
	) {
		const result = await this.topicService.getTopicBySlug(
			userId,
			guildId,
			topicSlug,
		);
		if (!result) throw new Error("Topic not found.");

		const { topic } = result;

		const section = await this.sectionRepository.findBySlug(
			topic.id,
			sectionSlug,
		);
		if (!section) throw new Error("Section not found.");

		return this.pageRepository.findBySlug(section.id, slug);
	}

	async getPagesBySection(sectionId: number) {
		return this.pageRepository.findBySectionId(sectionId);
	}
}
