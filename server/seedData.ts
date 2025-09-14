import { db } from "./db";
import { events, artists, stages, performances } from "@shared/schema";

export async function seedDatabase() {
  console.log("Seeding database with sample festival data...");

  try {
    // Create sample artists
    const artistsData = [
      { name: "Deadmau5", bio: "Electronic music producer and DJ known for progressive house and electro house", imageUrl: null, socialLinks: { twitter: "@deadmau5", instagram: "@deadmau5" } },
      { name: "Disclosure", bio: "English electronic music duo consisting of brothers Howard and Guy Lawrence", imageUrl: null, socialLinks: { twitter: "@disclosure", instagram: "@disclosure" } },
      { name: "ODESZA", bio: "American electronic music duo from Seattle, known for melodic dubstep and future bass", imageUrl: null, socialLinks: { twitter: "@odesza", instagram: "@odesza" } },
      { name: "Flume", bio: "Australian record producer, musician and DJ known for electronic and ambient music", imageUrl: null, socialLinks: { twitter: "@flumemusic", instagram: "@flumemusic" } },
      { name: "Porter Robinson", bio: "American DJ and music producer specializing in electronic dance music", imageUrl: null, socialLinks: { twitter: "@porterrobinson", instagram: "@porterrobinson" } },
      { name: "Madeon", bio: "French musician, DJ, songwriter and record producer", imageUrl: null, socialLinks: { twitter: "@madeon", instagram: "@madeon" } }
    ];

    const insertedArtists = await db.insert(artists).values(artistsData).returning();
    console.log(`Created ${insertedArtists.length} artists`);

    // Create sample events
    const eventsData = [
      {
        name: "Electric Dreams Festival",
        description: "A three-day celebration of electronic music culture, bringing together world-renowned DJs, cutting-edge visual artists, and music lovers from around the globe.",
        location: "Golden Gate Park, San Francisco",
        startDate: new Date("2024-08-15T16:00:00Z"),
        endDate: new Date("2024-08-17T23:00:00Z"),
        imageUrl: "/assets/generated_images/festival_main_stage_sunset_d833fa8d.png",
        status: "published" as const
      },
      {
        name: "Neon Nights Music Festival",
        description: "Experience the future of electronic music with immersive light shows and cutting-edge sound technology across multiple stages.",
        location: "Central Park, New York",
        startDate: new Date("2024-09-20T17:00:00Z"),
        endDate: new Date("2024-09-22T23:00:00Z"),
        imageUrl: "/assets/generated_images/festival_grounds_overview_0ed3bb27.png",
        status: "published" as const
      },
      {
        name: "Digital Euphoria",
        description: "A mind-bending journey through electronic soundscapes with the world's most innovative artists and cutting-edge stage production.",
        location: "Millennium Park, Chicago",
        startDate: new Date("2024-10-10T18:00:00Z"),
        endDate: new Date("2024-10-12T23:00:00Z"),
        imageUrl: "/assets/generated_images/DJ_performance_stage_cab17f4a.png",
        status: "published" as const
      }
    ];

    const insertedEvents = await db.insert(events).values(eventsData).returning();
    console.log(`Created ${insertedEvents.length} events`);

    // Create stages for each event
    const stagesData = [];
    for (const event of insertedEvents) {
      stagesData.push(
        { eventId: event.id, name: "Main Stage", description: "The primary performance area with the biggest acts", capacity: 15000 },
        { eventId: event.id, name: "Electronic Stage", description: "Dedicated electronic and techno music venue", capacity: 8000 },
        { eventId: event.id, name: "Discovery Stage", description: "Showcase for emerging and underground artists", capacity: 3000 }
      );
    }

    const insertedStages = await db.insert(stages).values(stagesData).returning();
    console.log(`Created ${insertedStages.length} stages`);

    // Create performances - assign artists to stages with scheduled times
    const performancesData = [];
    
    // For each event, create performances
    for (let eventIndex = 0; eventIndex < insertedEvents.length; eventIndex++) {
      const event = insertedEvents[eventIndex];
      const eventStages = insertedStages.filter(stage => stage.eventId === event.id);
      
      // Day 1 performances
      const day1 = new Date(event.startDate);
      performancesData.push(
        { eventId: event.id, artistId: insertedArtists[0].id, stageId: eventStages[0].id, startTime: new Date(day1.getTime() + 3 * 60 * 60 * 1000), endTime: new Date(day1.getTime() + 4.5 * 60 * 60 * 1000), isHeadliner: true },
        { eventId: event.id, artistId: insertedArtists[1].id, stageId: eventStages[1].id, startTime: new Date(day1.getTime() + 2 * 60 * 60 * 1000), endTime: new Date(day1.getTime() + 3.5 * 60 * 60 * 1000), isHeadliner: false },
        { eventId: event.id, artistId: insertedArtists[2].id, stageId: eventStages[2].id, startTime: new Date(day1.getTime() + 1 * 60 * 60 * 1000), endTime: new Date(day1.getTime() + 2 * 60 * 60 * 1000), isHeadliner: false }
      );

      // Day 2 performances
      const day2 = new Date(day1.getTime() + 24 * 60 * 60 * 1000);
      performancesData.push(
        { eventId: event.id, artistId: insertedArtists[3].id, stageId: eventStages[0].id, startTime: new Date(day2.getTime() + 3 * 60 * 60 * 1000), endTime: new Date(day2.getTime() + 4.5 * 60 * 60 * 1000), isHeadliner: true },
        { eventId: event.id, artistId: insertedArtists[4].id, stageId: eventStages[1].id, startTime: new Date(day2.getTime() + 2 * 60 * 60 * 1000), endTime: new Date(day2.getTime() + 3.5 * 60 * 60 * 1000), isHeadliner: false },
        { eventId: event.id, artistId: insertedArtists[5].id, stageId: eventStages[2].id, startTime: new Date(day2.getTime() + 1 * 60 * 60 * 1000), endTime: new Date(day2.getTime() + 2 * 60 * 60 * 1000), isHeadliner: false }
      );
    }

    const insertedPerformances = await db.insert(performances).values(performancesData).returning();
    console.log(`Created ${insertedPerformances.length} performances`);

    console.log("Database seeding completed successfully!");
    
    return {
      artists: insertedArtists.length,
      events: insertedEvents.length,
      stages: insertedStages.length,
      performances: insertedPerformances.length
    };
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}