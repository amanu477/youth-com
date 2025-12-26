import { motion } from "framer-motion";
import { ArrowRight, Calendar, Users, Heart } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Home() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-slate-900 text-white">
        <div className="absolute inset-0 z-0">
          {/* Unsplash: Excited group of young people jumping on a beach at sunset */}
          <img 
            src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            alt="Youth Group Fun"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-900/50" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="max-w-3xl"
          >
            <motion.h1 variants={item} className="text-5xl md:text-7xl font-display font-bold mb-6 leading-tight">
              Belong. <span className="text-blue-400">Believe.</span> <br/>
              Become.
            </motion.h1>
            <motion.p variants={item} className="text-xl md:text-2xl text-slate-300 mb-8 leading-relaxed max-w-2xl">
              A community where every young person is welcome, valued, and empowered to live out their faith.
            </motion.p>
            <motion.div variants={item} className="flex flex-col sm:flex-row gap-4">
              <Link href="/about">
                <Button size="lg" className="rounded-full text-lg px-8 py-6 bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30">
                  Join Our Family <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/announcements">
                <Button size="lg" variant="outline" className="rounded-full text-lg px-8 py-6 text-white border-white/30 hover:bg-white/10 hover:text-white backdrop-blur-sm">
                  Upcoming Events
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white relative">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-slate-900 to-white opacity-5" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-slate-800 mb-4">Why YouthConnect?</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">More than just a meeting, we are a movement.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              whileHover={{ y: -10 }}
              className="p-8 rounded-2xl bg-blue-50 border border-blue-100"
            >
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-slate-800">Community</h3>
              <p className="text-slate-600 text-lg">Find authentic friendships and mentors who will walk alongside you in life.</p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -10 }}
              className="p-8 rounded-2xl bg-cyan-50 border border-cyan-100"
            >
              <div className="w-14 h-14 bg-cyan-100 rounded-xl flex items-center justify-center text-cyan-600 mb-6">
                <Calendar className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-slate-800">Events</h3>
              <p className="text-slate-600 text-lg">From camps to concert nights, there's always something exciting happening.</p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -10 }}
              className="p-8 rounded-2xl bg-orange-50 border border-orange-100"
            >
              <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 mb-6">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-slate-800">Service</h3>
              <p className="text-slate-600 text-lg">Opportunities to make a tangible difference in our local community.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Image Showcase */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="grid grid-cols-2 gap-4">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="space-y-4 pt-12"
              >
                {/* Unsplash: People sitting in circle reading bible */}
                <img src="https://images.unsplash.com/photo-1543335502-0e9bd2289650?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Bible Study" className="rounded-2xl shadow-lg w-full h-64 object-cover" />
                {/* Unsplash: Concert worship */}
                <img src="https://images.unsplash.com/photo-1506459225024-1428097a7e18?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Worship" className="rounded-2xl shadow-lg w-full h-48 object-cover" />
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="space-y-4"
              >
                {/* Unsplash: Teens laughing outdoors */}
                <img src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Friends" className="rounded-2xl shadow-lg w-full h-48 object-cover" />
                {/* Unsplash: Group serving food */}
                <img src="https://images.unsplash.com/photo-1593113598332-cd288d649433?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Service" className="rounded-2xl shadow-lg w-full h-64 object-cover" />
              </motion.div>
            </div>
            
            <div>
              <h2 className="text-4xl font-display font-bold text-slate-800 mb-6">Life is Better Together</h2>
              <p className="text-lg text-slate-600 mb-6">
                Whether you're exploring faith for the first time or looking for a place to grow deeper, you belong here. We are a diverse family united by love and purpose.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-slate-700 text-lg">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  Weekly Youth Nights (Fridays @ 7PM)
                </li>
                <li className="flex items-center gap-3 text-slate-700 text-lg">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  Small Group Bible Studies
                </li>
                <li className="flex items-center gap-3 text-slate-700 text-lg">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  Monthly Social Events
                </li>
              </ul>
              <Link href="/about">
                <Button variant="default" size="lg" className="rounded-full px-8">Learn More</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
