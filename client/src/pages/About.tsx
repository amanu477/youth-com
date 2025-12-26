import { motion } from "framer-motion";
import { Play } from "lucide-react";

export default function About() {
  return (
    <div className="pt-20">
      {/* Header */}
      <section className="bg-blue-600 text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-20" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-display font-bold mb-6"
          >
            Our Story
          </motion.h1>
          <p className="text-xl max-w-2xl mx-auto text-blue-100">
            Building a generation that knows God and makes Him known.
          </p>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative aspect-video bg-slate-900 rounded-3xl overflow-hidden shadow-2xl group cursor-pointer">
            <img 
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" 
              alt="Video Thumbnail" 
              className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-300"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white group-hover:scale-110 transition-transform duration-300">
                <Play className="w-8 h-8 text-white ml-1" />
              </div>
            </div>
            <div className="absolute bottom-8 left-8 text-white">
              <p className="font-bold text-lg">Youth Summer Camp Highlight Reel</p>
              <p className="text-sm opacity-80">Experience the energy of our community</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-display font-bold text-slate-800 mb-6">What We Believe</h2>
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-blue-600 mb-2">Authenticity</h3>
                  <p className="text-slate-600 leading-relaxed">
                    We believe in being real. No masks, no pretending. Come as you are, with your questions, doubts, and dreams.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-purple-600 mb-2">Growth</h3>
                  <p className="text-slate-600 leading-relaxed">
                    We are committed to growing spiritually, emotionally, and relationally. We challenge each other to become the best versions of ourselves.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-orange-600 mb-2">Impact</h3>
                  <p className="text-slate-600 leading-relaxed">
                    We don't just consume; we contribute. We believe our youth have the power to change their schools, families, and city.
                  </p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <img src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" className="rounded-2xl shadow-lg mt-8" alt="Youth event" />
               <img src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" className="rounded-2xl shadow-lg" alt="Concert" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
