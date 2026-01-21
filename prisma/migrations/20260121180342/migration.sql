-- This is an empty migration.
ALTER TABLE "todos" RENAME TO "old_todos";
CREATE TABLE IF NOT EXISTS "todos"(
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "guild_id" TEXT,
    "user_id" TEXT NOT NULL,
    "title" TEXT NOT NULL COLLATE NOCASE,
    "description" TEXT COLLATE NOCASE,
    "done" BOOLEAN NOT NULL DEFAULT FALSE,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" DATETIME,
    CONSTRAINT "todos_guild_id_fkey" FOREIGN KEY ("guild_id") REFERENCES "guilds" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "todos_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- 2. Insertar datos desde "old_todos" (asumiendo que existe)
INSERT INTO "todos" ("created_at", "description", "done", "guild_id", "id", "title", "user_id") 
SELECT "created_at", "description", "done", "guild_id", "id", "title", "user_id" FROM "old_todos";

-- 3. Eliminar la tabla antigua
DROP TABLE IF EXISTS "old_todos";