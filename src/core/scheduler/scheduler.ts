import { SchedulerJob } from "./types";

class Scheduler {
    private jobs: SchedulerJob[] = [];
    private started = false;

    register(job: SchedulerJob) {
        if (this.started) console.warn(`[Scheduler] Job "${job.name}" registered after scheduler started.`);
        this.jobs.push(job);
    }
    start() {
        if (this.started) return
        this.started = true;
        console.log(`[Scheduler] Starting ${this.jobs.length} jobs.`);
        for (const job of this.jobs) {
            console.log(`[Scheduler] Starting job "${job.name}" with interval ${job.interval}ms.`);
            setInterval(async () => {
                try {
                    await job.run();
                } catch (error) {
                    console.error(`[Scheduler] Error running job "${job.name}":`, error);
                }
            }, job.interval)
        }
    }
}
export const scheduler = new Scheduler();