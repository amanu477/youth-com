import { useAnnouncements, useComments } from "@/hooks/use-content";
import { useAuth } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertAnnouncementSchema, insertCommentSchema, type InsertAnnouncement, type InsertComment } from "@shared/routes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { MessageSquare, Calendar, User, Plus, Image as ImageIcon } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { z } from "zod";
import { useTranslation } from "@/components/Navigation";

export default function Announcements() {
  const { announcements, isLoading, createAnnouncement } = useAnnouncements();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  // Form for new announcement
  const form = useForm<Omit<InsertAnnouncement, 'authorId'>>({
    resolver: zodResolver(insertAnnouncementSchema.omit({ authorId: true })),
    defaultValues: { title: "", content: "", imageUrl: "" }
  });

  const onSubmit = (data: Omit<InsertAnnouncement, 'authorId'>) => {
    createAnnouncement.mutate(data, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
      }
    });
  };

  if (isLoading) return <div className="pt-32 text-center text-slate-500">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-display font-bold text-slate-800">{t.announcements.title}</h1>
            <p className="text-slate-600 mt-2">{t.announcements.subtitle}</p>
          </div>

          {user && (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="rounded-full bg-primary hover:bg-primary/90 shadow-lg shadow-blue-500/20">
                  <Plus className="w-4 h-4 mr-2" /> {t.announcements.postNew}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>{t.announcements.createTitle}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Event Title" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="imageUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Image URL (Optional)</FormLabel>
                          <FormControl>
                            <div className="flex gap-2">
                              <Input placeholder="https://..." {...field} value={field.value || ""} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Content</FormLabel>
                          <FormControl>
                            <Textarea placeholder="What's happening?" className="min-h-[150px]" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" disabled={createAnnouncement.isPending}>
                      {createAnnouncement.isPending ? "Posting..." : t.announcements.post}
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <div className="space-y-8">
          {announcements?.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-slate-100">
              <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-700">{t.announcements.noAnnouncements}</h3>
              <p className="text-slate-500">{t.announcements.checkBack}</p>
            </div>
          ) : (
            announcements?.map((item) => (
              <AnnouncementCard key={item.id} announcement={item} currentUser={user} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function AnnouncementCard({ announcement, currentUser }: { announcement: any, currentUser: any }) {
  const { comments, createComment } = useComments(announcement.id);
  const [showComments, setShowComments] = useState(false);
  const { t } = useTranslation();

  // Simple comment form state
  const [commentText, setCommentText] = useState("");

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    
    createComment.mutate(
      { 
        content: commentText, 
        announcementId: announcement.id,
        parentId: null 
      }, 
      {
        onSuccess: () => setCommentText("")
      }
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
      {announcement.imageUrl && (
        <div className="w-full h-64 overflow-hidden">
          <img 
            src={announcement.imageUrl} 
            alt={announcement.title} 
            className="w-full h-full object-cover transition-transform hover:scale-105"
          />
        </div>
      )}
      <div className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
            {announcement.author.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-bold text-slate-800">{announcement.author.username}</p>
            <p className="text-sm text-slate-500">
              {announcement.createdAt ? format(new Date(announcement.createdAt as Date), "MMM d, yyyy • h:mm a") : ""}
            </p>
          </div>
        </div>

        <h3 className="text-2xl font-bold text-slate-800 mb-4">{announcement.title}</h3>
        <div className="prose prose-blue max-w-none text-slate-600 mb-6">
          <p className="whitespace-pre-wrap">{announcement.content}</p>
        </div>

        <div className="flex items-center pt-6 border-t border-slate-50">
          <button 
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors font-medium"
          >
            <MessageSquare className="w-5 h-5" />
            {comments?.length || 0} {t.announcements.comments}
          </button>
        </div>
      </div>

      {showComments && (
        <div className="bg-slate-50 p-8 border-t border-slate-100">
          {currentUser ? (
            <form onSubmit={handleComment} className="flex gap-4 mb-8">
              <div className="flex-1">
                <Input 
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder={t.announcements.writeComment} 
                  className="bg-white"
                />
              </div>
              <Button type="submit" disabled={!commentText.trim()}>{t.announcements.post}</Button>
            </form>
          ) : (
            <div className="text-center p-4 mb-6 bg-blue-50/50 rounded-lg text-slate-600">
              {t.announcements.loginToComment} <a href="/login" className="text-blue-600 font-bold hover:underline">log in</a>
            </div>
          )}

          <div className="space-y-6">
            {comments?.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 flex-shrink-0">
                  {comment.author.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-slate-100">
                    <p className="font-bold text-sm text-slate-800 mb-1">{comment.author.username}</p>
                    <p className="text-slate-600">{comment.content}</p>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 ml-2">
                    {format(new Date(comment.createdAt), "MMM d, h:mm a")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
