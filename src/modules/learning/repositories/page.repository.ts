import { DatabaseConnection } from "@/config";
import { LearningPageCreate, LearningPageUpdate } from "../learning.model";

export class PageRepository {
    private db = DatabaseConnection.getInstance().getClient();

    async findById(id: number) {
        return this.db.learningPage.findUnique({
            where: { id },
            include: {
                LearningReview: true,
                LearningSection: {
                    include: {
                        LearningTopic: true,
                    },
                }
            }
        });
    }
    async findBySlug(sectionId: number, slug: string) {
        return this.db.learningPage.findUnique({
            where: {
                sectionId_slug: {
                    sectionId,
                    slug,
                },
            },
            include: {
                LearningReview: true,
            }
        });
    }
    async findBySectionId(sectionId: number) {
        return this.db.learningPage.findMany({
            where: { sectionId },
            orderBy: { createdAt: "asc" },
        });
    }
    async create(data: LearningPageCreate) {
        return this.db.learningPage.create({
            data,
        });
    }
    async update(id: number, data: LearningPageUpdate) {
        return this.db.learningPage.update({
            where: { id },
            data,
        });
    }
    async updateBySlug(slug: string, data: LearningPageUpdate) {
        return this.db.learningPage.updateMany({
            where: { slug },
            data,
        });
    }
    async updateContent(id: number, content: Pick<LearningPageUpdate, "content" | "emphasis">) {
        return this.db.learningPage.update({
            where: { id },
            data: {
                ...content,
            },
        });
    }
    async delete(id: number) {
        return this.db.learningPage.delete({
            where: { id },
        });
    }
}