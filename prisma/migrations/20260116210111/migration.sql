/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Guild` table. All the data in the column will be lost.
  - You are about to drop the column `guildId` on the `GuildConfig` table. All the data in the column will be lost.
  - You are about to drop the column `learningEnabled` on the `GuildConfig` table. All the data in the column will be lost.
  - You are about to drop the column `pomodoroEnabled` on the `GuildConfig` table. All the data in the column will be lost.
  - The primary key for the `GuildUser` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `guildId` on the `GuildUser` table. All the data in the column will be lost.
  - You are about to drop the column `joinedAt` on the `GuildUser` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `GuildUser` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `LearningPage` table. All the data in the column will be lost.
  - You are about to drop the column `sectionId` on the `LearningPage` table. All the data in the column will be lost.
  - You are about to drop the column `lastReviewedAt` on the `LearningReview` table. All the data in the column will be lost.
  - You are about to drop the column `nextReviewAt` on the `LearningReview` table. All the data in the column will be lost.
  - You are about to drop the column `pageId` on the `LearningReview` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `LearningReview` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `LearningSection` table. All the data in the column will be lost.
  - You are about to drop the column `topicId` on the `LearningSection` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `LearningTopic` table. All the data in the column will be lost.
  - You are about to drop the column `isGlobal` on the `LearningTopic` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `LearningTopic` table. All the data in the column will be lost.
  - You are about to drop the column `endedAt` on the `Pomodoro` table. All the data in the column will be lost.
  - You are about to drop the column `startedAt` on the `Pomodoro` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Pomodoro` table. All the data in the column will be lost.
  - You are about to drop the column `guildId` on the `Standup` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Standup` table. All the data in the column will be lost.
  - You are about to drop the column `completedAt` on the `Todo` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Todo` table. All the data in the column will be lost.
  - You are about to drop the column `guildId` on the `Todo` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Todo` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `notificationsEnabled` on the `UserSettings` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `UserSettings` table. All the data in the column will be lost.
  - Added the required column `guild_id` to the `GuildConfig` table without a default value. This is not possible if the table is not empty.
  - Added the required column `guild_id` to the `GuildUser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `GuildUser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `section_id` to the `LearningPage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `page_id` to the `LearningReview` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `LearningReview` table without a default value. This is not possible if the table is not empty.
  - Added the required column `topic_id` to the `LearningSection` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Pomodoro` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Standup` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Todo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `UserSettings` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Guild" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Guild" ("id", "name") SELECT "id", "name" FROM "Guild";
DROP TABLE "Guild";
ALTER TABLE "new_Guild" RENAME TO "Guild";
CREATE TABLE "new_GuildConfig" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "guild_id" TEXT NOT NULL,
    "prefix" TEXT NOT NULL DEFAULT '/',
    "language" TEXT NOT NULL DEFAULT 'en',
    "learning_enabled" BOOLEAN NOT NULL DEFAULT true,
    "pomodoro_enabled" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "GuildConfig_guild_id_fkey" FOREIGN KEY ("guild_id") REFERENCES "Guild" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_GuildConfig" ("id", "language", "prefix") SELECT "id", "language", "prefix" FROM "GuildConfig";
