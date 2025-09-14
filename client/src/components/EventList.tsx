import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EventCard } from "./EventCard";
import { Search, Filter, Calendar } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import type { Event } from "@shared/schema";

interface EventListProps {
  onViewDetails: (id: string) => void;
}

export function EventList({ onViewDetails }: EventListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  // Fetch events from API
  const { data: events = [], isLoading, error } = useQuery({
    queryKey: searchQuery ? ["/api/events", searchQuery] : ["/api/events"],
    queryFn: async () => {
      const url = searchQuery ? `/api/events?search=${encodeURIComponent(searchQuery)}` : "/api/events";
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.statusText}`);
      }
      return response.json();
    },
  });

  // Fetch user's event attendances if authenticated
  const { data: userAttendances = [] } = useQuery({
    queryKey: ["/api/user/attendances"],
    queryFn: async () => {
      if (!isAuthenticated) return [];
      const response = await fetch("/api/user/attendances");
      if (!response.ok) return [];
      return response.json();
    },
    enabled: isAuthenticated,
  });

  // Toggle event attendance
  const attendanceMutation = useMutation({
    mutationFn: async (eventId: string) => {
      const response = await fetch(`/api/events/${eventId}/attend`, {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error("Failed to toggle attendance");
      }
      return response.json();
    },
    onSuccess: (data, eventId) => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/attendances"] });
      queryClient.invalidateQueries({ queryKey: [`/api/events/${eventId}/attendees`] });
      toast({
        title: data.attending ? "Attending festival!" : "No longer attending",
        description: data.attending 
          ? "You'll receive updates about this festival"
          : "You won't receive further updates",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update attendance. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAttendToggle = (eventId: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to attend festivals",
        variant: "destructive",
      });
      return;
    }
    attendanceMutation.mutate(eventId);
  };

  // Mock tags for now - in a real app, these would come from the events or be predefined
  const allTags = ["Electronic", "EDM", "Techno", "House", "Progressive", "Ambient"];

  // Filter events based on search and selected filter  
  const filteredEvents = events.filter((event: Event) => {
    const matchesSearch = searchQuery === "" || (
      event.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    // For now, skip tag filtering since we don't have tags in the schema yet
    const matchesFilter = !selectedFilter;
    
    return matchesSearch && matchesFilter;
  });

  // Transform events to match EventCard interface
  const transformedEvents = filteredEvents.map((event: Event) => ({
    id: event.id,
    name: event.name || "",
    date: event.startDate ? new Date(event.startDate).toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }) : "",
    location: event.location || "",
    image: event.imageUrl || "/placeholder-festival.jpg",
    description: event.description || "",
    attendeeCount: 0, // This would need to be fetched separately
    isAttending: userAttendances.some((attendance: any) => attendance.eventId === event.id),
    artistCount: 6, // Mock for now
    tags: ["Electronic", "EDM"] // Mock for now
  }));

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-destructive mb-2">Failed to load festivals</div>
        <p className="text-sm text-muted-foreground">
          Please try refreshing the page
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Header */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search festivals, locations, or artists..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            data-testid="input-search-events"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            data-testid="button-toggle-filters"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button
            variant="outline"
            size="sm"
            data-testid="button-date-filter"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Dates
          </Button>
          {selectedFilter && (
            <Badge 
              variant="secondary" 
              className="cursor-pointer hover-elevate"
              onClick={() => setSelectedFilter(null)}
              data-testid={`badge-active-filter-${selectedFilter}`}
            >
              {selectedFilter} ×
            </Badge>
          )}
        </div>

        {/* Filter Tags */}
        {showFilters && (
          <div className="flex flex-wrap gap-2 p-4 bg-muted/50 rounded-md">
            {allTags.map((tag) => (
              <Badge
                key={tag}
                variant={selectedFilter === tag ? "default" : "outline"}
                className="cursor-pointer hover-elevate"
                onClick={() => setSelectedFilter(selectedFilter === tag ? null : tag)}
                data-testid={`badge-filter-${tag}`}
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-xl font-semibold" data-testid="text-results-count">
          {isLoading ? "Loading..." : (
            <>
              {transformedEvents.length} Festival{transformedEvents.length !== 1 ? 's' : ''}
              {searchQuery && ` for "${searchQuery}"`}
            </>
          )}
        </h2>
      </div>

      {/* Event Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i: number) => (
            <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {transformedEvents.map((event: any) => (
            <EventCard
              key={event.id}
              {...event}
              onAttendToggle={handleAttendToggle}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      )}

      {/* No Results */}
      {!isLoading && transformedEvents.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-2">No festivals found</div>
          <p className="text-sm text-muted-foreground">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
}