import {
	LearningTopic as DBLearningTopic,
	LearningSection as DBLearningSection,
	LearningPage as DBLearningPage,
	LearningReview as DBLearningReview,
} from "generated/prisma/client";

export type ILearningTopic = DBLearningTopic;
export type ILearningSection = DBLearningSection;
export type ILearningPage = DBLearningPage;
export type ILearningReview = DBLearningReview;


// ==========================
// Learning Topic Interfaces
// ==========================
export default interface LearningTopic {
    id: number;
    userId: string | null;
    guildId: string | null;
    title: string;
    slug: string;
    description: string | null;
    createdAt: Date;
}
export interface LearningTopicCreate {
    userId?: string | null;
    guildId?: string | null;
    title: string;
    slug: string;
    description?: string | null;
}
export interface LearningTopicUpdate extends Partial<LearningTopicCreate> {}

// ==========================
// Learning Section Interfaces
// ==========================
export interface LearningSection {
    id: number;
    topicId: number;
    title: string;
    slug: string;
    createdAt: Date;
}
export interface LearningSectionCreate {
    topicId: number;
    title: string;
    slug: string;
}
export interface LearningSectionUpdate extends Partial<LearningSectionCreate> {}

// ==========================
// Learning Page Interfaces
// ==========================
export interface LearningPage {
    id: number;
    slug: string;
    sectionId: number;
    title: string;
    content: string;
    createdAt: Date;
    emphasis: string | null;
}
export interface LearningPageCreate {
    slug: string;
    sectionId: number;
    title: string;
    content: string;
    emphasis?: string | null;
}
export interface LearningPageUpdate extends Partial<LearningPageCreate> {}

// ==========================
// Learning Review Interfaces
// ==========================
export interface LearningReview {
    id: number;
    pageId: number;
    userId: string;
    confidence: number | null;
    lastReviewedAt: Date;
    nextReviewAt: Date | null;
}
export interface LearningReviewCreate {
    pageId: number;
    userId: string;
    confidence?: number | null;
    nextReviewAt?: Date | null;
}
export interface LearningReviewUpdate extends Partial<LearningReviewCreate> {}