DROP TABLE "GuildConfig";
ALTER TABLE "new_GuildConfig" RENAME TO "GuildConfig";
CREATE UNIQUE INDEX "GuildConfig_guild_id_key" ON "GuildConfig"("guild_id");
CREATE TABLE "new_GuildUser" (
    "guild_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "joined_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("guild_id", "user_id"),
    CONSTRAINT "GuildUser_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "GuildUser_guild_id_fkey" FOREIGN KEY ("guild_id") REFERENCES "Guild" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
DROP TABLE "GuildUser";
ALTER TABLE "new_GuildUser" RENAME TO "GuildUser";
CREATE TABLE "new_LearningPage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "section_id" INTEGER NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "emphasis" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "LearningPage_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "LearningSection" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_LearningPage" ("content", "emphasis", "id", "slug", "title") SELECT "content", "emphasis", "id", "slug", "title" FROM "LearningPage";
DROP TABLE "LearningPage";
ALTER TABLE "new_LearningPage" RENAME TO "LearningPage";
CREATE UNIQUE INDEX "LearningPage_section_id_slug_key" ON "LearningPage"("section_id", "slug");
CREATE TABLE "new_LearningReview" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "page_id" INTEGER NOT NULL,
    "user_id" TEXT NOT NULL,
    "last_reviewed_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "next_review_at" DATETIME,
    "confidence" INTEGER,
    CONSTRAINT "LearningReview_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "LearningReview_page_id_fkey" FOREIGN KEY ("page_id") REFERENCES "LearningPage" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_LearningReview" ("confidence", "id") SELECT "confidence", "id" FROM "LearningReview";
DROP TABLE "LearningReview";
ALTER TABLE "new_LearningReview" RENAME TO "LearningReview";
CREATE UNIQUE INDEX "LearningReview_page_id_user_id_key" ON "LearningReview"("page_id", "user_id");
CREATE TABLE "new_LearningSection" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "topic_id" INTEGER NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "LearningSection_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "LearningTopic" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_LearningSection" ("id", "slug", "title") SELECT "id", "slug", "title" FROM "LearningSection";
DROP TABLE "LearningSection";
ALTER TABLE "new_LearningSection" RENAME TO "LearningSection";
CREATE UNIQUE INDEX "LearningSection_topic_id_slug_key" ON "LearningSection"("topic_id", "slug");
CREATE TABLE "new_LearningTopic" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" TEXT,
    "is_global" BOOLEAN NOT NULL DEFAULT false,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "LearningTopic_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_LearningTopic" ("description", "id", "slug", "title") SELECT "description", "id", "slug", "title" FROM "LearningTopic";
DROP TABLE "LearningTopic";
ALTER TABLE "new_LearningTopic" RENAME TO "LearningTopic";
CREATE UNIQUE INDEX "LearningTopic_slug_user_id_key" ON "LearningTopic"("slug", "user_id");
CREATE TABLE "new_Pomodoro" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "started_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ended_at" DATETIME,
    "interrupted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Pomodoro_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Pomodoro" ("duration", "id", "interrupted") SELECT "duration", "id", "interrupted" FROM "Pomodoro";
DROP TABLE "Pomodoro";
ALTER TABLE "new_Pomodoro" RENAME TO "Pomodoro";
CREATE TABLE "new_Standup" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "content" TEXT NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,
    "guild_id" TEXT,
    CONSTRAINT "Standup_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Standup" ("content", "date", "id") SELECT "content", "date", "id" FROM "Standup";
DROP TABLE "Standup";
ALTER TABLE "new_Standup" RENAME TO "Standup";
CREATE TABLE "new_Todo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "guild_id" TEXT,
    "user_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "done" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" DATETIME,
    CONSTRAINT "Todo_guild_id_fkey" FOREIGN KEY ("guild_id") REFERENCES "Guild" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Todo_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Todo" ("description", "done", "id", "title") SELECT "description", "done", "id", "title" FROM "Todo";
DROP TABLE "Todo";
ALTER TABLE "new_Todo" RENAME TO "Todo";
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "avatar" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_User" ("avatar", "id", "username") SELECT "avatar", "id", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE TABLE "new_UserSettings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" TEXT NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'en',
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "notifications_enabled" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "UserSettings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_UserSettings" ("id", "language", "timezone") SELECT "id", "language", "timezone" FROM "UserSettings";
DROP TABLE "UserSettings";
ALTER TABLE "new_UserSettings" RENAME TO "UserSettings";
CREATE UNIQUE INDEX "UserSettings_user_id_key" ON "UserSettings"("user_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
