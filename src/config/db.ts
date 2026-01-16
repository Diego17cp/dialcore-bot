import { PrismaClient } from "../../generated/prisma/client";
import { env } from "./env";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({
    url: env.DATABASE_URL
});
export class DatabaseConnection {
    private static instance: DatabaseConnection;
    private prisma: PrismaClient;
    private isConnected: boolean = false;

    private constructor(){
        this.prisma = new PrismaClient({
            log: ["error", "warn", "info"],
            adapter
        });
    }

    public static getInstance(): DatabaseConnection {
        if (!DatabaseConnection.instance) DatabaseConnection.instance = new DatabaseConnection();
        return DatabaseConnection.instance;
    }
    public async connect(): Promise<void> {
        if (this.isConnected) return;
        try {
            await this.prisma.$connect();
            this.isConnected = true;
            console.log("Database connected successfully.");
        } catch (error) {
            console.error("Database connection error:", error);
            throw error;
        }
    }
    public async disconnect(): Promise<void> {
        if (!this.isConnected) return;
        try {
            await this.prisma.$disconnect();
            this.isConnected = false;
            console.log("Database disconnected successfully.");
        } catch (error) {
            console.error("Database disconnection error:", error);
            throw error;
        }
    }
    public getClient(): PrismaClient {
        return this.prisma;
    }
    public getStatus() {
        return {
            isConnected: this.isConnected,
            provider: "sqlite"
        };
    }
}