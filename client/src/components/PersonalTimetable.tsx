import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Clock, 
  MapPin, 
  AlertTriangle, 
  X, 
  Calendar,
  Music,
  Filter
} from "lucide-react";

interface ScheduleItem {
  id: string;
  artistName: string;
  eventName: string;
  stage: string;
  startTime: string;
  endTime: string;
  date: string;
  hasClash: boolean;
  clashWith?: string[];
  artistImage?: string;
}

interface PersonalTimetableProps {
  scheduleItems: ScheduleItem[];
  onRemoveItem: (id: string) => void;
  onResolveClash: (id: string) => void;
}

export function PersonalTimetable({ 
  scheduleItems, 
  onRemoveItem, 
  onResolveClash 
}: PersonalTimetableProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showClashesOnly, setShowClashesOnly] = useState(false);

  // Get unique dates from schedule items
  const dates = Array.from(new Set(scheduleItems.map(item => item.date))).sort();
  
  // Filter items based on selected date and clash filter
  const filteredItems = scheduleItems.filter(item => {
    const dateMatch = !selectedDate || item.date === selectedDate;
    const clashMatch = !showClashesOnly || item.hasClash;
    return dateMatch && clashMatch;
  });

  // Group items by date
  const itemsByDate = filteredItems.reduce((acc, item) => {
    if (!acc[item.date]) acc[item.date] = [];
    acc[item.date].push(item);
    return acc;
  }, {} as Record<string, ScheduleItem[]>);

  // Sort items by start time within each date
  Object.keys(itemsByDate).forEach(date => {
    itemsByDate[date].sort((a, b) => {
      const timeA = new Date(`2024-01-01 ${a.startTime}`);
      const timeB = new Date(`2024-01-01 ${b.startTime}`);
      return timeA.getTime() - timeB.getTime();
    });
  });

  const clashCount = scheduleItems.filter(item => item.hasClash).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold" data-testid="text-timetable-title">
            My Festival Schedule
          </h1>
          <p className="text-muted-foreground">
            {scheduleItems.length} artist{scheduleItems.length !== 1 ? 's' : ''} planned
            {clashCount > 0 && (
              <span className="text-destructive ml-2">
                • {clashCount} clash{clashCount !== 1 ? 'es' : ''} detected
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedDate === null ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedDate(null)}
          data-testid="button-all-dates"
        >
          <Calendar className="h-4 w-4 mr-2" />
          All Days
        </Button>
        {dates.map((date) => (
          <Button
            key={date}
            variant={selectedDate === date ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedDate(date)}
            data-testid={`button-date-${date}`}
          >
            {date}
          </Button>
        ))}
        <Button
          variant={showClashesOnly ? "destructive" : "outline"}
          size="sm"
          onClick={() => setShowClashesOnly(!showClashesOnly)}
          data-testid="button-show-clashes"
        >
          <AlertTriangle className="h-4 w-4 mr-2" />
          Clashes Only
        </Button>
      </div>

      {/* Schedule */}
      {filteredItems.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Music className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <div className="text-lg font-medium mb-2">
              {showClashesOnly ? "No clashes found" : "No events scheduled"}
            </div>
            <p className="text-muted-foreground">
              {showClashesOnly 
                ? "Your schedule looks good! No timing conflicts detected."
                : "Start building your festival schedule by adding artists from event pages."
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(itemsByDate).map(([date, items]) => (
            <Card key={date}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  {date}
                  <Badge variant="secondary" className="ml-auto">
                    {items.length} artist{items.length !== 1 ? 's' : ''}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-0">
                {items.map((item, index) => (
                  <div key={item.id}>
                    <div className={`p-4 rounded-lg transition-colors ${
                      item.hasClash ? 'bg-destructive/10 border border-destructive/20' : 'hover:bg-muted/50'
                    }`}>
                      <div className="flex items-start gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={item.artistImage} />
                          <AvatarFallback>{item.artistName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold truncate" data-testid={`text-artist-${item.id}`}>
                                {item.artistName}
                              </h3>
                              <p className="text-sm text-muted-foreground" data-testid={`text-event-${item.id}`}>
                                {item.eventName}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onRemoveItem(item.id)}
                              className="h-8 w-8 p-0 shrink-0"
                              data-testid={`button-remove-${item.id}`}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span data-testid={`text-time-${item.id}`}>
                                {item.startTime} - {item.endTime}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              <span data-testid={`text-stage-${item.id}`}>{item.stage}</span>
                            </div>
                          </div>
                          
                          {item.hasClash && (
                            <div className="mt-3 p-3 bg-destructive/10 rounded border border-destructive/20">
                              <div className="flex items-start gap-2">
                                <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                                <div className="flex-1">
                                  <div className="font-medium text-destructive text-sm">
                                    Schedule Conflict
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    Overlaps with: {item.clashWith?.join(', ')}
                                  </div>
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => onResolveClash(item.id)}
                                  data-testid={`button-resolve-clash-${item.id}`}
                                >
                                  Resolve
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    {index < items.length - 1 && <Separator className="my-0" />}
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}