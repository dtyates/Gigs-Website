import {
  users,
  events,
  artists,
  stages,
  performances,
  eventAttendances,
  userSchedules,
  userConnections,
  type User,
  type UpsertUser,
  type Event,
  type InsertEvent,
  type Artist,
  type InsertArtist,
  type Stage,
  type InsertStage,
  type Performance,
  type InsertPerformance,
  type EventAttendance,
  type InsertEventAttendance,
  type UserSchedule,
  type InsertUserSchedule,
  type UserConnection,
  type InsertUserConnection,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, asc, like, or, ne, ilike } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Event operations
  getEvents(): Promise<Event[]>;
  getEvent(id: string): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: string, event: Partial<InsertEvent>): Promise<Event>;
  deleteEvent(id: string): Promise<void>;
  searchEvents(query: string): Promise<Event[]>;
  getAllEvents(): Promise<Event[]>;

  // Artist operations
  getArtists(): Promise<Artist[]>;
  getArtist(id: string): Promise<Artist | undefined>;
  createArtist(artist: InsertArtist): Promise<Artist>;

  // Stage operations
  getEventStages(eventId: string): Promise<Stage[]>;
  createStage(stage: InsertStage): Promise<Stage>;

  // Performance operations
  getEventPerformances(eventId: string): Promise<Performance[]>;
  getPerformance(id: string): Promise<Performance | undefined>;
  createPerformance(performance: InsertPerformance): Promise<Performance>;
  getUserSchedulePerformances(userId: string): Promise<Performance[]>;

  // Event attendance operations
  getUserEventAttendance(userId: string, eventId: string): Promise<EventAttendance | undefined>;
  getUserEventAttendances(userId: string): Promise<EventAttendance[]>;
  toggleEventAttendance(userId: string, eventId: string): Promise<EventAttendance | null>;
  getEventAttendees(eventId: string): Promise<User[]>;

  // User schedule operations
  getUserSchedule(userId: string): Promise<UserSchedule[]>;
  addToUserSchedule(userId: string, performanceId: string): Promise<UserSchedule>;
  removeFromUserSchedule(userId: string, performanceId: string): Promise<void>;

  // User connection operations
  getUserConnections(userId: string): Promise<User[]>;
  followUser(followerId: string, followingId: string): Promise<UserConnection>;
  unfollowUser(followerId: string, followingId: string): Promise<void>;

  // Admin operations
  getAdminAnalytics(): Promise<{
    totalEvents: number;
    publishedEvents: number;
    totalUsers: number;
    totalAttendees: number;
    recentEvents: Event[];
    recentUsers: User[];
  }>;
  getAllUsersWithStats(): Promise<Array<User & { eventsAttended: number }>>;
  updateUserStatus(userId: string, isActive: boolean): Promise<User>;
}

export class DatabaseStorage implements IStorage {
  // User operations (mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Event operations
  async getEvents(): Promise<Event[]> {
    return await db.select().from(events).where(eq(events.status, "published")).orderBy(desc(events.startDate));
  }

  async getEvent(id: string): Promise<Event | undefined> {
    const [event] = await db.select().from(events).where(eq(events.id, id));
    return event;
  }

  async createEvent(eventData: InsertEvent): Promise<Event> {
    const [event] = await db.insert(events).values(eventData).returning();
    return event;
  }

  async updateEvent(id: string, eventData: Partial<InsertEvent>): Promise<Event> {
    const [event] = await db
      .update(events)
      .set({ ...eventData, updatedAt: new Date() })
      .where(eq(events.id, id))
      .returning();
    return event;
  }

  async deleteEvent(id: string): Promise<void> {
    await db.delete(events).where(eq(events.id, id));
  }

  async searchEvents(query: string): Promise<Event[]> {
    return await db
      .select()
      .from(events)
      .where(
        and(
          eq(events.status, "published"),
          or(
            like(events.name, `%${query}%`),
            like(events.location, `%${query}%`),
            like(events.description, `%${query}%`)
          )
        )
      )
      .orderBy(desc(events.startDate));
  }

  async getAllEvents(): Promise<Event[]> {
    return await db.select().from(events).orderBy(desc(events.startDate));
  }

