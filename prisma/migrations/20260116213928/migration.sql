/*
  Warnings:

  - You are about to drop the column `is_global` on the `learning_topics` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_learning_topics" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" TEXT,
    "guild_id" TEXT,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "learning_topics_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "learning_topics_guild_id_fkey" FOREIGN KEY ("guild_id") REFERENCES "guilds" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_learning_topics" ("created_at", "description", "id", "slug", "title", "user_id") SELECT "created_at", "description", "id", "slug", "title", "user_id" FROM "learning_topics";
DROP TABLE "learning_topics";
ALTER TABLE "new_learning_topics" RENAME TO "learning_topics";
CREATE UNIQUE INDEX "learning_topics_slug_user_id_guild_id_key" ON "learning_topics"("slug", "user_id", "guild_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
