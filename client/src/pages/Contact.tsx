import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Mail } from "lucide-react";
import { useTranslation } from "@/context/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function Contact() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      toast({
        title: "Message Sent!",
        description: "Thank you for reaching out. We will get back to you soon.",
      });
      (e.target as HTMLFormElement).reset();
    }, 1000);
  };

  return (
    <div className="pt-20 min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-display font-bold mb-4">{t.contact.title}</h1>
          <p className="text-slate-400 text-lg">{t.contact.subtitle}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-20">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Info Cards */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-none shadow-lg">
              <CardContent className="p-8 flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 flex-shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-800 mb-1">{t.contact.visit}</h3>
                  <p className="text-slate-600">123 Faith Avenue<br/>Cityville, ST 12345</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg">
              <CardContent className="p-8 flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 flex-shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-800 mb-1">{t.contact.call}</h3>
                  <p className="text-slate-600">(555) 123-4567</p>
                  <p className="text-xs text-slate-400 mt-1">Mon-Fri, 9am-5pm</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg">
              <CardContent className="p-8 flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 flex-shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-800 mb-1">{t.contact.email}</h3>
                  <p className="text-slate-600">youth@church.com</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="border-none shadow-xl h-full">
              <CardContent className="p-8 md:p-12">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">{t.contact.sendMessage}</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">{t.contact.firstName}</label>
                      <Input required placeholder="Jane" className="h-12" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">{t.contact.lastName}</label>
                      <Input required placeholder="Doe" className="h-12" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">{t.contact.emailAddress}</label>
                    <Input required type="email" placeholder="jane@example.com" className="h-12" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">{t.contact.message}</label>
                    <Textarea required placeholder="How can we help you?" className="min-h-[150px]" />
                  </div>
                  <Button type="submit" size="lg" className="w-full md:w-auto h-12 px-8" disabled={sending}>
                    {sending ? "Sending..." : t.contact.send}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
