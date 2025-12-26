import { useAuth } from "@/hooks/use-auth";
import { useMembers } from "@/hooks/use-members";
import { useAnnouncements } from "@/hooks/use-content";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Bell, Calendar, LogOut } from "lucide-react";
import { format } from "date-fns";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { announcements } = useAnnouncements();
  
  if (!user) {
    window.location.href = "/login";
    return null;
  }

  // Determine user's latest updates (mock logic for now)
  const recentUpdates = announcements?.slice(0, 3) || [];

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Welcome Header */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 mb-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-blue-200">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-slate-800">Hello, {user.username}!</h1>
              <p className="text-slate-500 text-lg">Welcome back to your personal dashboard.</p>
            </div>
          </div>
          <Button onClick={() => logout()} variant="outline" className="border-slate-200 hover:bg-slate-50">
            <LogOut className="w-4 h-4 mr-2" /> Sign Out
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Quick Stats/Actions */}
          <div className="md:col-span-1 space-y-6">
            <Card className="border-none shadow-md bg-white overflow-hidden">
              <div className="h-2 bg-blue-500" />
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-500" /> My Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-1">Role</p>
                    <p className="font-semibold text-slate-700 capitalize">{user.role}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-1">Member Since</p>
                    <p className="font-semibold text-slate-700">{format(new Date(user.createdAt || new Date()), "MMM yyyy")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md bg-white overflow-hidden">
              <div className="h-2 bg-purple-500" />
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-500" /> Next Event
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6">
                  <p className="text-3xl font-bold text-slate-800 mb-1">Friday</p>
                  <p className="text-slate-500 mb-4">7:00 PM • Youth Hall</p>
                  <Button className="w-full bg-purple-500 hover:bg-purple-600">I'm Coming!</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Activity Feed */}
          <div className="md:col-span-2">
            <Card className="border-none shadow-md bg-white h-full">
              <CardHeader className="border-b border-slate-100">
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-orange-500" /> Recent Activity & Updates
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {recentUpdates.length > 0 ? (
                  <div className="divide-y divide-slate-100">
                    {recentUpdates.map((update) => (
                      <div key={update.id} className="p-6 hover:bg-slate-50 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-lg text-slate-800">{update.title}</h3>
                          <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
                            {format(new Date(update.createdAt), "MMM d")}
                          </span>
                        </div>
                        <p className="text-slate-600 line-clamp-2">{update.content}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center text-slate-400">
                    No recent updates to show.
                  </div>
                )}
                <div className="p-4 border-t border-slate-100 text-center">
                  <a href="/announcements" className="text-blue-500 font-bold hover:underline text-sm">View All Announcements</a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
