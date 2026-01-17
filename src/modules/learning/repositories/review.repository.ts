import { DatabaseConnection } from "@/config";

export class ReviewRepository {
    private db = DatabaseConnection.getInstance().getClient();
	upsert(data: {
		pageId: number;
		userId: string;
		lastReviewedAt: Date;
		nextReviewAt?: Date;
		confidence?: number;
	}) {
		return this.db.learningReview.upsert({
			where: {
				pageId_userId: {
					pageId: data.pageId,
					userId: data.userId,
				},
			},
			create: data,
			update: {
				lastReviewedAt: data.lastReviewedAt,
				...(data.nextReviewAt !== undefined && { nextReviewAt: data.nextReviewAt }),
				...(data.confidence !== undefined && { confidence: data.confidence }),
			},
		});
	}

	findByPageAndUser(pageId: number, userId: string) {
		return this.db.learningReview.findUnique({
			where: {
				pageId_userId: {
					pageId,
					userId,
				},
			},
		});
	}

	listDueReviews(userId: string, guildId: string | null, now = new Date()) {
		return this.db.learningReview.findMany({
			where: {
				userId,
				OR: [{ nextReviewAt: { lte: now } }, { nextReviewAt: null }],
                LearningPage: {
                    LearningSection: {
                        LearningTopic: {
                            OR: [
                                { userId },
                                { userId: null, guildId },
                                { userId: null, guildId: null },
                            ]
                        },
                    }
                }
			},
			include: {
				LearningPage: {
					include: {
						LearningSection: {
							include: {
								LearningTopic: true,
							},
						},
					},
				},
			},
			orderBy: {
				nextReviewAt: "asc",
			},
		});
	}
}
