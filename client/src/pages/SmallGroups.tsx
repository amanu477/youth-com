import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertGroupSchema, type Group } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Users, BookOpen } from "lucide-react";
import { z } from "zod";

export default function SmallGroups() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"browse" | "create">("browse");
  const [expandedGroupId, setExpandedGroupId] = useState<number | null>(null);

  const form = useForm<z.infer<typeof insertGroupSchema>>({
    resolver: zodResolver(insertGroupSchema),
    defaultValues: {
      name: "",
      description: "",
      leaderId: user?.id,
    },
  });

  // Fetch all groups
  const { data: groups = [], isLoading } = useQuery({
    queryKey: ["/api/groups"],
    queryFn: async () => {
      const res = await fetch("/api/groups");
      return res.json() as Promise<Group[]>;
    },
  });

  // Fetch group members for expanded group
  const { data: groupMembers = [] } = useQuery({
    queryKey: ["/api/groups", expandedGroupId, "members"],
    queryFn: async () => {
      if (!expandedGroupId) return [];
      const res = await fetch(`/api/groups/${expandedGroupId}/members`);
      return res.json();
    },
    enabled: !!expandedGroupId,
  });

  // Create group mutation (admin only)
  const createMutation = useMutation({
    mutationFn: async (data: z.infer<typeof insertGroupSchema>) => {
      return apiRequest("POST", "/api/groups", data);
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Small group created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/groups"] });
      form.reset();
      setActiveTab("browse");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create group.",
        variant: "destructive",
      });
    },
  });

  // Join group mutation
  const joinMutation = useMutation({
    mutationFn: async (groupId: number) => {
      // First, get current user's member profile
      const membersRes = await fetch("/api/members");
      const members = await membersRes.json();
      const userMember = members.find(
        (m: any) => m.userId === user?.id
      );

      if (!userMember) {
        throw new Error("Please create a member profile first");
      }

      return apiRequest("POST", `/api/groups/${groupId}/members`, {
        memberId: userMember.id,
      });
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "You've joined the group.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/groups"] });
      if (expandedGroupId) {
        queryClient.invalidateQueries({
          queryKey: ["/api/groups", expandedGroupId, "members"],
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to join group.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof insertGroupSchema>) => {
    createMutation.mutate(data);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 pt-28 pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <Card className="border-slate-200">
            <CardContent className="pt-6 text-center">
              <p className="text-slate-600">
                Please log in to view and join small groups.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const isAdmin = user.role !== "member";

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-8 h-8 text-purple-600" />
            <h1 className="text-4xl font-bold text-slate-900">
              Bible Study Groups
            </h1>
          </div>
          <p className="text-slate-600">
            Join small groups to grow together and study God's word.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <Button
            variant={activeTab === "browse" ? "default" : "outline"}
            onClick={() => setActiveTab("browse")}
            data-testid="button-browse-groups"
          >
            Browse Groups
          </Button>
          {isAdmin && (
            <Button
              variant={activeTab === "create" ? "default" : "outline"}
              onClick={() => setActiveTab("create")}
              data-testid="button-create-group"
            >
              Create Group
            </Button>
          )}
        </div>

        {/* Create Group Tab */}
        {activeTab === "create" && isAdmin && (
          <Card className="mb-8 border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle>Create New Small Group</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Group Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Genesis Study Group"
                            data-testid="input-group-name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe the group's focus and meeting details..."
                            data-testid="textarea-group-description"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={createMutation.isPending}
                    data-testid="button-submit-group"
                    className="w-full"
                  >
                    {createMutation.isPending
                      ? "Creating..."
                      : "Create Group"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        {/* Browse Groups Tab */}
        {activeTab === "browse" && (
          <div>
            {isLoading ? (
              <Card className="border-slate-200">
                <CardContent className="pt-6 text-center">
                  <p className="text-slate-500">Loading groups...</p>
                </CardContent>
              </Card>
            ) : groups.length === 0 ? (
              <Card className="border-slate-200">
                <CardContent className="pt-6 text-center">
                  <p className="text-slate-500">
                    No groups available yet. Check back soon!
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {groups.map((group) => (
                  <Card
                    key={group.id}
                    className="border-slate-200 hover-elevate cursor-pointer transition-all"
                    onClick={() =>
                      setExpandedGroupId(
                        expandedGroupId === group.id ? null : group.id
                      )
                    }
                    data-testid={`card-group-${group.id}`}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-xl" data-testid={`text-group-name-${group.id}`}>
                            {group.name}
                          </CardTitle>
                          <p className="text-sm text-slate-500 mt-2 flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {groupMembers.length} members
                          </p>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <p
                        className="text-slate-700 line-clamp-3"
                        data-testid={`text-group-description-${group.id}`}
                      >
                        {group.description}
                      </p>

                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          joinMutation.mutate(group.id);
                        }}
                        disabled={joinMutation.isPending}
                        data-testid={`button-join-group-${group.id}`}
                        className="w-full"
                      >
                        {joinMutation.isPending ? "Joining..." : "Join Group"}
                      </Button>
                    </CardContent>

                    {/* Expanded Details */}
                    {expandedGroupId === group.id && (
                      <div className="border-t border-slate-200 p-6 bg-slate-50">
                        <h4 className="font-bold text-slate-900 mb-4">
                          Group Members
                        </h4>
                        {groupMembers.length === 0 ? (
                          <p className="text-slate-600 text-sm">
                            No members yet. Be the first to join!
                          </p>
                        ) : (
                          <div className="space-y-3">
                            {groupMembers.map((gm: any) => (
                              <div
                                key={gm.id}
                                className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-100"
                                data-testid={`item-member-${gm.member.id}`}
                              >
                                <div>
                                  <p
                                    className="font-medium text-slate-900"
                                    data-testid={`text-member-name-${gm.member.id}`}
                                  >
                                    {gm.member.fullName}
                                  </p>
                                  <p className="text-xs text-slate-500 capitalize">
                                    {gm.member.category}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
