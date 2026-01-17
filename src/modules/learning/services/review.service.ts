import { ReviewRepository, PageRepository } from "../repositories";
import { DatabaseConnection } from "@/config";

export const calculateNextReview = (
	confidence?: number | null
): Date | null => {
	if (confidence === null || confidence === undefined) return null;
	const days =
		confidence <= 2 ? 1 : confidence === 3 ? 3 : confidence === 4 ? 7 : 14;
	const date = new Date();
	date.setDate(date.getDate() + days);
	return date;
};

export class ReviewService {
	private reviewRepository = new ReviewRepository();
	private pageRepository = new PageRepository();
	private db = DatabaseConnection.getInstance().getClient();

	private async ensureUser(userId: string, username?: string) {
		await this.db.user.upsert({
			where: { id: userId },
			update: {},
			create: {
				id: userId,
				username: username || "unknown",
			},
		});
	}

	private async canAccessPage(
		pageId: number,
		userId: string,
		guildId: string | null
	): Promise<boolean> {
		const page = await this.pageRepository.findById(pageId);
		if (!page) return false;

		const topic = page.LearningSection?.LearningTopic;
		if (!topic) return false;

		if (topic.userId && topic.userId !== userId) return false;
		if (topic.guildId && topic.guildId !== guildId) return false;
		return true;
	}

	async reviewPage(
		pageId: number,
		userId: string,
		guildId: string | null,
		confidence: number | null,
		username?: string
	) {
		const page = await this.pageRepository.findById(pageId);
		if (!page) throw new Error("Page not found.");

		const hasAccess = await this.canAccessPage(pageId, userId, guildId);
		if (!hasAccess) throw new Error("You do not have access to review this page.");

		await this.ensureUser(userId, username);

		const nextReviewAt = calculateNextReview(confidence);
		return this.reviewRepository.upsert({
			pageId,
			userId,
			lastReviewedAt: new Date(),
			...(nextReviewAt && { nextReviewAt }),
			...(confidence !== null && { confidence }),
		});
	}
	async getReviewForPage(
		pageId: number,
		userId: string,
		guildId: string | null
	) {
		const hasAccess = await this.canAccessPage(pageId, userId, guildId);
		if (!hasAccess)
			throw new Error("You do not have access to review this page.");
		return this.reviewRepository.findByPageAndUser(pageId, userId);
	}
	async listDueReviews(userId: string, guildId: string | null) {
		return this.reviewRepository.listDueReviews(userId, guildId);
	}
}
