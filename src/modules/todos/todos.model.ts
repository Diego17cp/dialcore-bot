import { Todo as DBTodo } from "generated/prisma/client";

export type ITodo = DBTodo;

export interface CreateTodo {
    title: string;
    description: string;
    guildId: string | null;
    userId: string;
}
export interface UpdateTodo extends Partial<CreateTodo> {}