import { client, scheduler } from "@/core";
import { PomodoroService } from "./pomodoro.service";
import { pomodoroEmbeds } from "@/ui";

const pomodoroService = new PomodoroService();

scheduler.register({
    name: "pomodoro-check",
    interval: 30_000, // 30 seconds
    run: async () => {
        const now = new Date();
        const activePomodoros = await pomodoroService.getActive();
        for (const p of activePomodoros) {
            const endTime = new Date(p.startedAt.getTime() + p.duration * 60_000);
            if (now >= endTime) {
                await pomodoroService.finish(p.userId);
                const user = await client.users.fetch(p.userId);
                await user.send({
                    embeds: [pomodoroEmbeds.pomodoroEnded(endTime)],
                })
            }
        }
    }
})