  // Artist operations
  async getArtists(): Promise<Artist[]> {
    return await db.select().from(artists).orderBy(asc(artists.name));
  }

  async getArtist(id: string): Promise<Artist | undefined> {
    const [artist] = await db.select().from(artists).where(eq(artists.id, id));
    return artist;
  }

  async createArtist(artistData: InsertArtist): Promise<Artist> {
    const [artist] = await db.insert(artists).values(artistData).returning();
    return artist;
  }

  // Stage operations
  async getEventStages(eventId: string): Promise<Stage[]> {
    return await db.select().from(stages).where(eq(stages.eventId, eventId));
  }

  async createStage(stageData: InsertStage): Promise<Stage> {
    const [stage] = await db.insert(stages).values(stageData).returning();
    return stage;
  }

  // Performance operations
  async getEventPerformances(eventId: string): Promise<Performance[]> {
    const performancesWithRelations = await db
      .select({
        performance: performances,
        artist: artists,
        stage: stages,
      })
      .from(performances)
      .leftJoin(artists, eq(performances.artistId, artists.id))
      .leftJoin(stages, eq(performances.stageId, stages.id))
      .where(eq(performances.eventId, eventId))
      .orderBy(asc(performances.startTime));

    return performancesWithRelations.map(row => ({
      ...row.performance,
      artist: row.artist,
      stage: row.stage,
    }));
  }

  async getPerformance(id: string): Promise<Performance | undefined> {
    const [performance] = await db.select().from(performances).where(eq(performances.id, id));
    return performance;
  }

  async createPerformance(performanceData: InsertPerformance): Promise<Performance> {
    const [performance] = await db.insert(performances).values(performanceData).returning();
    return performance;
  }

  async getUserSchedulePerformances(userId: string): Promise<Performance[]> {
    const userPerformances = await db
      .select({
        performance: performances,
        artist: artists,
        stage: stages,
        event: events,
      })
      .from(userSchedules)
      .innerJoin(performances, eq(userSchedules.performanceId, performances.id))
      .leftJoin(artists, eq(performances.artistId, artists.id))
      .leftJoin(stages, eq(performances.stageId, stages.id))
      .leftJoin(events, eq(performances.eventId, events.id))
      .where(eq(userSchedules.userId, userId))
      .orderBy(asc(performances.startTime));
    
    return userPerformances.map(row => ({
      ...row.performance,
      artist: row.artist,
      stage: row.stage,
      event: row.event,
    }));
  }

  // Event attendance operations
  async getUserEventAttendance(userId: string, eventId: string): Promise<EventAttendance | undefined> {
    const [attendance] = await db
      .select()
      .from(eventAttendances)
      .where(and(eq(eventAttendances.userId, userId), eq(eventAttendances.eventId, eventId)));
    return attendance;
  }

  async getUserEventAttendances(userId: string): Promise<EventAttendance[]> {
    return await db
      .select()
      .from(eventAttendances)
      .where(eq(eventAttendances.userId, userId));
  }

  async toggleEventAttendance(userId: string, eventId: string): Promise<EventAttendance | null> {
    const existing = await this.getUserEventAttendance(userId, eventId);
    
    if (existing) {
      await db
        .delete(eventAttendances)
        .where(and(eq(eventAttendances.userId, userId), eq(eventAttendances.eventId, eventId)));
      return null;
    } else {
      const [attendance] = await db
        .insert(eventAttendances)
        .values({ userId, eventId })
        .returning();
      return attendance;
    }
  }

  async getEventAttendees(eventId: string): Promise<User[]> {
    const attendees = await db
      .select({ user: users })
      .from(eventAttendances)
      .innerJoin(users, eq(eventAttendances.userId, users.id))
      .where(eq(eventAttendances.eventId, eventId));
    
    return attendees.map(row => row.user);
  }

  // User schedule operations
  async getUserSchedule(userId: string): Promise<UserSchedule[]> {
    return await db
      .select()
      .from(userSchedules)
      .where(eq(userSchedules.userId, userId));
  }

  async addToUserSchedule(userId: string, performanceId: string): Promise<UserSchedule> {
    const [schedule] = await db
      .insert(userSchedules)
      .values({ userId, performanceId })
      .returning();
    return schedule;
  }

