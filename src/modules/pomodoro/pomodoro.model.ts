import { Pomodoro as IPomodoro } from "generated/prisma/client";

export type Pomodoro = IPomodoro;

export interface CreatePomodoro {
    userId: string;
    duration: number;
}