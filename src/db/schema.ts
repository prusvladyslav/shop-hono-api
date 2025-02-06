import { relations } from "drizzle-orm";
import { int, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const categories = sqliteTable("categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  parentId: integer("parentId"),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const selectCategoriesSchema = createSelectSchema(categories);

export const insertCategoriesSchema = createInsertSchema(categories, {
  name: (schema) => schema.name.min(1).max(500),
})
  .required({ name: true })
  .omit({ id: true });

export const products = sqliteTable("products", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  categoryId: integer("categoryId")
    .notNull()
    .references(() => categories.id),
  price: integer("price").notNull(),
  previousPrice: integer("previousPrice"),
  description: text("description"),
});

export const productsRelations = relations(products, ({ many }) => ({
  images: many(productsImages),
}));

export const selectProductsSchema = createSelectSchema(products);

export const insertProductsSchema = createInsertSchema(products, {
  name: (schema) => schema.name.min(1).max(500),
  categoryId: (schema) => schema.categoryId.min(1).max(500),
  price: (schema) => schema.price.min(1).max(500),
})
  .required({ name: true, categoryId: true, price: true })
  .omit({ id: true });

export const productsImages = sqliteTable("products_images", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  productId: integer("productId")
    .notNull()
    .references(() => products.id),
  imageUrl: text("imageUrl").notNull(),
});

export const productImages = relations(productsImages, ({ one }) => ({
  product: one(products, {
    fields: [productsImages.productId],
    references: [products.id],
  }),
}));

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  firstName: text("firstName").notNull(),
  lastName: text("lastName").notNull(),
  email: text("email").notNull(),
});
