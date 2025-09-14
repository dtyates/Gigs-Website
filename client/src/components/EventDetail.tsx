import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { EventPerformances } from "./EventPerformances";
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Users, 
  Heart, 
  Music,
  Clock
} from "lucide-react";

interface Artist {
  id: string;
  name: string;
  stage: string;
  time: string;
  isHeadliner?: boolean;
}

interface EventDetailProps {
  id: string;
  name: string;
  date: string;
  location: string;
  image: string;
  description: string;
  attendeeCount: number;
  isAttending: boolean;
  artists: Artist[];
  tags: string[];
  onBack: () => void;
  onAttendToggle: (id: string) => void;
  onAddToSchedule: (artistId: string) => void;
}

export function EventDetail({
  id,
  name,
  date,
  location,
  image,
  description,
  attendeeCount,
  isAttending,
  artists,
  tags,
  onBack,
  onAttendToggle,
  onAddToSchedule,
}: EventDetailProps) {
  // Group artists by headliner status
  const headliners = artists.filter(artist => artist.isHeadliner);
  const otherArtists = artists.filter(artist => !artist.isHeadliner);

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative">
        <div className="aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-lg">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent rounded-lg" />
        
        {/* Back Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onBack}
          className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm"
          data-testid="button-back"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
            
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-white" data-testid={`text-event-name-${id}`}>
              {name}
            </h1>
            
            <div className="flex flex-wrap gap-4 text-white/90">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span data-testid={`text-event-date-${id}`}>{date}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span data-testid={`text-event-location-${id}`}>{location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span data-testid={`text-attendee-count-${id}`}>{attendeeCount} attending</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Event Info and Actions */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Description */}
            <div>
              <h2 className="font-semibold text-lg mb-3">About This Festival</h2>
              <p className="text-muted-foreground leading-relaxed" data-testid={`text-event-description-${id}`}>
                {description}
              </p>
            </div>

            <Separator />

            {/* Stats and Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>{attendeeCount} people attending</span>
                </div>
                <div className="flex items-center gap-2">
                  <Music className="h-4 w-4" />
                  <span>{artists.length} artists</span>
                </div>
              </div>
              
              <Button
                onClick={() => onAttendToggle(id)}
                variant={isAttending ? "default" : "outline"}
                className={`${isAttending ? 'bg-primary' : ''}`}
                data-testid={`button-attend-${id}`}
              >
                <Heart className={`h-4 w-4 mr-2 ${isAttending ? "fill-current" : ""}`} />
                {isAttending ? "Attending" : "Attend"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Event Performances */}
      <EventPerformances 
        eventId={id} 
        eventName={name}
      />
    </div>
  );
}