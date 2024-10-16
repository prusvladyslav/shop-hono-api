import { int, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";


export const usersTable = sqliteTable("users_table", {
  id: int("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
});



export const selectUsersSchema = createSelectSchema(usersTable);

export const insertUsersSchema = createInsertSchema(
  usersTable,
  {
    name: schema => schema.name.min(1).max(500),
    email: schema => schema.email.min(1).max(500),
    password: schema => schema.password.min(1).max(500),
  },
).required({
  name: true,
  email: true,
  password: true
}).omit({
  id: true,
});


export const todosSchema = sqliteTable("todos", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  completed: integer("completed",{mode: "boolean"}).notNull(),
  userId: integer("userId").notNull(),
});

export const selectTodosSchema = createSelectSchema(todosSchema);

export const insertTodosSchema = createInsertSchema(
  todosSchema,
  {
    title: schema => schema.title.min(1).max(500),
    description: schema => schema.description.min(1).max(500),
    completed: schema => schema.completed,
    userId: schema => schema.userId.min(1).max(500),
  },
).omit({id: true})
