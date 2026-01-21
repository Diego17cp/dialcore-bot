import { UserRepository } from "../users";
import { CreateTodo, UpdateTodo } from "./todos.model";
import { TodoRepository } from "./todos.repository";

export class TodoService {
    private repo: TodoRepository = new TodoRepository();
    private userRepo: UserRepository = new UserRepository();
    async createTodo(data: CreateTodo) {
        if (!(await this.userRepo.findUser(data.userId))) throw new Error("User not found.");
        const exists = await this.repo.findByUserId(data.userId);
        if (exists.some(todo => todo.title === data.title)) throw new Error("Todo with this title already exists for the user.");
        return this.repo.create(data);
    }
    async updateTodo(id: number, data: UpdateTodo) {
        const exists = await this.repo.findById(id);
        if (!exists) throw new Error("Todo not found.");
        return this.repo.update(id, data);
    }
    async deleteTodo(id: number) {
        const exists = await this.repo.findById(id);
        if (!exists) throw new Error("Todo not found.");
        return this.repo.delete(id);
    }
    async getTodoById(id: number) {
        return this.repo.findById(id);
    }
    async getTodosByUser(userId: string, searchTerm?: string) {
        if (searchTerm) return this.repo.findBySearchTerm(userId, searchTerm);
        return this.repo.findByUserId(userId);
    }
    async completeTodo(id: number) {
        const exists = await this.repo.findById(id);
        if (!exists) throw new Error("Todo not found.");
        return this.repo.complete(id);
    }
}