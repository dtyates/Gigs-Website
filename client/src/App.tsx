import { useState } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

// Import Components
import { Navigation } from "@/components/Navigation";
import { LoginForm } from "@/components/LoginForm";
import { EventList } from "@/components/EventList";
import { EventDetail } from "@/components/EventDetail";
import { PersonalTimetable } from "@/components/PersonalTimetable";
import { SocialAttendance } from "@/components/SocialAttendance";
import { AdminDashboard } from "@/components/AdminDashboard";

// Import images
import festivalImage1 from '@assets/generated_images/festival_main_stage_sunset_d833fa8d.png';
import festivalImage2 from '@assets/generated_images/festival_grounds_overview_0ed3bb27.png';
import festivalImage3 from '@assets/generated_images/DJ_performance_stage_cab17f4a.png';

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function Home() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState<"events" | "schedule" | "profile" | "admin">("events");
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [userSchedule, setUserSchedule] = useState<any[]>([]);

  // todo: remove mock functionality - Mock data
  const mockEvents = [
    {
      id: "1",
      name: "Electric Dreams Festival",
      date: "Aug 15-17, 2024",
      location: "Golden Gate Park, SF",
      image: festivalImage1,
      description: "Three days of electronic music featuring world-class DJs and immersive visual experiences under the stars.",
      attendeeCount: 12450,
      isAttending: false,
      artistCount: 85,
      tags: ["Electronic", "EDM", "Techno"]
    },
    {
      id: "2", 
      name: "Sunset Grooves",
      date: "Sep 22-24, 2024",
      location: "Venice Beach, LA",
      image: festivalImage2,
      description: "Beachside festival celebrating house music and sunset vibes with local and international artists.",
      attendeeCount: 8200,
      isAttending: true,
      artistCount: 45,
      tags: ["House", "Electronic", "Beach"]
    },
    {
      id: "3",
      name: "Bass Underground",
      date: "Oct 5-6, 2024", 
      location: "Warehouse District, NYC",
      image: festivalImage3,
      description: "Underground bass music experience in intimate venue settings with cutting-edge sound systems.",
      attendeeCount: 3500,
      isAttending: false,
      artistCount: 25,
      tags: ["Bass", "Dubstep", "Underground"]
    }
  ];

  const mockScheduleItems = [
    {
      id: "1",
      artistName: "Calvin Harris",
      eventName: "Electric Dreams Festival",
      stage: "Main Stage", 
      startTime: "10:00 PM",
      endTime: "11:30 PM",
      date: "Aug 15",
      hasClash: false,
    },
    {
      id: "2",
      artistName: "Disclosure", 
      eventName: "Electric Dreams Festival",
      stage: "Main Stage",
      startTime: "8:30 PM", 
      endTime: "10:00 PM",
      date: "Aug 15",
      hasClash: false,
    },
    {
      id: "3",
      artistName: "ODESZA",
      eventName: "Electric Dreams Festival", 
      stage: "Electronic Tent",
      startTime: "9:00 PM",
      endTime: "10:00 PM",
      date: "Aug 15",
      hasClash: true,
      clashWith: ["Disclosure"]
    }
  ];

  const mockArtists = [
    {
      id: "1",
      name: "Calvin Harris",
      stage: "Main Stage",
      time: "10:00 PM - 11:30 PM",
      isHeadliner: true
    },
    {
      id: "2", 
      name: "Disclosure",
      stage: "Main Stage",
      time: "8:30 PM - 10:00 PM",
      isHeadliner: true
    },
    {
      id: "3",
      name: "ODESZA",
      stage: "Electronic Tent",
      time: "7:00 PM - 8:00 PM", 
      isHeadliner: false
    }
  ];

  const mockFriends = [
    { id: "1", name: "Sarah Chen", avatar: undefined, isFriend: true },
    { id: "2", name: "Mike Rodriguez", avatar: undefined, isFriend: true }
  ];

  const mockOtherAttendees = [
    { id: "3", name: "Emma Thompson", avatar: undefined, isFriend: false, mutualFriends: 3 },
    { id: "4", name: "David Kim", avatar: undefined, isFriend: false, mutualFriends: 1 }
  ];

  // Auth handlers
  const handleLogin = (method: string, data?: any) => {
    console.log('Login with:', method, data);
    // todo: remove mock functionality - Simulate login
    setCurrentUser({
      id: "1",
      name: "Alex Johnson",
      email: "alex@example.com",
      avatar: undefined
    });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage("events");
  };

  // Event handlers
  const handleAttendToggle = (eventId: string) => {
    console.log('Toggle attendance for event:', eventId);
  };

  const handleViewEventDetails = (eventId: string) => {
    setSelectedEventId(eventId);
  };

  const handleBackToEvents = () => {
    setSelectedEventId(null);
  };

  const handleAddToSchedule = (artistId: string) => {
    console.log('Add artist to schedule:', artistId);
  };

  const handleRemoveFromSchedule = (itemId: string) => {
    console.log('Remove from schedule:', itemId);
  };

  const handleResolveClash = (itemId: string) => {
    console.log('Resolve clash for:', itemId);
  };

  // Show login if not authenticated
  if (!currentUser) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <LoginForm onLogin={handleLogin} />
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  // Main app with navigation
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background">
          <Navigation
            user={currentUser}
            currentPage={currentPage}
            notificationCount={3}
            onNavigate={setCurrentPage}
            onLogin={() => handleLogin("manual")}
            onLogout={handleLogout}
          />
          
          <main className="container mx-auto px-4 py-8">
            {/* Event Discovery */}
            {currentPage === "events" && !selectedEventId && (
              <div className="space-y-8">
                <div className="text-center space-y-2">
                  <h1 className="font-heading text-3xl font-bold" data-testid="text-discover-title">
                    Discover Your Next Festival
                  </h1>
                  <p className="text-muted-foreground">
                    Find amazing music festivals and create your perfect schedule
                  </p>
                </div>
                <EventList
                  events={mockEvents}
                  onAttendToggle={handleAttendToggle}
                  onViewDetails={handleViewEventDetails}
                />
              </div>
            )}

            {/* Event Detail */}
            {currentPage === "events" && selectedEventId && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <EventDetail
                    id={selectedEventId}
                    name="Electric Dreams Festival"
                    date="August 15-17, 2024"
                    location="Golden Gate Park, San Francisco"
                    image={festivalImage1}
                    description="Electric Dreams Festival is a three-day celebration of electronic music culture, bringing together world-renowned DJs, cutting-edge visual artists, and music lovers from around the globe."
                    attendeeCount={12450}
                    isAttending={false}
                    artists={mockArtists}
                    tags={["Electronic", "EDM", "Techno", "House"]}
                    onBack={handleBackToEvents}
                    onAttendToggle={handleAttendToggle}
                    onAddToSchedule={handleAddToSchedule}
                  />
                </div>
                <div>
                  <SocialAttendance
                    eventName="Electric Dreams Festival"
                    totalAttendees={12450}
                    friendsAttending={mockFriends}
                    otherAttendees={mockOtherAttendees}
                    onFollowUser={(userId) => console.log('Follow user:', userId)}
                    onViewAllAttendees={() => console.log('View all attendees')}
                  />
                </div>
              </div>
            )}

            {/* Personal Schedule */}
            {currentPage === "schedule" && (
              <PersonalTimetable
                scheduleItems={mockScheduleItems}
                onRemoveItem={handleRemoveFromSchedule}
                onResolveClash={handleResolveClash}
              />
            )}

            {/* Profile Page */}
            {currentPage === "profile" && (
              <div className="max-w-2xl mx-auto">
                <div className="text-center space-y-4">
                  <h1 className="font-heading text-2xl font-bold">Profile Settings</h1>
                  <p className="text-muted-foreground">
                    Coming soon: Manage your festival preferences and profile
                  </p>
                </div>
              </div>
            )}

            {/* Admin Dashboard */}
            {currentPage === "admin" && (
              <AdminDashboard
                onCreateEvent={() => console.log('Create event')}
                onEditEvent={(eventId) => console.log('Edit event:', eventId)}
                onDeleteEvent={(eventId) => console.log('Delete event:', eventId)}
                onSuspendUser={(userId) => console.log('Suspend user:', userId)}
              />
            )}
          </main>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

function App() {
  return <Router />;
}

export default App;
