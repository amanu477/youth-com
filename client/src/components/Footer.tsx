import { Facebook, Instagram, Youtube, Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold">Y</div>
              <span className="font-display font-bold text-2xl">YouthConnect</span>
            </div>
            <p className="text-slate-400 text-lg leading-relaxed mb-6 max-w-md">
              A vibrant community dedicated to growing in faith, building lasting friendships, and making a positive impact in our world.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-pink-600 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-red-600 transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-6 text-blue-400">Quick Links</h3>
            <ul className="space-y-4 text-slate-400">
              <li><a href="/about" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="/announcements" className="hover:text-white transition-colors">Announcements</a></li>
              <li><a href="/groups" className="hover:text-white transition-colors">Small Groups</a></li>
              <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-6 text-blue-400">Visit Us</h3>
            <ul className="space-y-4 text-slate-400">
              <li className="flex gap-3 items-start">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-1" />
                <span>123 Faith Avenue<br/>Cityville, ST 12345</span>
              </li>
              <li className="flex gap-3 items-center">
                <Phone className="w-5 h-5 flex-shrink-0" />
                <span>(555) 123-4567</span>
              </li>
              <li className="flex gap-3 items-center">
                <Mail className="w-5 h-5 flex-shrink-0" />
                <span>youth@church.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800 pt-8 text-center text-slate-500">
          <p>© {new Date().getFullYear()} YouthConnect Church. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
