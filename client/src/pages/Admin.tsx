import { useAuth } from "@/hooks/use-auth";
import { useUsers, useUpdatePermissions } from "@/hooks/use-users";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema, type InsertUser } from "@shared/routes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Shield, ShieldCheck, UserCog } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";

export default function Admin() {
  const { user } = useAuth();
  const { users, isLoading, createUser } = useUsers();
  const [open, setOpen] = useState(false);

  // Redirect if not admin
  if (user && user.role !== 'admin' && user.role !== 'system_admin') {
    window.location.href = "/dashboard";
    return null;
  }

  const form = useForm<InsertUser>({
    resolver: zodResolver(insertUserSchema),
    defaultValues: { username: "", password: "", role: "member" }
  });

  const onSubmit = (data: InsertUser) => {
    createUser.mutate(data, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-slate-800">Admin Dashboard</h1>
            <p className="text-slate-600">Manage users and system permissions.</p>
          </div>
          
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" /> Add User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New User</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl><Input type="password" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="member">Member</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                            {user?.role === 'system_admin' && (
                              <SelectItem value="system_admin">System Admin</SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={createUser.isPending}>
                    Create User
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="border-none shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCog className="w-5 h-5 text-slate-500" /> User Management
            </CardTitle>
            <CardDescription>
              View and manage registered users and their roles.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="p-8 text-center text-slate-500">Loading users...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Created At</TableHead>
                    {user?.role === 'system_admin' && <TableHead>Permissions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users?.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium">{u.username}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                          ${u.role === 'system_admin' ? 'bg-purple-100 text-purple-800' : 
                            u.role === 'admin' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                          {u.role.replace('_', ' ')}
                        </span>
                      </TableCell>
                      <TableCell className="text-slate-500">
                        {u.createdAt ? format(new Date(u.createdAt), "MMM d, yyyy") : '-'}
                      </TableCell>
                      {user?.role === 'system_admin' && (
                        <TableCell>
                          <PermissionEditor userId={u.id} currentPermissions={u.permissions || []} />
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function PermissionEditor({ userId, currentPermissions }: { userId: number, currentPermissions: string[] }) {
  const updatePermissions = useUpdatePermissions();
  
  // Available permissions based on schema context
  const allPermissions = ['create_announcement', 'delete_announcement', 'manage_members'];

  const handleToggle = (perm: string) => {
    const newPerms = currentPermissions.includes(perm)
      ? currentPermissions.filter(p => p !== perm)
      : [...currentPermissions, perm];
    
    updatePermissions.mutate({ id: userId, permissions: newPerms });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8">
          <ShieldCheck className="w-4 h-4 text-slate-400 hover:text-primary" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Permissions</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {allPermissions.map((perm) => (
            <div key={perm} className="flex items-center space-x-2">
              <Checkbox 
                id={`perm-${perm}`} 
                checked={currentPermissions.includes(perm)}
                onCheckedChange={() => handleToggle(perm)}
              />
              <label htmlFor={`perm-${perm}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize">
                {perm.replace('_', ' ')}
              </label>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
