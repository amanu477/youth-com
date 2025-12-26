import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type InsertAnnouncement, type InsertComment } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useAnnouncements() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: announcements, isLoading } = useQuery({
    queryKey: [api.announcements.list.path],
    queryFn: async () => {
      const res = await fetch(api.announcements.list.path);
      if (!res.ok) throw new Error("Failed to fetch announcements");
      return api.announcements.list.responses[200].parse(await res.json());
    },
  });

  const createAnnouncement = useMutation({
    mutationFn: async (data: Omit<InsertAnnouncement, 'authorId'>) => {
      const res = await fetch(api.announcements.create.path, {
        method: api.announcements.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create announcement");
      return api.announcements.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.announcements.list.path] });
      toast({ title: "Posted!", description: "Announcement is live." });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  });

  return { announcements, isLoading, createAnnouncement };
}

export function useComments(announcementId: number) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const queryKey = [api.comments.list.path, announcementId];
  
  const { data: comments, isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      const url = buildUrl(api.comments.list.path, { id: announcementId });
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch comments");
      return api.comments.list.responses[200].parse(await res.json());
    },
    enabled: !!announcementId,
  });

  const createComment = useMutation({
    mutationFn: async (data: Omit<InsertComment, 'authorId'>) => {
      const res = await fetch(api.comments.create.path, {
        method: api.comments.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to post comment");
      return api.comments.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast({ title: "Comment added" });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  });

  return { comments, isLoading, createComment };
}
