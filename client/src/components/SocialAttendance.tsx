import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, UserPlus, UserCheck } from "lucide-react";

interface Attendee {
  id: string;
  name: string;
  avatar?: string;
  isFriend: boolean;
  mutualFriends?: number;
}

interface SocialAttendanceProps {
  eventName: string;
  totalAttendees: number;
  friendsAttending: Attendee[];
  otherAttendees: Attendee[];
  onFollowUser: (userId: string) => void;
  onViewAllAttendees: () => void;
}

export function SocialAttendance({
  eventName,
  totalAttendees,
  friendsAttending,
  otherAttendees,
  onFollowUser,
  onViewAllAttendees,
}: SocialAttendanceProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-xl font-semibold" data-testid="text-attendance-title">
          Who's Going
        </h2>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span data-testid="text-total-attendees">{totalAttendees.toLocaleString()} attending</span>
        </div>
      </div>

      {/* Friends Attending */}
      {friendsAttending.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <UserCheck className="h-5 w-5 text-primary" />
              Friends Going
              <Badge variant="secondary">{friendsAttending.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {friendsAttending.map((friend) => (
                <div
                  key={friend.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                  data-testid={`friend-attendee-${friend.id}`}
                >
                  <Avatar>
                    <AvatarImage src={friend.avatar} />
                    <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate" data-testid={`text-friend-name-${friend.id}`}>
                      {friend.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Friend
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Discover People */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <UserPlus className="h-5 w-5 text-primary" />
            Discover Festival Goers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {otherAttendees.slice(0, 6).map((attendee) => (
              <div
                key={attendee.id}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                data-testid={`other-attendee-${attendee.id}`}
              >
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={attendee.avatar} />
                    <AvatarFallback>{attendee.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium" data-testid={`text-attendee-name-${attendee.id}`}>
                      {attendee.name}
                    </div>
                    {attendee.mutualFriends ? (
                      <div className="text-sm text-muted-foreground">
                        {attendee.mutualFriends} mutual friend{attendee.mutualFriends !== 1 ? 's' : ''}
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground">
                        Also attending {eventName}
                      </div>
                    )}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onFollowUser(attendee.id)}
                  data-testid={`button-follow-${attendee.id}`}
                >
                  {attendee.isFriend ? "Following" : "Follow"}
                </Button>
              </div>
            ))}
            
            {otherAttendees.length > 6 && (
              <Button
                variant="outline"
                className="w-full"
                onClick={onViewAllAttendees}
                data-testid="button-view-all-attendees"
              >
                View All {totalAttendees.toLocaleString()} Attendees
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Empty State */}
      {friendsAttending.length === 0 && otherAttendees.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <div className="text-lg font-medium mb-2">No connections yet</div>
            <p className="text-muted-foreground text-sm">
              Be the first of your friends to attend {eventName}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}