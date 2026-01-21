import { DatabaseConnection } from "@/config";
import { CreateTodo, UpdateTodo } from "./todos.model";

export class TodoRepository {
    private db = DatabaseConnection.getInstance().getClient();
    async create(data: CreateTodo) {
        return this.db.todo.create({ data });
    }
    async findById(id: number) {
        return this.db.todo.findUnique({ where: { id } });
    }
    async findByUserId(userId: string) {
        return this.db.todo.findMany({ where: { userId } });
    }
    async findBySearchTerm(userId: string, searchTerm: string) {
        return this.db.todo.findMany({
            where: {
                userId,
                OR: [
                    { title: { contains: searchTerm } },
                    { description: { contains: searchTerm } },
                ],
            },
        });
    }
    async findByGuildId(guildId: string) {
        return this.db.todo.findMany({ where: { guildId } });
    }
    async update(id: number, data: UpdateTodo) {
        return this.db.todo.update({ where: { id }, data });
    }
    async delete(id: number) {
        return this.db.todo.delete({ where: { id } });
    }
    async complete(id: number) {
        return this.db.todo.update({ where: { id }, data: { done: true } });
    }
}