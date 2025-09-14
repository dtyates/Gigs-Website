import { useQuery } from "@tanstack/react-query";
import { PerformanceCard } from "./PerformanceCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar, Music } from "lucide-react";
import { format } from "date-fns";

interface Performance {
  id: string;
  startTime: string;
  endTime: string;
  isHeadliner: boolean;
  artist: {
    id: string;
    name: string;
    bio?: string;
  };
  stage: {
    id: string;
    name: string;
  };
}

interface EventPerformancesProps {
  eventId: string;
  eventName: string;
}

export function EventPerformances({ eventId, eventName }: EventPerformancesProps) {
  // Fetch performances for this event
  const { data: performances = [], isLoading, error } = useQuery<Performance[]>({
    queryKey: ['/api/events', eventId, 'performances'],
  });

  // Get user's schedule to check which performances are already added
  const { data: userSchedule = [] } = useQuery<Performance[]>({
    queryKey: ['/api/user/schedule'],
  });

  const userScheduleIds = new Set(userSchedule.map(p => p.id));

  if (error) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <div className="text-muted-foreground">Failed to load performances</div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="h-5 w-5" />
            Artist Lineup & Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i: number) => (
              <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (performances.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="h-5 w-5" />
            Artist Lineup & Schedule
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <div className="text-muted-foreground">
            No performances scheduled for this event yet
          </div>
        </CardContent>
      </Card>
    );
  }

  // Group performances by date
  const performancesByDate = performances.reduce((acc, performance) => {
    const date = format(new Date(performance.startTime), "yyyy-MM-dd");
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(performance);
    return acc;
  }, {} as Record<string, Performance[]>);

  // Sort performances within each day by start time
  Object.keys(performancesByDate).forEach(date => {
    performancesByDate[date].sort((a, b) => 
      new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music className="h-5 w-5" />
          Artist Lineup & Schedule
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {performances.length} performance{performances.length !== 1 ? 's' : ''} • 
          {performances.filter(p => p.isHeadliner).length} headliner{performances.filter(p => p.isHeadliner).length !== 1 ? 's' : ''}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Object.entries(performancesByDate)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([date, dayPerformances], dayIndex) => (
              <div key={date} className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold text-lg">
                    {format(new Date(date), "EEEE, MMMM d")}
                  </h3>
                  <div className="text-sm text-muted-foreground">
                    {dayPerformances.length} performance{dayPerformances.length !== 1 ? 's' : ''}
                  </div>
                </div>
                
                <div className="grid gap-4">
                  {dayPerformances.map((performance, index) => (
                    <PerformanceCard
                      key={performance.id}
                      performance={performance}
                      isInSchedule={userScheduleIds.has(performance.id)}
                    />
                  ))}
                </div>
                
                {dayIndex < Object.keys(performancesByDate).length - 1 && (
                  <Separator className="mt-6" />
                )}
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}