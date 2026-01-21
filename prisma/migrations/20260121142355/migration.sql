-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_guild_configs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "guild_id" TEXT NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'en',
    "learning_enabled" BOOLEAN NOT NULL DEFAULT true,
    "pomodoro_enabled" BOOLEAN NOT NULL DEFAULT true,
    "dev_enabled" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "guild_configs_guild_id_fkey" FOREIGN KEY ("guild_id") REFERENCES "guilds" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_guild_configs" ("guild_id", "id", "language", "learning_enabled", "pomodoro_enabled") SELECT "guild_id", "id", "language", "learning_enabled", "pomodoro_enabled" FROM "guild_configs";
DROP TABLE "guild_configs";
ALTER TABLE "new_guild_configs" RENAME TO "guild_configs";
CREATE UNIQUE INDEX "guild_configs_guild_id_key" ON "guild_configs"("guild_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
