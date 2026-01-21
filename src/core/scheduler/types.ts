export interface SchedulerJob {
    name: string;
    interval: number;
    run: () => Promise<void>;
}