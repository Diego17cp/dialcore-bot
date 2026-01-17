import { DatabaseConnection } from "@/config";
import {
	LearningSectionCreate,
	LearningSectionUpdate,
} from "../learning.model";

export class SectionRepository {
	private db = DatabaseConnection.getInstance().getClient();

	async findById(id: number) {
		return this.db.learningSection.findUnique({
			where: { id },
		});
	}
	async findBySlug(topicId: number, slug: string) {
		return this.db.learningSection.findUnique({
			where: {
				topicId_slug: {
					topicId,
					slug,
				},
			},
		});
	}
	async findByTopicId(topicId: number) {
		return this.db.learningSection.findMany({
			where: { topicId },
			orderBy: { createdAt: "asc" },
		});
	}
	async create(data: LearningSectionCreate) {
		return this.db.learningSection.create({
			data,
		});
	}
	async update(id: number, data: LearningSectionUpdate) {
		return this.db.learningSection.update({
			where: { id },
			data,
		});
	}
	async updateBySlug(slug: string, data: LearningSectionUpdate) {
		return this.db.learningSection.updateMany({
			where: { slug },
			data,
		});
	}
	async delete(id: number) {
		return this.db.learningSection.delete({
			where: { id },
		});
	}
}
