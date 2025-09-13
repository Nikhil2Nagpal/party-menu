import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const dishes = pgTable("dishes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  image: text("image"),
  mealType: text("meal_type").notNull(), // STARTER, MAIN COURSE, DESSERT, SIDES
  type: text("type").notNull(), // VEG, NON-VEG
  dishType: text("dish_type"),
  categoryId: integer("category_id"),
  forParty: text("for_party").default("true"),
  ingredients: jsonb("ingredients").$type<Array<{ name: string; quantity: string }>>(),
});

export const insertDishSchema = createInsertSchema(dishes).omit({
  id: true,
});

export type InsertDish = z.infer<typeof insertDishSchema>;
export type Dish = typeof dishes.$inferSelect;

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
