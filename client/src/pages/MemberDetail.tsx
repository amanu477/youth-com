import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Member, insertMemberSchema } from "@shared/schema";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { ArrowLeft, Loader2, User, Trash2, Save } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";

export default function MemberDetail() {
  const [, params] = useRoute("/members/:id");
  const id = params?.id;
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  const { data: member, isLoading, error } = useQuery<Member>({
    queryKey: [`/api/members/${id}`],
  });

  const form = useForm({
    resolver: zodResolver(insertMemberSchema.partial()),
    defaultValues: {
      fullName: member?.fullName || "",
      category: member?.category || "youth",
      email: member?.email || "",
      phone: member?.phone || "",
      address: member?.address || "",
      imageUrl: member?.imageUrl || "",
      userId: member?.userId ?? undefined,
    },
  });

  // Update form values when member data is loaded
  useEffect(() => {
    if (member) {
      form.reset({
        fullName: member.fullName,
        category: member.category,
        email: member.email || "",
        phone: member.phone || "",
        address: member.address || "",
        imageUrl: member.imageUrl || "",
        userId: member.userId ?? undefined,
      });
    }
  }, [member, form]);

  const updateMutation = useMutation({
    mutationFn: async (data: Partial<Member>) => {
      return apiRequest("PATCH", `/api/members/${id}`, data);
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Member updated successfully" });
      queryClient.invalidateQueries({ queryKey: [`/api/members/${id}`] });
      setIsEditing(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("DELETE", `/api/members/${id}`);
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Member deleted" });
      setLocation("/members");
    },
  });

  const canManage = user?.role === "admin" || user?.role === "system_admin";

  if (isLoading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin" /></div>;
  if (error || !member) return <div className="p-12 text-center">Member not found</div>;

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        <Link href="/members">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Members
          </Button>
        </Link>

        <Card className="overflow-hidden">
          <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
            {member.imageUrl ? (
              <img src={member.imageUrl} alt={member.fullName} className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-lg" />
            ) : (
              <div className="w-32 h-32 rounded-full border-4 border-white bg-white flex items-center justify-center shadow-lg">
                <User className="w-16 h-16 text-slate-300" />
              </div>
            )}
          </div>

          <CardHeader className="pt-12 text-center">
            <CardTitle className="text-3xl">{member.fullName}</CardTitle>
            <p className="text-slate-500 capitalize">{member.category}</p>
          </CardHeader>

          <CardContent>
            {isEditing ? (
              <Form {...form}>
                <form onSubmit={form.handleSubmit((data) => updateMutation.mutate(data))} className="space-y-4">
                  <FormField control={form.control} name="fullName" render={({ field }) => (
                    <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} value={field.value || ""} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="imageUrl" render={({ field }) => (
                    <FormItem><FormLabel>Profile Picture URL</FormLabel><FormControl><Input {...field} placeholder="https://..." value={field.value || ""} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="category" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || "youth"}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="children">Children</SelectItem>
                          <SelectItem value="youth">Youth</SelectItem>
                          <SelectItem value="adult">Adult</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem><FormLabel>Email</FormLabel><FormControl><Input {...field} value={field.value || ""} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem><FormLabel>Phone</FormLabel><FormControl><Input {...field} value={field.value || ""} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="address" render={({ field }) => (
                    <FormItem><FormLabel>Address</FormLabel><FormControl><Textarea {...field} value={field.value || ""} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <div className="flex gap-2 justify-end">
                    <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                    <Button type="submit" disabled={updateMutation.isPending}><Save className="mr-2 h-4 w-4" /> Save Changes</Button>
                  </div>
                </form>
              </Form>
            ) : (
              <div className="grid md:grid-cols-2 gap-6 mt-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-slate-500">Contact Information</h4>
                    <p className="mt-1"><strong>Email:</strong> {member.email || "N/A"}</p>
                    <p className="mt-1"><strong>Phone:</strong> {member.phone || "N/A"}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-slate-500">Address</h4>
                    <p className="mt-1">{member.address || "N/A"}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2 justify-end">
                  {canManage && (
                    <>
                      <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                      <Button variant="destructive" onClick={() => { if(confirm("Are you sure?")) deleteMutation.mutate(); }} disabled={deleteMutation.isPending}>
                        <Trash2 className="mr-2 h-4 w-4" /> Delete Member
                      </Button>
                    </>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