  async removeFromUserSchedule(userId: string, performanceId: string): Promise<void> {
    await db
      .delete(userSchedules)
      .where(and(eq(userSchedules.userId, userId), eq(userSchedules.performanceId, performanceId)));
  }

  // User connection operations
  async getUserConnections(userId: string): Promise<User[]> {
    const connections = await db
      .select({ user: users })
      .from(userConnections)
      .innerJoin(users, eq(userConnections.followingId, users.id))
      .where(eq(userConnections.followerId, userId));
    
    return connections.map(row => row.user);
  }

  async discoverUsers(currentUserId: string, search?: string): Promise<User[]> {
    let query = db
      .select()
      .from(users)
      .where(ne(users.id, currentUserId))
      .limit(20);

    if (search && search.trim()) {
      query = query.where(
        or(
          ilike(users.firstName, `%${search}%`),
          ilike(users.lastName, `%${search}%`),
          ilike(users.email, `%${search}%`)
        )
      );
    }

    return await query;
  }

  async getEventAttendeesWithSocialContext(eventId: string, currentUserId: string) {
    // Get all attendees
    const attendees = await db
      .select({ user: users })
      .from(eventAttendances)
      .innerJoin(users, eq(eventAttendances.userId, users.id))
      .where(eq(eventAttendances.eventId, eventId));

    // Get current user's connections
    const connections = await this.getUserConnections(currentUserId);
    const connectionIds = new Set(connections.map(c => c.id));

    // Separate friends and others
    const friendsAttending = attendees
      .filter(row => connectionIds.has(row.user.id))
      .map(row => ({
        ...row.user,
        isFriend: true,
      }));

    const otherAttendees = attendees
      .filter(row => !connectionIds.has(row.user.id) && row.user.id !== currentUserId)
      .map(row => ({
        ...row.user,
        isFriend: false,
      }));

    return {
      totalAttendees: attendees.length,
      friendsAttending,
      otherAttendees,
    };
  }

  async followUser(followerId: string, followingId: string): Promise<UserConnection> {
    const [connection] = await db
      .insert(userConnections)
      .values({ followerId, followingId })
      .returning();
    return connection;
  }

  async unfollowUser(followerId: string, followingId: string): Promise<void> {
    await db
      .delete(userConnections)
      .where(and(eq(userConnections.followerId, followerId), eq(userConnections.followingId, followingId)));
  }

  // Admin operations
  async getAdminAnalytics() {
    const [totalEventsResult] = await db.select({ count: sql<number>`cast(count(*) as int)` }).from(events);
    const [publishedEventsResult] = await db.select({ count: sql<number>`cast(count(*) as int)` }).from(events).where(eq(events.status, "published"));
    const [totalUsersResult] = await db.select({ count: sql<number>`cast(count(*) as int)` }).from(users);
    const [totalAttendeesResult] = await db.select({ count: sql<number>`cast(count(*) as int)` }).from(eventAttendances);

    const recentEvents = await db.select().from(events).orderBy(desc(events.createdAt)).limit(5);
    const recentUsers = await db.select().from(users).orderBy(desc(users.createdAt)).limit(5);

    return {
      totalEvents: totalEventsResult.count || 0,
      publishedEvents: publishedEventsResult.count || 0,
      totalUsers: totalUsersResult.count || 0,
      totalAttendees: totalAttendeesResult.count || 0,
      recentEvents,
      recentUsers,
    };
  }

  async getAllUsersWithStats(): Promise<Array<User & { eventsAttended: number }>> {
    const usersWithStats = await db
      .select({
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        profileImageUrl: users.profileImageUrl,
        isAdmin: users.isAdmin,
        isActive: users.isActive,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
        eventsAttended: sql<number>`cast(count(${eventAttendances.id}) as int)`,
      })
      .from(users)
      .leftJoin(eventAttendances, eq(users.id, eventAttendances.userId))
      .groupBy(users.id)
      .orderBy(desc(users.createdAt));

    return usersWithStats;
  }

  async updateUserStatus(userId: string, isActive: boolean): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ isActive, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }
}

export const storage = new DatabaseStorage();
