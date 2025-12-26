import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Menu, X, Shield, LogIn, User } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/announcements", label: "Announcements" },
    { href: "/members", label: "Members" },
    { href: "/groups", label: "Groups" },
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact Us" },
  ];

  return (
    <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-md border-b border-blue-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-2 group cursor-pointer">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl group-hover:scale-110 transition-transform">
              Y
            </div>
            <span className="font-display font-bold text-2xl text-slate-800 group-hover:text-primary transition-colors">
              YouthConnect
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={`font-medium text-lg transition-colors hover:text-primary ${
                  location === link.href ? "text-primary font-bold" : "text-slate-600"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {user ? (
              <div className="flex items-center gap-4 ml-4 pl-4 border-l border-slate-200">
                <Link href={user.role === 'member' ? "/dashboard" : "/admin"}>
                  <Button variant="ghost" className="font-semibold text-slate-700">
                    {user.role === 'member' ? <User className="w-4 h-4 mr-2"/> : <Shield className="w-4 h-4 mr-2"/>}
                    {user.role === 'member' ? "Dashboard" : "Admin"}
                  </Button>
                </Link>
                <Button onClick={() => logout()} variant="outline" className="rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-white">
                  Log Out
                </Button>
              </div>
            ) : (
              <Link href="/login">
                <Button className="rounded-full px-6 bg-primary hover:bg-primary/90 shadow-lg shadow-blue-500/20">
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 hover:text-primary p-2 transition-colors"
            >
              {isOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-blue-100 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 rounded-lg font-medium text-lg ${
                    location === link.href 
                      ? "bg-blue-50 text-primary" 
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              
              <div className="pt-4 mt-4 border-t border-slate-100">
                {user ? (
                  <>
                    <Link href={user.role === 'member' ? "/dashboard" : "/admin"} onClick={() => setIsOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start text-lg mb-2">
                        {user.role === 'member' ? "User Dashboard" : "Admin Panel"}
                      </Button>
                    </Link>
                    <Button onClick={() => { logout(); setIsOpen(false); }} variant="destructive" className="w-full">
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    <Button className="w-full text-lg py-6">Sign In</Button>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
