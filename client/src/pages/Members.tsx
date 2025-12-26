import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertMemberSchema, type Member } from "@shared/schema";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Users, Search } from "lucide-react";
import { z } from "zod";

const createMemberSchema = insertMemberSchema;

export default function Members() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"create" | "browse">("browse");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const form = useForm<z.infer<typeof createMemberSchema>>({
    resolver: zodResolver(createMemberSchema),
    defaultValues: {
      fullName: "",
      category: "youth",
      email: "",
      phone: "",
      address: "",
      userId: user?.id,
    },
  });

  // Fetch all members
  const { data: members = [], isLoading } = useQuery({
    queryKey: ["/api/members"],
    queryFn: async () => {
      const res = await fetch("/api/members");
      return res.json() as Promise<Member[]>;
    },
  });

  // Create member mutation
  const createMutation = useMutation({
    mutationFn: async (data: z.infer<typeof createMemberSchema>) => {
      return apiRequest("POST", "/api/members", data);
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Member profile created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/members"] });
      form.reset();
      setActiveTab("browse");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create profile.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof createMemberSchema>) => {
    createMutation.mutate(data);
  };

  // Filter members by search and category
  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (member.email?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    const matchesCategory =
      filterCategory === "all" || member.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Group members by category
  const membersByCategory = {
    children: filteredMembers.filter((m) => m.category === "children"),
    youth: filteredMembers.filter((m) => m.category === "youth"),
    adult: filteredMembers.filter((m) => m.category === "adult"),
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 pt-28 pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <Card className="border-slate-200">
            <CardContent className="pt-6 text-center">
              <p className="text-slate-600">
                Please log in to view and create member profiles.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-slate-900">
              Member Profiles
            </h1>
          </div>
          <p className="text-slate-600">
            Create your profile and connect with other church members.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <Button
            variant={activeTab === "browse" ? "default" : "outline"}
            onClick={() => setActiveTab("browse")}
            data-testid="button-browse-members"
          >
            Browse Members
          </Button>
          <Button
            variant={activeTab === "create" ? "default" : "outline"}
            onClick={() => setActiveTab("create")}
            data-testid="button-create-profile"
          >
            Create Profile
          </Button>
        </div>

        {/* Create Profile Tab */}
        {activeTab === "create" && (
          <Card className="mb-8 border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle>Create Your Member Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="John Doe"
                            data-testid="input-fullname"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger data-testid="select-category">
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="children">Children</SelectItem>
                              <SelectItem value="youth">Youth</SelectItem>
                              <SelectItem value="adult">Adult</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="john@example.com"
                            data-testid="input-email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="+1 (555) 000-0000"
                            data-testid="input-phone"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="123 Main Street, City, State ZIP"
                            data-testid="textarea-address"
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
                    data-testid="button-submit-profile"
                    className="w-full"
                  >
                    {createMutation.isPending
                      ? "Creating..."
                      : "Create Profile"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        {/* Browse Members Tab */}
        {activeTab === "browse" && (
          <div className="space-y-6">
            {/* Search & Filter */}
            <Card className="border-slate-200 shadow-sm">
              <CardContent className="pt-6">
                <div className="flex flex-col gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <Input
                      placeholder="Search by name or email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      data-testid="input-search-members"
                      className="pl-10"
                    />
                  </div>

                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger data-testid="select-filter-category">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="children">Children</SelectItem>
                      <SelectItem value="youth">Youth</SelectItem>
                      <SelectItem value="adult">Adult</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {isLoading ? (
              <Card className="border-slate-200">
                <CardContent className="pt-6 text-center">
                  <p className="text-slate-500">Loading members...</p>
                </CardContent>
              </Card>
            ) : filteredMembers.length === 0 ? (
              <Card className="border-slate-200">
                <CardContent className="pt-6 text-center">
                  <p className="text-slate-500">
                    No members found. Be the first to create a profile!
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {/* Children Section */}
                {membersByCategory.children.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">
                      Children ({membersByCategory.children.length})
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {membersByCategory.children.map((member) => (
                        <MemberCard key={member.id} member={member} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Youth Section */}
                {membersByCategory.youth.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">
                      Youth ({membersByCategory.youth.length})
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {membersByCategory.youth.map((member) => (
                        <MemberCard key={member.id} member={member} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Adult Section */}
                {membersByCategory.adult.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">
                      Adult ({membersByCategory.adult.length})
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {membersByCategory.adult.map((member) => (
                        <MemberCard key={member.id} member={member} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function MemberCard({ member }: { member: Member }) {
  const categoryColors = {
    children: "bg-blue-100 text-blue-700",
    youth: "bg-purple-100 text-purple-700",
    adult: "bg-green-100 text-green-700",
  };

  return (
    <Card
      className="border-slate-200 hover-elevate"
      data-testid={`card-member-${member.id}`}
    >
      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-bold text-lg text-slate-900" data-testid={`text-name-${member.id}`}>
              {member.fullName}
            </h3>
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 capitalize ${categoryColors[member.category as keyof typeof categoryColors]}`}
              data-testid={`badge-category-${member.id}`}
            >
              {member.category}
            </span>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          {member.email && (
            <p className="text-slate-600" data-testid={`text-email-${member.id}`}>
              <span className="font-medium">Email:</span> {member.email}
            </p>
          )}
          {member.phone && (
            <p className="text-slate-600" data-testid={`text-phone-${member.id}`}>
              <span className="font-medium">Phone:</span> {member.phone}
            </p>
          )}
          {member.address && (
            <p className="text-slate-600 line-clamp-2" data-testid={`text-address-${member.id}`}>
              <span className="font-medium">Address:</span> {member.address}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
