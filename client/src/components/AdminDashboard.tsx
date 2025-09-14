import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Calendar,
  Music,
  TrendingUp,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  BarChart3
} from "lucide-react";

interface Event {
  id: string;
  name: string;
  date: string;
  location: string;
  status: "draft" | "published" | "archived";
  attendees: number;
  artists: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  joinDate: string;
  eventsAttended: number;
  status: "active" | "suspended";
}

interface AdminDashboardProps {
  onCreateEvent: () => void;
  onEditEvent: (eventId: string) => void;
  onDeleteEvent: (eventId: string) => void;
  onSuspendUser: (userId: string) => void;
}

export function AdminDashboard({
  onCreateEvent,
  onEditEvent,
  onDeleteEvent,
  onSuspendUser,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");

  // todo: remove mock functionality
  const mockEvents: Event[] = [
    {
      id: "1",
      name: "Electric Dreams Festival",
      date: "Aug 15-17, 2024",
      location: "Golden Gate Park, SF",
      status: "published",
      attendees: 12450,
      artists: 85
    },
    {
      id: "2",
      name: "Sunset Grooves",
      date: "Sep 22-24, 2024", 
      location: "Venice Beach, LA",
      status: "draft",
      attendees: 0,
      artists: 45
    }
  ];

  const mockUsers: User[] = [
    {
      id: "1",
      name: "Alex Johnson",
      email: "alex@example.com",
      joinDate: "2024-01-15",
      eventsAttended: 3,
      status: "active"
    },
    {
      id: "2",
      name: "Sarah Chen", 
      email: "sarah@example.com",
      joinDate: "2024-02-10",
      eventsAttended: 1,
      status: "active"
    }
  ];

  const totalEvents = mockEvents.length;
  const publishedEvents = mockEvents.filter(e => e.status === "published").length;
  const totalUsers = mockUsers.length;
  const totalAttendees = mockEvents.reduce((sum, event) => sum + event.attendees, 0);

  const filteredEvents = mockEvents.filter(event =>
    event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUsers = mockUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold" data-testid="text-admin-title">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage events, users, and festival data
          </p>
        </div>
        <Button onClick={onCreateEvent} data-testid="button-create-event">
          <Plus className="h-4 w-4 mr-2" />
          Create Event
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Events</p>
                <p className="text-2xl font-bold" data-testid="text-total-events">{totalEvents}</p>
              </div>
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Published</p>
                <p className="text-2xl font-bold" data-testid="text-published-events">{publishedEvents}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold" data-testid="text-total-users">{totalUsers}</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Attendees</p>
                <p className="text-2xl font-bold" data-testid="text-total-attendees">{totalAttendees.toLocaleString()}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
          <TabsTrigger value="events" data-testid="tab-events">Events</TabsTrigger>
          <TabsTrigger value="users" data-testid="tab-users">Users</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Events */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockEvents.slice(0, 3).map((event) => (
                    <div key={event.id} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{event.name}</div>
                        <div className="text-sm text-muted-foreground">{event.date}</div>
                      </div>
                      <Badge variant={event.status === "published" ? "default" : "secondary"}>
                        {event.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Users */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockUsers.slice(0, 3).map((user) => (
                    <div key={user.id} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {user.eventsAttended} events
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          {/* Search */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-search-events"
              />
            </div>
            <Button variant="outline" data-testid="button-filter-events">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>

          {/* Events Table */}
          <Card>
            <CardHeader>
              <CardTitle>Events Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                    data-testid={`event-row-${event.id}`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="font-medium" data-testid={`text-event-name-${event.id}`}>
                          {event.name}
                        </div>
                        <Badge variant={event.status === "published" ? "default" : "secondary"}>
                          {event.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {event.date} • {event.location}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {event.attendees.toLocaleString()} attendees • {event.artists} artists
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEditEvent(event.id)}
                        data-testid={`button-edit-event-${event.id}`}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDeleteEvent(event.id)}
                        data-testid={`button-delete-event-${event.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          {/* Search */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-search-users"
              />
            </div>
            <Button variant="outline" data-testid="button-filter-users">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>

          {/* Users Table */}
          <Card>
            <CardHeader>
              <CardTitle>Users Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                    data-testid={`user-row-${user.id}`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="font-medium" data-testid={`text-user-name-${user.id}`}>
                          {user.name}
                        </div>
                        <Badge variant={user.status === "active" ? "default" : "destructive"}>
                          {user.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {user.email} • Joined {user.joinDate}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {user.eventsAttended} events attended
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onSuspendUser(user.id)}
                        data-testid={`button-suspend-user-${user.id}`}
                      >
                        {user.status === "active" ? "Suspend" : "Activate"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}