import { LearningSectionUpdate } from "../learning.model";
import { SectionRepository } from "../repositories";
import { slugify } from "../utils/learning.utils";
import { TopicService } from "./topic.service";

export class SectionService {
    private sectionRepository = new SectionRepository();
    private topicService = new TopicService();

    async createSection(
        userId: string | null,
        guildId: string | null,
        topicSlug: string,
        title: string
    ) {
        const result = await this.topicService.getTopicBySlug(
            userId,
            guildId,
            topicSlug
        );
        
        if (!result) throw new Error("Topic not found.");
        
        const { topic } = result;
        
        const slug = slugify(title);
        const exists = await this.sectionRepository.findBySlug(topic.id, slug);
        if (exists)
            throw new Error(
                "Section with this slug already exists in the topic."
            );
        return this.sectionRepository.create({
            topicId: topic.id,
            title,
            slug,
        });
    }
    
    async updateSection(id: number, title?: string) {
        const exists = await this.sectionRepository.findById(id);
        if (!exists) throw new Error("Section not found.");
        const updateData: LearningSectionUpdate = {};
        if (title !== undefined) {
            const slug = slugify(title);
            const slugExists = await this.sectionRepository.findBySlug(
                exists.topicId,
                slug
            );
            if (slugExists && slugExists.id !== id)
                throw new Error(
                    "Section with this slug already exists in the topic."
                );
            updateData.title = title;
            updateData.slug = slug;
        }
        return this.sectionRepository.update(id, updateData);
    }
    
    async deleteSection(id: number) {
        const exists = await this.sectionRepository.findById(id);
        if (!exists) throw new Error("Section not found.");
        return this.sectionRepository.delete(id);
    }
    
    async getSectionById(id: number) {
        return this.sectionRepository.findById(id);
    }
    
    async getSectionBySlug(
        userId: string | null,
        guildId: string | null,
        topicSlug: string,
        slug: string
    ) {
        const result = await this.topicService.getTopicBySlug(
            userId,
            guildId,
            topicSlug
        );
        
        if (!result) throw new Error("Topic not found.");
        
        const { topic } = result;
        
        return this.sectionRepository.findBySlug(topic.id, slug);
    }
    
    async getSectionsByTopic(topicId: number) {
        return this.sectionRepository.findByTopicId(topicId);
    }
}
