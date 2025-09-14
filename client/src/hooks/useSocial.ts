import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

// Types
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImageUrl?: string;
}

interface SocialAttendee extends User {
  isFriend: boolean;
  mutualFriends?: number;
}

interface EventAttendeesResponse {
  totalAttendees: number;
  friendsAttending: SocialAttendee[];
  otherAttendees: SocialAttendee[];
}

// Get event attendees with social context
export function useEventAttendees(eventId: string) {
  return useQuery<EventAttendeesResponse>({
    queryKey: ["eventAttendees", eventId],
    queryFn: async () => {
      const res = await fetch(`/api/events/${eventId}/attendees`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch attendees");
      return res.json();
    },
    enabled: !!eventId,
  });
}

// Get user connections (friends)
export function useUserConnections() {
  return useQuery<User[]>({
    queryKey: ["userConnections"],
    queryFn: async () => {
      const res = await fetch("/api/user/connections", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch connections");
      return res.json();
    },
  });
}

// Discover users
export function useDiscoverUsers(search?: string) {
  return useQuery<User[]>({
    queryKey: ["discoverUsers", search],
    queryFn: async () => {
      const res = await fetch(`/api/users${search ? `?search=${search}` : ""}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch users");
      return res.json();
    },
  });
}

// Follow/unfollow mutations
export function useFollowUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (followingId: string) => {
      const res = await fetch("/api/user/follow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ followingId }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to follow user");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userConnections"] });
      queryClient.invalidateQueries({ queryKey: ["eventAttendees"] });
      queryClient.invalidateQueries({ queryKey: ["discoverUsers"] });
    },
  });
}

export function useUnfollowUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (followingId: string) => {
      const res = await fetch(`/api/user/follow/${followingId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to unfollow user");
      return res.text();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userConnections"] });
      queryClient.invalidateQueries({ queryKey: ["eventAttendees"] });
      queryClient.invalidateQueries({ queryKey: ["discoverUsers"] });
    },
  });
}