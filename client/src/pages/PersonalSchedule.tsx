import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calendar, Clock, MapPin, Users, Trash2, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ScheduledPerformance {
  id: string;
  startTime: string;
  endTime: string;
  isHeadliner: boolean;
  artist: {
    id: string;
    name: string;
    genre: string;
  };
  stage: {
    id: string;
    name: string;
  };
  event: {
    id: string;
    name: string;
  };
}

interface ScheduleConflict {
  id: string;
  artistName: string;
  stageName: string;
  startTime: string;
  endTime: string;
}

export default function PersonalSchedule() {
  const { toast } = useToast();
  const [conflictsToShow, setConflictsToShow] = useState<ScheduleConflict[]>([]);

  // Fetch user's scheduled performances
  const { data: scheduledPerformances = [], isLoading } = useQuery<ScheduledPerformance[]>({
    queryKey: ['/api/user/schedule'],
  });

  // Remove performance from schedule mutation
  const removeFromScheduleMutation = useMutation({
    mutationFn: async (performanceId: string) => {
      return apiRequest('DELETE', `/api/user/schedule/${performanceId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user/schedule'] });
      toast({
        title: "Removed from schedule",
        description: "The performance has been removed from your schedule.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove performance from schedule.",
        variant: "destructive",
      });
    },
  });

  // Group performances by date
  const groupedPerformances = scheduledPerformances.reduce((acc, performance) => {
    const date = format(new Date(performance.startTime), "yyyy-MM-dd");
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(performance);
    return acc;
  }, {} as Record<string, ScheduledPerformance[]>);

  // Sort performances within each day by start time
  Object.keys(groupedPerformances).forEach(date => {
    groupedPerformances[date].sort((a, b) => 
      new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );
  });

  const handleRemoveFromSchedule = (performanceId: string) => {
    removeFromScheduleMutation.mutate(performanceId);
  };

  // Format time range for display
  const formatTimeRange = (startTime: string, endTime: string) => {
    const start = format(new Date(startTime), "h:mm a");
    const end = format(new Date(endTime), "h:mm a");
    return `${start} - ${end}`;
  };

  // Check for conflicts in the schedule
  const detectConflicts = () => {
    const conflicts: ScheduleConflict[] = [];
    const sortedPerfs = scheduledPerformances.sort((a, b) => 
      new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );

    for (let i = 0; i < sortedPerfs.length - 1; i++) {
      const current = sortedPerfs[i];
      const next = sortedPerfs[i + 1];
      
      const currentEnd = new Date(current.endTime);
      const nextStart = new Date(next.startTime);
      
      if (currentEnd > nextStart) {
        conflicts.push({
          id: next.id,
          artistName: next.artist.name,
          stageName: next.stage.name,
          startTime: next.startTime,
          endTime: next.endTime,
        });
      }
    }
    
    return conflicts;
  };

  const scheduleConflicts = detectConflicts();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="font-heading text-3xl font-bold" data-testid="text-schedule-title">
            My Festival Schedule
          </h1>
          <p className="text-muted-foreground">
            Loading your personalized festival itinerary...
          </p>
        </div>
        <div className="grid gap-4">
          {[1, 2, 3].map((i: number) => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (scheduledPerformances.length === 0) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="font-heading text-3xl font-bold" data-testid="text-schedule-title">
            My Festival Schedule
          </h1>
          <p className="text-muted-foreground">
            Your personalized festival itinerary
          </p>
        </div>
        
        <Card>
          <CardContent className="text-center py-12">
            <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg mb-2">No performances scheduled</h3>
            <p className="text-muted-foreground mb-4">
              Start building your festival itinerary by adding performances from event pages
            </p>
            <Button variant="outline" data-testid="button-browse-events">
              Browse Events
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="font-heading text-3xl font-bold" data-testid="text-schedule-title">
          My Festival Schedule
        </h1>
        <p className="text-muted-foreground">
          Your personalized festival itinerary • {scheduledPerformances.length} performance{scheduledPerformances.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Schedule Conflicts Warning */}
      {scheduleConflicts.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Schedule Conflicts Detected!</strong> You have {scheduleConflicts.length} overlapping performance{scheduleConflicts.length !== 1 ? 's' : ''} in your schedule.
            Review your itinerary to avoid missing your favorite artists.
          </AlertDescription>
        </Alert>
      )}

      {/* Schedule by Date */}
      <div className="space-y-8">
        {Object.entries(groupedPerformances)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([date, performances]) => (
            <div key={date} className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-primary" />
                <h2 className="font-heading text-xl font-semibold">
                  {format(new Date(date), "EEEE, MMMM d")}
                </h2>
                <Badge variant="secondary" className="ml-2">
                  {performances.length} performance{performances.length !== 1 ? 's' : ''}
                </Badge>
              </div>
              
              <div className="grid gap-4">
                {performances.map((performance) => {
                  const hasConflict = scheduleConflicts.some(conflict => conflict.id === performance.id);
                  
                  return (
                    <Card key={performance.id} className={hasConflict ? "border-destructive" : ""}>
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <CardTitle className="text-lg" data-testid={`text-performance-${performance.id}`}>
                                {performance.artist?.name || 'Unknown Artist'}
                              </CardTitle>
                              {performance.isHeadliner && (
                                <Badge variant="default">Headliner</Badge>
                              )}
                              {hasConflict && (
                                <Badge variant="destructive">Conflict</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {performance.event.name}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveFromSchedule(performance.id)}
                            disabled={removeFromScheduleMutation.isPending}
                            data-testid={`button-remove-${performance.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="pt-0">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{formatTimeRange(performance.startTime, performance.endTime)}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>{performance.stage.name}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {performance.artist.genre}
                            </Badge>
                          </div>
                        </div>
                        
                        {hasConflict && (
                          <div className="mt-3 p-3 bg-destructive/10 rounded-md">
                            <p className="text-sm text-destructive">
                              <strong>Scheduling conflict:</strong> This performance overlaps with another one in your schedule.
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              
              {date !== Object.keys(groupedPerformances).slice(-1)[0] && (
                <Separator className="mt-8" />
              )}
            </div>
          ))}
      </div>
    </div>
  );
}