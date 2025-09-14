import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EventCard } from "./EventCard";
import { Search, Filter, Calendar } from "lucide-react";

interface Event {
  id: string;
  name: string;
  date: string;
  location: string;
  image: string;
  description: string;
  attendeeCount: number;
  isAttending: boolean;
  artistCount: number;
  tags: string[];
}

interface EventListProps {
  events: Event[];
  onAttendToggle: (id: string) => void;
  onViewDetails: (id: string) => void;
}

export function EventList({ events, onAttendToggle, onViewDetails }: EventListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Get unique tags from all events
  const allTags = Array.from(new Set(events.flatMap(event => event.tags)));

  // Filter events based on search and selected filter
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = !selectedFilter || event.tags.includes(selectedFilter);
    
    return matchesSearch && matchesFilter;
  });

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
          {filteredEvents.length} Festival{filteredEvents.length !== 1 ? 's' : ''}
          {searchQuery && ` for "${searchQuery}"`}
        </h2>
      </div>

      {/* Event Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <EventCard
            key={event.id}
            {...event}
            onAttendToggle={onAttendToggle}
            onViewDetails={onViewDetails}
          />
        ))}
      </div>

      {/* No Results */}
      {filteredEvents.length === 0 && (
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