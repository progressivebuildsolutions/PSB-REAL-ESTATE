import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, MapPin, Home, Building, LandPlot, ArrowRight, Paintbrush } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';

const slides = [
  {
    image: 'https://images.pexels.com/photos/33827337/pexels-photo-33827337.jpeg?auto=compress&cs=tinysrgb&w=1920',
    title: 'Luxury Kothis & Villas',
    subtitle: 'Premium residential spaces in the heart of Chandigarh.',
    cta: 'Explore Villas'
  },
  {
    image: 'https://images.pexels.com/photos/33827336/pexels-photo-33827336.jpeg?auto=compress&cs=tinysrgb&w=1920',
    title: 'Modern Flats',
    subtitle: 'Contemporary living with all modern amenities.',
    cta: 'Browse Flats'
  },
  {
    image: 'https://images.pexels.com/photos/14476591/pexels-photo-14476591.jpeg?auto=compress&cs=tinysrgb&w=1920',
    title: 'Commercial Hubs',
    subtitle: 'Strategic locations for your business to thrive.',
    cta: 'View Commercial'
  },
  {
    image: 'https://images.pexels.com/photos/36771569/pexels-photo-36771569.jpeg?auto=compress&cs=tinysrgb&w=1920',
    title: 'Prime Plots & Land',
    subtitle: 'Invest in the future with verified agricultural and residential land.',
    cta: 'Find Land'
  },
  {
    image: 'https://images.pexels.com/photos/5563473/pexels-photo-5563473.jpeg?auto=compress&cs=tinysrgb&w=1920',
    title: 'Renovation & Remodeling',
    subtitle: 'Transform your existing space into a masterpiece.',
    cta: 'Start Renovation'
  },
  {
    image: 'https://images.pexels.com/photos/8134816/pexels-photo-8134816.jpeg?auto=compress&cs=tinysrgb&w=1920',
    title: 'Exclusive Living',
    subtitle: 'Discover the finest properties in Chandigarh & Mohali.',
    cta: 'View All'
  }
];

export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-stone-950">
      {/* Carousel Background */}
      <div className="absolute inset-0 -z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <img 
              src={slides[currentSlide].image} 
              alt={slides[currentSlide].title} 
              className="h-full w-full object-cover opacity-50"
              referrerPolicy="no-referrer"
              loading="eager"
            />
            <div className="absolute inset-0 bg-stone-950/40 backdrop-blur-[1px]" />
          </motion.div>
        </AnimatePresence>
      </div>
      
      <div className="mx-auto max-w-7xl px-6 pt-20">
        <div className="grid gap-12 lg:grid-cols-1">
          <div className="text-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl">
                  {slides[currentSlide].title}
                </h1>
                
                <p className="mx-auto mt-4 max-w-2xl text-lg text-stone-100 sm:mt-6 sm:text-xl md:text-2xl">
                  {slides[currentSlide].subtitle}
                </p>
                
                <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:mt-10 sm:flex-row">
                  <Button size="lg" className="h-12 w-full rounded-full bg-white text-stone-900 px-8 text-base hover:bg-stone-100 sm:h-14 sm:w-auto sm:text-lg">
                    {slides[currentSlide].cta} <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <a href="#post-requirement" className="w-full sm:w-auto">
                    <Button size="lg" variant="outline" className="h-12 w-full rounded-full border-white/30 bg-white/10 text-white backdrop-blur-md px-8 text-base hover:bg-white/20 sm:h-14 sm:w-auto sm:text-lg">
                      Post Requirement
                    </Button>
                  </a>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Search Box */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mx-auto mt-12 max-w-4xl rounded-2xl bg-white/95 p-4 shadow-2xl backdrop-blur-sm sm:mt-16 sm:rounded-3xl sm:p-6"
            >
              <Tabs defaultValue="buy" className="w-full">
                <TabsList className="mb-4 flex w-full bg-stone-100/50 p-1 rounded-full sm:mb-6 sm:inline-flex sm:w-auto">
                  <TabsTrigger value="buy" className="flex-1 rounded-full px-4 py-2 text-sm data-[state=active]:bg-stone-900 data-[state=active]:text-white sm:px-8 sm:text-base">Buy</TabsTrigger>
                  <TabsTrigger value="rent" className="flex-1 rounded-full px-4 py-2 text-sm data-[state=active]:bg-stone-900 data-[state=active]:text-white sm:px-8 sm:text-base">Rent</TabsTrigger>
                  <TabsTrigger value="sell" className="flex-1 rounded-full px-4 py-2 text-sm data-[state=active]:bg-stone-900 data-[state=active]:text-white sm:px-8 sm:text-base">Sell</TabsTrigger>
                </TabsList>
                
                <div className="grid gap-3 sm:gap-4 md:grid-cols-3">
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" />
                    <Input className="h-12 pl-10 rounded-xl border-stone-200 bg-white sm:h-14" placeholder="Location" />
                  </div>
                  <div className="relative">
                    <Home className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" />
                    <Input className="h-12 pl-10 rounded-xl border-stone-200 bg-white sm:h-14" placeholder="Property Type" />
                  </div>
                  <Button className="h-12 rounded-xl bg-stone-900 text-base hover:bg-stone-800 sm:h-14 sm:text-lg">
                    <Search className="mr-2 h-5 w-5" /> Search
                  </Button>
                </div>
              </Tabs>
            </motion.div>

            {/* Quick Indicators */}
            <div className="mt-8 flex justify-center gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    currentSlide === i ? 'w-8 bg-white' : 'w-2 bg-white/30'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
