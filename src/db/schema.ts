import { date, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const visitors = pgTable("visitors", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  meetingPlace: text("meeting_place").notNull(),
  meetingDate: timestamp("meeting_date").notNull().defaultNow(),
  serialNumber: text("serial_number").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Visitor = typeof visitors.$inferSelect;
export type NewVisitor = typeof visitors.$inferInsert;

export const defaultPlaces = pgTable("default_places", {
  id: uuid("id").defaultRandom().primaryKey(),
  eventDate: date("event_date").notNull().unique(),
  place: text("place").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type DefaultPlace = typeof defaultPlaces.$inferSelect;
export type NewDefaultPlace = typeof defaultPlaces.$inferInsert;
