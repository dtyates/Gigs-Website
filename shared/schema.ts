import { sql } from "drizzle-orm";
import { 
  pgTable, 
  text, 
  varchar, 
  timestamp, 
  integer, 
  boolean, 
  jsonb,
  index
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Events table
export const events = pgTable("events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  location: varchar("location", { length: 255 }).notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  imageUrl: varchar("image_url"),
  status: varchar("status", { enum: ["draft", "published", "archived"] }).default("draft"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Artists table
export const artists = pgTable("artists", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }).notNull(),
  bio: text("bio"),
  imageUrl: varchar("image_url"),
  socialLinks: jsonb("social_links"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Stages table
export const stages = pgTable("stages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  eventId: varchar("event_id").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  capacity: integer("capacity"),
});

// Artist performances at events
export const performances = pgTable("performances", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  eventId: varchar("event_id").notNull(),
  artistId: varchar("artist_id").notNull(),
  stageId: varchar("stage_id").notNull(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  isHeadliner: boolean("is_headliner").default(false),
});

// User event attendance
export const eventAttendances = pgTable("event_attendances", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  eventId: varchar("event_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// User personal schedules (selected artists)
export const userSchedules = pgTable("user_schedules", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  performanceId: varchar("performance_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// User connections (friendships)
export const userConnections = pgTable("user_connections", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  followerId: varchar("follower_id").notNull(),
  followingId: varchar("following_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  eventAttendances: many(eventAttendances),
  userSchedules: many(userSchedules),
  followers: many(userConnections, { relationName: "followers" }),
  following: many(userConnections, { relationName: "following" }),
}));

export const eventsRelations = relations(events, ({ many }) => ({
  stages: many(stages),
  performances: many(performances),
  attendances: many(eventAttendances),
}));

export const artistsRelations = relations(artists, ({ many }) => ({
  performances: many(performances),
}));

export const stagesRelations = relations(stages, ({ one, many }) => ({
  event: one(events, { fields: [stages.eventId], references: [events.id] }),
  performances: many(performances),
}));

export const performancesRelations = relations(performances, ({ one, many }) => ({
  event: one(events, { fields: [performances.eventId], references: [events.id] }),
  artist: one(artists, { fields: [performances.artistId], references: [artists.id] }),
  stage: one(stages, { fields: [performances.stageId], references: [stages.id] }),
  userSchedules: many(userSchedules),
}));

export const eventAttendancesRelations = relations(eventAttendances, ({ one }) => ({
  user: one(users, { fields: [eventAttendances.userId], references: [users.id] }),
  event: one(events, { fields: [eventAttendances.eventId], references: [events.id] }),
}));

export const userSchedulesRelations = relations(userSchedules, ({ one }) => ({
  user: one(users, { fields: [userSchedules.userId], references: [users.id] }),
  performance: one(performances, { fields: [userSchedules.performanceId], references: [performances.id] }),
}));

export const userConnectionsRelations = relations(userConnections, ({ one }) => ({
  follower: one(users, { fields: [userConnections.followerId], references: [users.id], relationName: "followers" }),
  following: one(users, { fields: [userConnections.followingId], references: [users.id], relationName: "following" }),
}));

// Zod schemas
export const upsertUserSchema = createInsertSchema(users);
export const insertEventSchema = createInsertSchema(events).omit({ id: true, createdAt: true, updatedAt: true });
export const insertArtistSchema = createInsertSchema(artists).omit({ id: true, createdAt: true });
export const insertStageSchema = createInsertSchema(stages).omit({ id: true });
export const insertPerformanceSchema = createInsertSchema(performances).omit({ id: true });
export const insertEventAttendanceSchema = createInsertSchema(eventAttendances).omit({ id: true, createdAt: true });
export const insertUserScheduleSchema = createInsertSchema(userSchedules).omit({ id: true, createdAt: true });
export const insertUserConnectionSchema = createInsertSchema(userConnections).omit({ id: true, createdAt: true });

// Types
export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type User = typeof users.$inferSelect;
export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Artist = typeof artists.$inferSelect;
export type InsertArtist = z.infer<typeof insertArtistSchema>;
export type Stage = typeof stages.$inferSelect;
export type InsertStage = z.infer<typeof insertStageSchema>;
export type Performance = typeof performances.$inferSelect;
export type InsertPerformance = z.infer<typeof insertPerformanceSchema>;
export type EventAttendance = typeof eventAttendances.$inferSelect;
export type InsertEventAttendance = z.infer<typeof insertEventAttendanceSchema>;
export type UserSchedule = typeof userSchedules.$inferSelect;
export type InsertUserSchedule = z.infer<typeof insertUserScheduleSchema>;
export type UserConnection = typeof userConnections.$inferSelect;
export type InsertUserConnection = z.infer<typeof insertUserConnectionSchema>;
