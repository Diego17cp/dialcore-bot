import { TopicService } from "./topic.service";
import { SectionService } from "./section.service";
import { PageService } from "./page.service";
import { ReviewService } from "./review.service";

export class LearningService {
    public topics = new TopicService();
    public sections = new SectionService();
    public pages = new PageService();
    public reviews = new ReviewService();
}