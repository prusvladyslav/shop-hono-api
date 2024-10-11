import { int, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";


export const usersTable = sqliteTable("users_table", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  email: text().notNull().unique(),
});


export const selectUsersSchema = createSelectSchema(usersTable);

export const insertUsersSchema = createInsertSchema(
  usersTable,
  {
    name: schema => schema.name.min(1).max(500),
  },
).required({
  name: true,
  email: true
}).omit({
  id: true,
});

export const patchUsersSchema = insertUsersSchema.partial();
