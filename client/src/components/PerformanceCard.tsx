import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Music, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

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

interface PerformanceCardProps {
  performance: Performance;
  isInSchedule?: boolean;
}

export function PerformanceCard({ performance, isInSchedule = false }: PerformanceCardProps) {
  const { toast } = useToast();
  const [conflicts, setConflicts] = useState<any[]>([]);

  // Add to schedule mutation
  const addToScheduleMutation = useMutation({
    mutationFn: async (performanceId: string) => {
      return apiRequest('POST', '/api/user/schedule', { performanceId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user/schedule'] });
      toast({
        title: "Added to schedule",
        description: `${performance.artist.name} has been added to your schedule.`,
      });
    },
    onError: (error: any) => {
      // Check if it's a conflict error (409 status)
      if (error.message?.includes('409') || error.message?.includes('conflict')) {
        toast({
          title: "Schedule Conflict",
          description: `${performance.artist.name} conflicts with another performance in your schedule.`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to add performance to schedule.",
          variant: "destructive",
        });
      }
    },
  });

  // Remove from schedule mutation
  const removeFromScheduleMutation = useMutation({
    mutationFn: async (performanceId: string) => {
      return apiRequest('DELETE', `/api/user/schedule/${performanceId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user/schedule'] });
      toast({
        title: "Removed from schedule",
        description: `${performance.artist.name} has been removed from your schedule.`,
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

  const handleAddToSchedule = () => {
    addToScheduleMutation.mutate(performance.id);
  };

  const handleRemoveFromSchedule = () => {
    removeFromScheduleMutation.mutate(performance.id);
  };

  // Format time range for display
  const formatTimeRange = (startTime: string, endTime: string) => {
    const start = format(new Date(startTime), "h:mm a");
    const end = format(new Date(endTime), "h:mm a");
    return `${start} - ${end}`;
  };

  const formatDate = (dateTime: string) => {
    return format(new Date(dateTime), "EEE, MMM d");
  };

  return (
    <Card className="relative">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg" data-testid={`text-artist-${performance.id}`}>
                {performance.artist?.name || 'Unknown Artist'}
              </h3>
              {performance.isHeadliner && (
                <Badge variant="default">Headliner</Badge>
              )}
            </div>
            {performance.artist?.bio && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {performance.artist.bio}
              </p>
            )}
          </div>
          
          {!isInSchedule ? (
            <Button
              size="sm"
              variant="outline"
              onClick={handleAddToSchedule}
              disabled={addToScheduleMutation.isPending}
              data-testid={`button-add-performance-${performance.id}`}
            >
              <Music className="h-4 w-4 mr-1" />
              {addToScheduleMutation.isPending ? 'Adding...' : 'Add'}
            </Button>
          ) : (
            <Button
              size="sm"
              variant="destructive"
              onClick={handleRemoveFromSchedule}
              disabled={removeFromScheduleMutation.isPending}
              data-testid={`button-remove-performance-${performance.id}`}
            >
              {removeFromScheduleMutation.isPending ? 'Removing...' : 'Remove'}
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="font-medium">
                {formatTimeRange(performance.startTime, performance.endTime)}
              </div>
              <div className="text-muted-foreground text-xs">
                {formatDate(performance.startTime)}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{performance.stage?.name || 'TBA'}</span>
          </div>

          <div className="flex items-center gap-2">
            {conflicts.length > 0 && (
              <div className="flex items-center gap-1 text-destructive">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-xs">Conflict</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}