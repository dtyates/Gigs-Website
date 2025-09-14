import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  useAdminAnalytics,
  useAdminUsers,
  useAdminEvents,
  useUpdateUserStatus,
  useCreateEvent,
  useUpdateEvent,
  useDeleteEvent,
} from "@/hooks/useAdmin";
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
  BarChart3,
  Loader2,
  X
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertEventSchema } from "@shared/schema";

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

interface AdminDashboardProps {}

export function AdminDashboard({}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [createEventOpen, setCreateEventOpen] = useState(false);
  const [editEventOpen, setEditEventOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const { toast } = useToast();
  
  // Fetch real data using admin hooks
  const { data: analytics, isLoading: analyticsLoading } = useAdminAnalytics();
  const { data: users, isLoading: usersLoading } = useAdminUsers();
  const { data: events, isLoading: eventsLoading } = useAdminEvents();
  
  // Mutations
  const updateUserStatusMutation = useUpdateUserStatus();
  const createEventMutation = useCreateEvent();
  const updateEventMutation = useUpdateEvent();
  const deleteEventMutation = useDeleteEvent();

  // Handler functions using mutations
  const handleSuspendUser = async (userId: string) => {
    try {
      const user = users?.find((u: any) => u.id === userId);
      if (user) {
        await updateUserStatusMutation.mutateAsync({
          userId,
          isActive: !user.isActive
        });
        toast({
          title: "User status updated",
          description: `User has been ${user.isActive ? 'suspended' : 'activated'}.`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user status.",
        variant: "destructive",
      });
    }
  };

  const handleEditEvent = (eventId: string) => {
    const event = events?.find((e: any) => e.id === eventId);
    if (event) {
      setEditingEvent(event);
      setEditEventOpen(true);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await deleteEventMutation.mutateAsync(eventId);
      toast({
        title: "Event deleted",
        description: "Event has been successfully deleted.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete event.",
        variant: "destructive",
      });
    }
  };

  // Loading state
  if (analyticsLoading || usersLoading || eventsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Loading admin dashboard...</span>
      </div>
    );
  }

  // Filter real data
  const filteredEvents = events?.filter((event: any) =>
    event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.location.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const filteredUsers = users?.filter((user: any) =>
    user.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

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
        <Dialog open={createEventOpen} onOpenChange={setCreateEventOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-create-event">
              <Plus className="h-4 w-4 mr-2" />
              Create Event
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Event</DialogTitle>
            </DialogHeader>
            <CreateEventForm 
              onSuccess={() => setCreateEventOpen(false)}
              createEventMutation={createEventMutation}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Events</p>
                <p className="text-2xl font-bold" data-testid="text-total-events">{analytics?.totalEvents || 0}</p>
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
                <p className="text-2xl font-bold" data-testid="text-published-events">{analytics?.publishedEvents || 0}</p>
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
                <p className="text-2xl font-bold" data-testid="text-total-users">{analytics?.totalUsers || 0}</p>
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
                <p className="text-2xl font-bold" data-testid="text-total-attendees">{analytics?.totalAttendees?.toLocaleString() || '0'}</p>
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
                  {(events || []).slice(0, 3).map((event: any) => (
                    <div key={event.id} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{event.name}</div>
                        <div className="text-sm text-muted-foreground">{event.startDate || event.date || 'TBD'}</div>
                      </div>
                      <Badge variant={event.status === "published" ? "default" : "secondary"}>
                        {event.status || 'draft'}
                      </Badge>
                    </div>
                  ))}
                  {(!events || events.length === 0) && (
                    <div className="text-center text-muted-foreground py-4">
                      No events found
                    </div>
                  )}
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
                  {(users || []).slice(0, 3).map((user: any) => (
                    <div key={user.id} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.name || user.email}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {user.eventsAttended || 0} events
                      </div>
                    </div>
                  ))}
                  {(!users || users.length === 0) && (
                    <div className="text-center text-muted-foreground py-4">
                      No users found
                    </div>
                  )}
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
                {filteredEvents.map((event: any) => (
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
                          {event.status || 'draft'}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {event.startDate || event.date || 'TBD'} • {event.location || 'Location TBD'}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {(event.attendees || 0).toLocaleString()} attendees • {event.artists || event.performances?.length || 0} artists
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditEvent(event.id)}
                        data-testid={`button-edit-event-${event.id}`}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteEvent(event.id)}
                        data-testid={`button-delete-event-${event.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {filteredEvents.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    {searchQuery ? 'No events match your search' : 'No events found'}
                  </div>
                )}
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
                {filteredUsers.map((user: any) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                    data-testid={`user-row-${user.id}`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="font-medium" data-testid={`text-user-name-${user.id}`}>
                          {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.name || user.email}
                        </div>
                        <Badge variant={user.isActive ? "default" : "destructive"}>
                          {user.isActive ? 'active' : 'suspended'}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {user.email} • Joined {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {user.eventsAttended || 0} events attended
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSuspendUser(user.id)}
                        data-testid={`button-suspend-user-${user.id}`}
                        disabled={updateUserStatusMutation.isPending}
                      >
                        {updateUserStatusMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          user.isActive ? "Suspend" : "Activate"
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
                {filteredUsers.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    {searchQuery ? 'No users match your search' : 'No users found'}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Event Dialog */}
      <Dialog open={editEventOpen} onOpenChange={setEditEventOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
          </DialogHeader>
          {editingEvent && (
            <EditEventForm 
              event={editingEvent}
              onSuccess={() => setEditEventOpen(false)}
              updateEventMutation={updateEventMutation}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Event form schema
const eventFormSchema = insertEventSchema.pick({
  name: true,
  description: true,
  location: true,
  startDate: true,
  endDate: true,
  status: true,
}).extend({
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
});

// Create Event Form Component
function CreateEventForm({ onSuccess, createEventMutation }: {
  onSuccess: () => void;
  createEventMutation: any;
}) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof eventFormSchema>>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      name: "",
      description: "",
      location: "",
      startDate: "",
      endDate: "",
      status: "draft",
    },
  });

  const onSubmit = async (values: z.infer<typeof eventFormSchema>) => {
    try {
      await createEventMutation.mutateAsync({
        ...values,
        startDate: new Date(values.startDate),
        endDate: new Date(values.endDate),
      });
      toast({
        title: "Event created",
        description: "Event has been successfully created.",
      });
      form.reset();
      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create event.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter event name" {...field} data-testid="input-event-name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter event description" 
                  {...field} 
                  data-testid="input-event-description"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="Enter event location" {...field} data-testid="input-event-location" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <Input 
                    type="datetime-local" 
                    {...field} 
                    data-testid="input-event-start-date"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date</FormLabel>
                <FormControl>
                  <Input 
                    type="datetime-local" 
                    {...field} 
                    data-testid="input-event-end-date"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger data-testid="select-event-status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onSuccess}
            data-testid="button-cancel-create"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={createEventMutation.isPending}
            data-testid="button-submit-create"
          >
            {createEventMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            Create Event
          </Button>
        </div>
      </form>
    </Form>
  );
}

// Edit Event Form Component
function EditEventForm({ event, onSuccess, updateEventMutation }: {
  event: any;
  onSuccess: () => void;
  updateEventMutation: any;
}) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof eventFormSchema>>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      name: event.name || "",
      description: event.description || "",
      location: event.location || "",
      startDate: event.startDate ? new Date(event.startDate).toISOString().slice(0, 16) : "",
      endDate: event.endDate ? new Date(event.endDate).toISOString().slice(0, 16) : "",
      status: event.status || "draft",
    },
  });

  const onSubmit = async (values: z.infer<typeof eventFormSchema>) => {
    try {
      await updateEventMutation.mutateAsync({
        eventId: event.id,
        eventData: {
          ...values,
          startDate: new Date(values.startDate),
          endDate: new Date(values.endDate),
        },
      });
      toast({
        title: "Event updated",
        description: "Event has been successfully updated.",
      });
      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update event.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter event name" {...field} data-testid="input-edit-event-name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter event description" 
                  {...field} 
                  data-testid="input-edit-event-description"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="Enter event location" {...field} data-testid="input-edit-event-location" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <Input 
                    type="datetime-local" 
                    {...field} 
                    data-testid="input-edit-event-start-date"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date</FormLabel>
                <FormControl>
                  <Input 
                    type="datetime-local" 
                    {...field} 
                    data-testid="input-edit-event-end-date"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger data-testid="select-edit-event-status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onSuccess}
            data-testid="button-cancel-edit"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={updateEventMutation.isPending}
            data-testid="button-submit-edit"
          >
            {updateEventMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            Update Event
          </Button>
        </div>
      </form>
    </Form>
  );
}