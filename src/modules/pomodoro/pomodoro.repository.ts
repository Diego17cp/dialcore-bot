import { DatabaseConnection } from "@/config";
import { CreatePomodoro } from "./pomodoro.model";

export class PomodoroRepository {
    private db = DatabaseConnection.getInstance().getClient();
    async create(data: CreatePomodoro) {
        return this.db.pomodoro.create({
            data,
        });
    }
    async getActives(){
        return this.db.pomodoro.findMany({
            where: {
                interrupted: false,
                endedAt: null,
            },
        });
    }
    async findActiveByUserId(userId: string) {
        return this.db.pomodoro.findFirst({
            where: {
                userId,
                interrupted: false,
                endedAt: null,
            },
        });
    }
    async findExpired(now: Date) {
        return this.db.pomodoro.findMany({
            where: {
                endedAt: null,
                interrupted: false,
                startedAt: {
                    lt: new Date(now.getTime() - 1000), 
                },
            },
        });
    }
    async finish(id: number) {
        return this.db.pomodoro.update({
            where: { id },
            data: { endedAt: new Date() },
        });
    }
    async interrupt(id: number) {
        return this.db.pomodoro.update({
            where: { id },
            data: { interrupted: true, endedAt: new Date() },
        });
    }
}