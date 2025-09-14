import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { seedDatabase } from "./seedData";
import {
  insertEventSchema,
  insertArtistSchema,
  insertStageSchema,
  insertPerformanceSchema,
  insertEventAttendanceSchema,
  insertUserScheduleSchema,
  insertUserConnectionSchema,
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Seed database with sample data (development only)
  if (process.env.NODE_ENV === 'development') {
    try {
      const existingEvents = await storage.getEvents();
      if (existingEvents.length === 0) {
        const seedResult = await seedDatabase();
        console.log("Database seeded:", seedResult);
      }
    } catch (error) {
      console.log("Database seeding skipped (may already contain data):", error);
    }
  }

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Event routes
  app.get("/api/events", async (req, res) => {
    try {
      const { search } = req.query;
      let events;
      
      if (search && typeof search === 'string') {
        events = await storage.searchEvents(search);
      } else {
        events = await storage.getEvents();
      }
      
      res.json(events);
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ message: "Failed to fetch events" });
    }
  });

  app.get("/api/events/:id", async (req, res) => {
    try {
      const event = await storage.getEvent(req.params.id);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      res.json(event);
    } catch (error) {
      console.error("Error fetching event:", error);
      res.status(500).json({ message: "Failed to fetch event" });
    }
  });

  app.post("/api/events", isAuthenticated, async (req, res) => {
    try {
      const eventData = insertEventSchema.parse(req.body);
      const event = await storage.createEvent(eventData);
      res.status(201).json(event);
    } catch (error) {
      console.error("Error creating event:", error);
      res.status(500).json({ message: "Failed to create event" });
    }
  });

  app.put("/api/events/:id", isAuthenticated, async (req, res) => {
    try {
      const eventData = insertEventSchema.partial().parse(req.body);
      const event = await storage.updateEvent(req.params.id, eventData);
      res.json(event);
    } catch (error) {
      console.error("Error updating event:", error);
      res.status(500).json({ message: "Failed to update event" });
    }
  });

  app.delete("/api/events/:id", isAuthenticated, async (req, res) => {
    try {
      await storage.deleteEvent(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting event:", error);
      res.status(500).json({ message: "Failed to delete event" });
    }
  });

  // Event attendance routes
  app.post("/api/events/:eventId/attend", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const eventId = req.params.eventId;
      
      const attendance = await storage.toggleEventAttendance(userId, eventId);
      res.json({ attending: !!attendance });
    } catch (error) {
      console.error("Error toggling attendance:", error);
      res.status(500).json({ message: "Failed to toggle attendance" });
    }
  });

  app.get("/api/events/:eventId/attendees", async (req, res) => {
    try {
      const attendees = await storage.getEventAttendees(req.params.eventId);
      res.json(attendees);
    } catch (error) {
      console.error("Error fetching attendees:", error);
      res.status(500).json({ message: "Failed to fetch attendees" });
    }
  });

  app.get("/api/user/attendances", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const attendances = await storage.getUserEventAttendances(userId);
      res.json(attendances);
    } catch (error) {
      console.error("Error fetching user attendances:", error);
      res.status(500).json({ message: "Failed to fetch user attendances" });
    }
  });

  // Performance routes
  app.get("/api/events/:eventId/performances", async (req, res) => {
    try {
      const performances = await storage.getEventPerformances(req.params.eventId);
      res.json(performances);
    } catch (error) {
      console.error("Error fetching performances:", error);
      res.status(500).json({ message: "Failed to fetch performances" });
    }
  });

  app.post("/api/performances", isAuthenticated, async (req, res) => {
    try {
      const performanceData = insertPerformanceSchema.parse(req.body);
      const performance = await storage.createPerformance(performanceData);
      res.status(201).json(performance);
    } catch (error) {
      console.error("Error creating performance:", error);
      res.status(500).json({ message: "Failed to create performance" });
    }
  });

  // User schedule routes with clash detection
  app.get("/api/user/schedule", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const scheduledPerformances = await storage.getUserSchedulePerformances(userId);
      res.json(scheduledPerformances);
    } catch (error) {
      console.error("Error fetching user schedule:", error);
      res.status(500).json({ message: "Failed to fetch schedule" });
    }
  });

  app.post("/api/user/schedule", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { performanceId } = req.body;
      
      // Check for schedule conflicts before adding
      const conflicts = await checkScheduleConflicts(storage, userId, performanceId);
      if (conflicts.length > 0) {
        return res.status(409).json({ 
          message: "Performance conflicts with existing schedule", 
          conflicts 
        });
      }

      const schedule = await storage.addToUserSchedule(userId, performanceId);
      res.status(201).json(schedule);
    } catch (error) {
      console.error("Error adding to schedule:", error);
      res.status(500).json({ message: "Failed to add to schedule" });
    }
  });

  app.delete("/api/user/schedule/:performanceId", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const performanceId = req.params.performanceId;
      await storage.removeFromUserSchedule(userId, performanceId);
      res.json({ message: "Removed from schedule" });
    } catch (error) {
      console.error("Error removing from schedule:", error);
      res.status(500).json({ message: "Failed to remove from schedule" });
    }
  });

  app.get("/api/user/schedule/conflicts/:performanceId", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const performanceId = req.params.performanceId;
      const conflicts = await checkScheduleConflicts(storage, userId, performanceId);
      res.json({ conflicts });
    } catch (error) {
      console.error("Error checking conflicts:", error);
      res.status(500).json({ message: "Failed to check conflicts" });
    }
  });


  // Artist routes
  app.get("/api/artists", async (req, res) => {
    try {
      const artists = await storage.getArtists();
      res.json(artists);
    } catch (error) {
      console.error("Error fetching artists:", error);
      res.status(500).json({ message: "Failed to fetch artists" });
    }
  });

  app.post("/api/artists", isAuthenticated, async (req, res) => {
    try {
      const artistData = insertArtistSchema.parse(req.body);
      const artist = await storage.createArtist(artistData);
      res.status(201).json(artist);
    } catch (error) {
      console.error("Error creating artist:", error);
      res.status(500).json({ message: "Failed to create artist" });
    }
  });

  // User connection routes
  app.get("/api/user/connections", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const connections = await storage.getUserConnections(userId);
      res.json(connections);
    } catch (error) {
      console.error("Error fetching connections:", error);
      res.status(500).json({ message: "Failed to fetch connections" });
    }
  });

  app.post("/api/user/follow", isAuthenticated, async (req: any, res) => {
    try {
      const followerId = req.user.claims.sub;
      const { followingId } = req.body;
      
      const connection = await storage.followUser(followerId, followingId);
      res.status(201).json(connection);
    } catch (error) {
      console.error("Error following user:", error);
      res.status(500).json({ message: "Failed to follow user" });
    }
  });

  app.delete("/api/user/follow/:followingId", isAuthenticated, async (req: any, res) => {
    try {
      const followerId = req.user.claims.sub;
      const followingId = req.params.followingId;
      
      await storage.unfollowUser(followerId, followingId);
      res.status(204).send();
    } catch (error) {
      console.error("Error unfollowing user:", error);
      res.status(500).json({ message: "Failed to unfollow user" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}

// Helper function to check for schedule conflicts (clash detection)
async function checkScheduleConflicts(storage: any, userId: string, newPerformanceId: string) {
  try {
    // Get the new performance details
    const newPerformance = await storage.getPerformance(newPerformanceId);
    if (!newPerformance) return [];

    // Get user's current schedule
    const userSchedule = await storage.getUserSchedulePerformances(userId);
    
    // Check for time conflicts
    const conflicts = userSchedule.filter((scheduledPerf: any) => {
      const newStart = new Date(newPerformance.startTime);
      const newEnd = new Date(newPerformance.endTime);
      const schedStart = new Date(scheduledPerf.startTime);
      const schedEnd = new Date(scheduledPerf.endTime);
      
      // Check if there's overlap: (StartA < EndB) and (EndA > StartB)
      return (newStart < schedEnd) && (newEnd > schedStart);
    });

    return conflicts.map((conflict: any) => ({
      id: conflict.id,
      artistName: conflict.artist?.name,
      stageName: conflict.stage?.name,
      startTime: conflict.startTime,
      endTime: conflict.endTime,
    }));
  } catch (error) {
    console.error("Error checking schedule conflicts:", error);
    return [];
  }
}
