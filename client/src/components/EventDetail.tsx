import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Calendar, 
  MapPin, 
  Users, 
  Heart, 
  Clock, 
  Share, 
  Star,
  Music,
  ArrowLeft 
} from "lucide-react";

interface Artist {
  id: string;
  name: string;
  stage: string;
  time: string;
  image?: string;
  isHeadliner: boolean;
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
  const [selectedStage, setSelectedStage] = useState<string | null>(null);

  const stages = Array.from(new Set(artists.map(artist => artist.stage)));
  const filteredArtists = selectedStage 
    ? artists.filter(artist => artist.stage === selectedStage)
    : artists;

  const headliners = artists.filter(artist => artist.isHeadliner);

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-4"
        data-testid="button-back"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Events
      </Button>

      {/* Hero Section */}
      <div className="relative">
        <div className="aspect-video md:aspect-[21/9] overflow-hidden rounded-lg">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent rounded-lg" />
        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="backdrop-blur-sm">
                {tag}
              </Badge>
            ))}
          </div>
          <h1 className="font-heading font-bold text-3xl md:text-4xl text-white mb-2" data-testid="text-event-title">
            {name}
          </h1>
          <div className="flex items-center gap-4 text-white/90">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span data-testid="text-event-date">{date}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span data-testid="text-event-location">{location}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          variant={isAttending ? "default" : "outline"}
          onClick={() => onAttendToggle(id)}
          data-testid="button-attend-event"
        >
          <Heart className={`h-4 w-4 mr-2 ${isAttending ? "fill-current" : ""}`} />
          {isAttending ? "Attending" : "Attend"}
        </Button>
        <Button variant="outline" data-testid="button-share-event">
          <Share className="h-4 w-4 mr-2" />
          Share
        </Button>
        <div className="flex items-center gap-2 text-sm text-muted-foreground ml-auto">
          <Users className="h-4 w-4" />
          <span data-testid="text-attendees">{attendeeCount} attending</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed" data-testid="text-event-description">
                {description}
              </p>
            </CardContent>
          </Card>

          {/* Headliners */}
          {headliners.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-primary" />
                  Headliners
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {headliners.map((artist) => (
                    <div key={artist.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <Avatar>
                        <AvatarImage src={artist.image} />
                        <AvatarFallback>{artist.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-medium" data-testid={`text-headliner-name-${artist.id}`}>
                          {artist.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {artist.stage} • {artist.time}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onAddToSchedule(artist.id)}
                        data-testid={`button-add-headliner-${artist.id}`}
                      >
                        <Music className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Artist Lineup */}
          <Card>
            <CardHeader>
              <CardTitle>Artist Lineup</CardTitle>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedStage === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedStage(null)}
                  data-testid="button-all-stages"
                >
                  All Stages
                </Button>
                {stages.map((stage) => (
                  <Button
                    key={stage}
                    variant={selectedStage === stage ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedStage(stage)}
                    data-testid={`button-stage-${stage}`}
                  >
                    {stage}
                  </Button>
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {filteredArtists.map((artist, index) => (
                  <div key={artist.id}>
                    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={artist.image} />
                          <AvatarFallback>{artist.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium flex items-center gap-2" data-testid={`text-artist-name-${artist.id}`}>
                            {artist.name}
                            {artist.isHeadliner && (
                              <Star className="h-4 w-4 text-primary fill-current" />
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {artist.stage} • {artist.time}
                          </div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onAddToSchedule(artist.id)}
                        data-testid={`button-add-artist-${artist.id}`}
                      >
                        <Music className="h-4 w-4 mr-2" />
                        Add
                      </Button>
                    </div>
                    {index < filteredArtists.length - 1 && <Separator />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Event Info */}
          <Card>
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="font-medium">Date</div>
                  <div className="text-sm text-muted-foreground">{date}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="font-medium">Location</div>
                  <div className="text-sm text-muted-foreground">{location}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="font-medium">Duration</div>
                  <div className="text-sm text-muted-foreground">3 days</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="font-medium">Attendees</div>
                  <div className="text-sm text-muted-foreground">{attendeeCount} going</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}