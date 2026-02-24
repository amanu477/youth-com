import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertMemberSchema, type Member } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
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
import { Users, Search, User as UserIcon, Plus, Filter, Mail, Phone, MapPin, ExternalLink } from "lucide-react";
import { z } from "zod";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const createMemberSchema = insertMemberSchema;

export default function Members() {
  const { user } = useAuth();
  const { toast } = useToast();
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
      imageUrl: "",
      userId: user?.id ?? undefined,
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
    <div className="min-h-screen bg-slate-50/50 pt-28 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Hero Header */}
        <div className="relative mb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-2xl mb-4">
              <Users className="w-10 h-10 text-blue-600" />
            </div>
            <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
              Our Community
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Connecting and growing together as one family in Christ.
            </p>
          </motion.div>
        </div>

        <Tabs defaultValue="browse" className="w-full">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
            <TabsList className="bg-white border border-slate-200 p-1 h-auto shadow-sm">
              <TabsTrigger value="browse" className="px-6 py-2.5 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all">
                <Search className="w-4 h-4 mr-2" />
                Browse Members
              </TabsTrigger>
              <TabsTrigger value="create" className="px-6 py-2.5 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all">
                <Plus className="w-4 h-4 mr-2" />
                Add Member
              </TabsTrigger>
            </TabsList>

            <TabsContent value="browse" className="mt-0 w-full md:w-auto">
              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Search name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white border-slate-200 focus:ring-blue-500 rounded-xl"
                  />
                </div>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-full sm:w-48 bg-white border-slate-200 rounded-xl">
                    <Filter className="w-4 h-4 mr-2 text-slate-400" />
                    <SelectValue placeholder="Filter by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="children">Children</SelectItem>
                    <SelectItem value="youth">Youth</SelectItem>
                    <SelectItem value="adult">Adult</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
          </div>

          <TabsContent value="create" className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <Card className="max-w-2xl mx-auto border-none shadow-xl rounded-3xl overflow-hidden">
              <div className="h-2 bg-blue-600 w-full" />
              <CardHeader className="bg-white pt-8">
                <CardTitle className="text-2xl font-bold text-center">New Member Profile</CardTitle>
                <p className="text-slate-500 text-center">Fill in the details to join our growing directory.</p>
              </CardHeader>
              <CardContent className="p-8">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-semibold">Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter full name" className="rounded-xl border-slate-200" {...field} />
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
                            <FormLabel className="font-semibold">Category</FormLabel>
                            <FormControl>
                              <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger className="rounded-xl border-slate-200">
                                  <SelectValue placeholder="Select category" />
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
                    </div>

                    <FormField
                      control={form.control}
                      name="imageUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold">Profile Picture URL (Optional)</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="https://unsplash.com/photos/..." 
                              className="rounded-xl border-slate-200" 
                              {...field} 
                              value={field.value || ""} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-semibold">Email Address</FormLabel>
                            <FormControl>
                              <Input 
                                type="email" 
                                placeholder="example@email.com" 
                                className="rounded-xl border-slate-200" 
                                {...field} 
                                value={field.value || ""} 
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
                            <FormLabel className="font-semibold">Phone Number</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="+123 456 7890" 
                                className="rounded-xl border-slate-200" 
                                {...field} 
                                value={field.value || ""} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold">Residential Address</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Enter home address" 
                              className="rounded-xl border-slate-200 min-h-[100px]" 
                              {...field} 
                              value={field.value || ""} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      disabled={createMutation.isPending}
                      className="w-full bg-blue-600 hover:bg-blue-700 h-12 rounded-xl text-lg font-bold transition-all shadow-lg hover:shadow-blue-200"
                    >
                      {createMutation.isPending ? "Adding Member..." : "Complete Registration"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="browse" className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="bg-white rounded-3xl h-[400px] animate-pulse border border-slate-100 shadow-sm" />
                ))}
              </div>
            ) : filteredMembers.length === 0 ? (
              <Card className="border-dashed border-2 border-slate-200 bg-white/50 rounded-3xl">
                <CardContent className="py-20 text-center">
                  <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                    <Search className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">No members found</h3>
                  <p className="text-slate-500">Try adjusting your search or filter settings.</p>
                </CardContent>
              </Card>
            ) : (
              <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
              >
                <AnimatePresence>
                  {filteredMembers.map((member) => (
                    <MemberCard key={member.id} member={member} />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function MemberCard({ member }: { member: Member }) {
  const categoryConfig = {
    children: { color: "bg-cyan-100 text-cyan-700 border-cyan-200", label: "Children" },
    youth: { color: "bg-indigo-100 text-indigo-700 border-indigo-200", label: "Youth" },
    adult: { color: "bg-emerald-100 text-emerald-700 border-emerald-200", label: "Adult" },
  };

  const config = categoryConfig[member.category as keyof typeof categoryConfig] || categoryConfig.youth;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -8 }}
      className="h-full"
    >
      <Link href={`/members/${member.id}`}>
        <Card className="h-full border-none shadow-sm hover:shadow-xl transition-all duration-300 rounded-[2.5rem] overflow-hidden group cursor-pointer bg-white">
          <div className="relative h-40 bg-slate-100 overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-28 h-28 rounded-full border-4 border-white overflow-hidden shadow-lg bg-white z-10 transition-transform duration-500 group-hover:scale-110">
              {member.imageUrl ? (
                <img src={member.imageUrl} alt={member.fullName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-50">
                  <UserIcon className="w-12 h-12 text-slate-300" />
                </div>
              )}
            </div>
          </div>

          <CardContent className="pt-14 pb-6 px-6 text-center">
            <Badge variant="outline" className={`${config.color} mb-3 font-bold rounded-full border px-4 py-1`}>
              {config.label}
            </Badge>
            <h3 className="text-xl font-black text-slate-900 mb-4 line-clamp-1 group-hover:text-blue-600 transition-colors">
              {member.fullName}
            </h3>

            <div className="space-y-3 text-sm text-slate-600">
              {member.email && (
                <div className="flex items-center justify-center gap-2">
                  <Mail className="w-4 h-4 text-blue-500" />
                  <span className="truncate">{member.email}</span>
                </div>
              )}
              {member.phone && (
                <div className="flex items-center justify-center gap-2">
                  <Phone className="w-4 h-4 text-purple-500" />
                  <span>{member.phone}</span>
                </div>
              )}
              {member.address && (
                <div className="flex items-center justify-center gap-2">
                  <MapPin className="w-4 h-4 text-rose-500" />
                  <span className="truncate">{member.address}</span>
                </div>
              )}
            </div>
          </CardContent>

          <CardFooter className="px-6 pb-6 pt-0 border-none justify-center">
            <div className="text-blue-600 font-bold flex items-center gap-1 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
              View Profile <ExternalLink className="w-4 h-4" />
            </div>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  );
}
