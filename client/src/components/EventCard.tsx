import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Heart } from "lucide-react";
import { useState } from "react";

interface EventCardProps {
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
  onAttendToggle: (id: string) => void;
  onViewDetails: (id: string) => void;
}

export function EventCard({
  id,
  name,
  date,
  location,
  image,
  description,
  attendeeCount,
  isAttending,
  artistCount,
  tags,
  onAttendToggle,
  onViewDetails,
}: EventCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card 
      className="overflow-hidden hover-elevate cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-testid={`card-event-${id}`}
    >
      <div className="relative">
        <div className="aspect-video overflow-hidden">
          <img
            src={image}
            alt={name}
            className={`w-full h-full object-cover transition-transform duration-300 ${
              isHovered ? "scale-105" : "scale-100"
            }`}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex gap-2 mb-2">
            {tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          <h3 className="font-heading font-semibold text-lg text-white mb-1" data-testid={`text-event-name-${id}`}>
            {name}
          </h3>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Calendar className="h-4 w-4" />
          <span data-testid={`text-event-date-${id}`}>{date}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          <MapPin className="h-4 w-4" />
          <span data-testid={`text-event-location-${id}`}>{location}</span>
        </div>
        
        <p className="text-sm mb-4 line-clamp-2" data-testid={`text-event-description-${id}`}>
          {description}
        </p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span data-testid={`text-attendee-count-${id}`}>{attendeeCount} attending</span>
            </div>
            <span data-testid={`text-artist-count-${id}`}>{artistCount} artists</span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAttendToggle(id)}
            className={isAttending ? "bg-primary text-primary-foreground" : ""}
            data-testid={`button-attend-${id}`}
          >
            <Heart className={`h-4 w-4 mr-2 ${isAttending ? "fill-current" : ""}`} />
            {isAttending ? "Attending" : "Attend"}
          </Button>
          <Button
            size="sm"
            onClick={() => onViewDetails(id)}
            className="flex-1"
            data-testid={`button-view-details-${id}`}
          >
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}