import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { MapPin, IndianRupee, Tag, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Listing {
  id: string;
  title: string;
  description: string;
  type: 'buy' | 'sell' | 'rent' | 'lease';
  propertyType: string;
  price: string;
  location: string;
  status: string;
  createdAt: any;
}

export function ListingGrid() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'listings'),
      where('status', '==', 'approved'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Listing[];
      setListings(data);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching listings:', error);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-stone-900 border-t-transparent" />
      </div>
    );
  }

  return (
    <section id="properties" className="py-24 bg-stone-50">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16">
          <h2 className="text-3xl font-serif font-light tracking-tight text-stone-900 sm:text-5xl">
            Available <span className="italic">Opportunities</span>
          </h2>
          <p className="mt-4 text-lg text-stone-600 font-light">
            Browse verified property requirements and listings from our community.
          </p>
        </div>

        {listings.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-stone-200">
            <p className="text-stone-500 italic">No listings available at the moment. Be the first to post!</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {listings.map((listing, index) => (
                <motion.div
                  key={listing.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="h-full border-none shadow-sm hover:shadow-xl transition-all duration-500 bg-white group overflow-hidden rounded-2xl">
                    <CardHeader className="p-0">
                      <div className="relative aspect-[16/10] overflow-hidden bg-stone-200">
                        <img 
                          src={`https://picsum.photos/seed/${listing.id}/800/500`}
                          alt={listing.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-4 left-4 flex gap-2">
                          <Badge className="bg-stone-900/80 backdrop-blur-md text-white border-none uppercase text-[10px] tracking-widest px-3 py-1">
                            {listing.type}
                          </Badge>
                          <Badge variant="outline" className="bg-white/80 backdrop-blur-md text-stone-900 border-none uppercase text-[10px] tracking-widest px-3 py-1">
                            {listing.propertyType}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 text-stone-400 text-[10px] uppercase tracking-widest mb-3">
                        <Clock className="h-3 w-3" />
                        {listing.createdAt ? formatDistanceToNow(listing.createdAt.toDate(), { addSuffix: true }) : 'Just now'}
                      </div>
                      <CardTitle className="text-xl font-serif font-medium mb-2 group-hover:text-stone-600 transition-colors">
                        {listing.title}
                      </CardTitle>
                      <p className="text-stone-500 text-sm line-clamp-2 mb-6 font-light leading-relaxed">
                        {listing.description}
                      </p>
                      
                      <div className="space-y-3 pt-4 border-t border-stone-100">
                        <div className="flex items-center gap-2 text-stone-600">
                          <MapPin className="h-4 w-4 text-stone-400" />
                          <span className="text-sm font-light">{listing.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-stone-900">
                          <IndianRupee className="h-4 w-4 text-stone-400" />
                          <span className="text-lg font-medium">{listing.price}</span>
                        </div>
                      </div>

                      <Button 
                        variant="outline" 
                        className="w-full mt-6 rounded-xl border-stone-200 hover:bg-stone-900 hover:text-white transition-all duration-300 group/btn"
                      >
                        Contact Admin for Details
                        <Tag className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
}
