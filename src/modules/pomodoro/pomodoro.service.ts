import { UserRepository } from "../users";
import { PomodoroRepository } from "./pomodoro.repository";

export class PomodoroService {
    private repo = new PomodoroRepository();
    private userRepo = new UserRepository();

    private ensureUser = async (userId: string) => {
        const user = await this.userRepo.findUser(userId);
        if (!user) throw new Error("User not found");
    }

    async start(userId: string, duration: number) {
        await this.ensureUser(userId);
        const active = await this.repo.findActiveByUserId(userId);
        if (active) throw new Error("An active Pomodoro already exists for this user.");
        return this.repo.create({ userId, duration });
    }
    async interrupt(userId: string) {
        await this.ensureUser(userId);
        const active = await this.repo.findActiveByUserId(userId);
        if (!active) throw new Error("No active Pomodoro found for this user.");
        return this.repo.interrupt(active.id);
    }
    async finish(userId: string) {
        await this.ensureUser(userId);
        const active = await this.repo.findActiveByUserId(userId);
        if (!active) throw new Error("No active Pomodoro found for this user.");
        return this.repo.finish(active.id);
    }
    async getActiveByUser(userId: string) {
        await this.ensureUser(userId);
        return this.repo.findActiveByUserId(userId);
    }
    async getActive() {
        return this.repo.getActives();
    }
    async getExpired(now: Date) {
        return this.repo.findExpired(now);
    }
}