import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Admin analytics hook
export function useAdminAnalytics() {
  return useQuery({
    queryKey: ["adminAnalytics"],
    queryFn: async () => {
      const res = await fetch("/api/admin/analytics", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch analytics");
      return res.json();
    },
  });
}

// Admin users hook
export function useAdminUsers() {
  return useQuery({
    queryKey: ["adminUsers"],
    queryFn: async () => {
      const res = await fetch("/api/admin/users", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch users");
      return res.json();
    },
  });
}

// Admin events hook (all events, not just published)
export function useAdminEvents() {
  return useQuery({
    queryKey: ["adminEvents"],
    queryFn: async () => {
      const res = await fetch("/api/events?admin=true", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch events");
      return res.json();
    },
  });
}

// Update user status mutation
export function useUpdateUserStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, isActive }: { userId: string; isActive: boolean }) => {
      const res = await fetch(`/api/admin/users/${userId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update user status");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      queryClient.invalidateQueries({ queryKey: ["adminAnalytics"] });
    },
  });
}

// Create event mutation
export function useCreateEvent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (eventData: any) => {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create event");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminEvents"] });
      queryClient.invalidateQueries({ queryKey: ["adminAnalytics"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}

// Update event mutation
export function useUpdateEvent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ eventId, eventData }: { eventId: string; eventData: any }) => {
      const res = await fetch(`/api/events/${eventId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update event");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminEvents"] });
      queryClient.invalidateQueries({ queryKey: ["adminAnalytics"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}

// Delete event mutation
export function useDeleteEvent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (eventId: string) => {
      const res = await fetch(`/api/events/${eventId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete event");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminEvents"] });
      queryClient.invalidateQueries({ queryKey: ["adminAnalytics"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}