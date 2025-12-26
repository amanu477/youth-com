import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type InsertMember } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useMembers() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: members, isLoading } = useQuery({
    queryKey: [api.members.list.path],
    queryFn: async () => {
      const res = await fetch(api.members.list.path);
      if (!res.ok) throw new Error("Failed to fetch members");
      return api.members.list.responses[200].parse(await res.json());
    },
  });

  const createMember = useMutation({
    mutationFn: async (data: InsertMember) => {
      const res = await fetch(api.members.create.path, {
        method: api.members.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create member profile");
      return api.members.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.members.list.path] });
      toast({ title: "Profile Added", description: "Member profile created successfully." });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  });

  return { members, isLoading, createMember };
}
