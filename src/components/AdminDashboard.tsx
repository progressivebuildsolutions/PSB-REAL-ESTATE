import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { collection, query, onSnapshot, orderBy, doc, updateDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../lib/AuthContext';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Check, X, Phone, Mail, User, ShieldAlert, Trash2, Eye } from 'lucide-react';
import { toast } from 'sonner';

interface Listing {
  id: string;
  title: string;
  description: string;
  type: string;
  propertyType: string;
  price: string;
  location: string;
  imageUrl?: string;
  status: 'pending' | 'approved' | 'sold' | 'rejected';
  ownerId: string;
  createdAt: any;
}

interface PrivateDetails {
  contactName: string;
  contactPhone: string;
  contactEmail: string;
}

export function AdminDashboard() {
  const { isAdmin, loading: authLoading } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [selectedListing, setSelectedListing] = useState<string | null>(null);
  const [privateDetails, setPrivateDetails] = useState<PrivateDetails | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    if (!isAdmin) return;

    const q = query(collection(db, 'listings'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Listing[];
      setListings(data);
    });

    return unsubscribe;
  }, [isAdmin]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'listings', id), { status: newStatus });
      toast.success(`Listing ${newStatus} successfully`);
    } catch (error) {
      toast.error('Failed to update listing status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;
    try {
      await deleteDoc(doc(db, 'listings', id));
      await deleteDoc(doc(db, 'listings_private', id));
      toast.success('Listing deleted');
    } catch (error) {
      toast.error('Failed to delete listing');
    }
  };

  const fetchPrivateDetails = async (id: string) => {
    setLoadingDetails(true);
    setSelectedListing(id);
    try {
      const snap = await getDoc(doc(db, 'listings_private', id));
      if (snap.exists()) {
        setPrivateDetails(snap.data() as PrivateDetails);
      } else {
        setPrivateDetails(null);
        toast.error('No private details found for this listing');
      }
    } catch (error) {
      toast.error('Failed to fetch private details');
    } finally {
      setLoadingDetails(false);
    }
  };

  if (authLoading) return <div className="p-20 text-center">Checking permissions...</div>;
  if (!isAdmin) return (
    <div className="p-20 text-center flex flex-col items-center gap-4">
      <ShieldAlert className="h-12 w-12 text-red-500" />
      <h2 className="text-2xl font-bold">Access Denied</h2>
      <p>Only administrators can access this dashboard.</p>
    </div>
  );

  const pendingListings = listings.filter(l => l.status === 'pending');
  const approvedListings = listings.filter(l => l.status === 'approved');

  return (
    <div className="min-h-screen bg-stone-50 pt-32 pb-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-serif font-light">Admin <span className="italic">Dashboard</span></h1>
            <p className="text-stone-500 mt-2 font-light">Manage property listings and view client contacts.</p>
          </div>
          <Badge className="bg-stone-900 text-white px-4 py-1 rounded-full uppercase tracking-widest text-[10px]">
            Administrator
          </Badge>
        </div>

        <Tabs defaultValue="pending" className="space-y-8">
          <TabsList className="bg-white p-1 rounded-xl border border-stone-200">
            <TabsTrigger value="pending" className="rounded-lg px-8 data-[state=active]:bg-stone-900 data-[state=active]:text-white">
              Pending ({pendingListings.length})
            </TabsTrigger>
            <TabsTrigger value="approved" className="rounded-lg px-8 data-[state=active]:bg-stone-900 data-[state=active]:text-white">
              Approved ({approvedListings.length})
            </TabsTrigger>
            <TabsTrigger value="all" className="rounded-lg px-8 data-[state=active]:bg-stone-900 data-[state=active]:text-white">
              All Listings
            </TabsTrigger>
          </TabsList>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <TabsContent value="pending" className="m-0 space-y-6">
                {pendingListings.map(listing => (
                  <ListingCard 
                    key={listing.id} 
                    listing={listing} 
                    onApprove={() => handleStatusChange(listing.id, 'approved')}
                    onReject={() => handleStatusChange(listing.id, 'rejected')}
                    onDelete={() => handleDelete(listing.id)}
                    onViewDetails={() => fetchPrivateDetails(listing.id)}
                    isSelected={selectedListing === listing.id}
                  />
                ))}
                {pendingListings.length === 0 && <EmptyState message="No pending listings to review." />}
              </TabsContent>

              <TabsContent value="approved" className="m-0 space-y-6">
                {approvedListings.map(listing => (
                  <ListingCard 
                    key={listing.id} 
                    listing={listing} 
                    onReject={() => handleStatusChange(listing.id, 'rejected')}
                    onDelete={() => handleDelete(listing.id)}
                    onViewDetails={() => fetchPrivateDetails(listing.id)}
                    isSelected={selectedListing === listing.id}
                  />
                ))}
                {approvedListings.length === 0 && <EmptyState message="No approved listings yet." />}
              </TabsContent>

              <TabsContent value="all" className="m-0 space-y-6">
                {listings.map(listing => (
                  <ListingCard 
                    key={listing.id} 
                    listing={listing} 
                    onApprove={listing.status !== 'approved' ? () => handleStatusChange(listing.id, 'approved') : undefined}
                    onReject={listing.status !== 'rejected' ? () => handleStatusChange(listing.id, 'rejected') : undefined}
                    onDelete={() => handleDelete(listing.id)}
                    onViewDetails={() => fetchPrivateDetails(listing.id)}
                    isSelected={selectedListing === listing.id}
                  />
                ))}
              </TabsContent>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-32">
                <Card className="border-none shadow-xl bg-white rounded-3xl overflow-hidden">
                  <CardHeader className="bg-stone-900 text-white p-6">
                    <CardTitle className="text-lg font-serif font-light flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Contact Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    {loadingDetails ? (
                      <div className="flex justify-center py-10">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-stone-900 border-t-transparent" />
                      </div>
                    ) : privateDetails ? (
                      <div className="space-y-6">
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase tracking-widest text-stone-400">Full Name</label>
                          <div className="flex items-center gap-3 text-stone-900 font-medium">
                            <User className="h-4 w-4 text-stone-400" />
                            {privateDetails.contactName}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase tracking-widest text-stone-400">Phone Number</label>
                          <div className="flex items-center gap-3 text-stone-900 font-medium">
                            <Phone className="h-4 w-4 text-stone-400" />
                            <a href={`tel:${privateDetails.contactPhone}`} className="hover:underline">{privateDetails.contactPhone}</a>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase tracking-widest text-stone-400">Email Address</label>
                          <div className="flex items-center gap-3 text-stone-900 font-medium">
                            <Mail className="h-4 w-4 text-stone-400" />
                            <a href={`mailto:${privateDetails.contactEmail}`} className="hover:underline">{privateDetails.contactEmail}</a>
                          </div>
                        </div>
                        <div className="pt-6 border-t border-stone-100">
                          <Button className="w-full bg-stone-900 rounded-xl">Share with Client</Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-10 text-stone-400 italic font-light">
                        Select a listing to view private contact information.
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
}

function ListingCard({ listing, onApprove, onReject, onDelete, onViewDetails, isSelected }: any) {
  return (
    <Card className={`border-none shadow-sm transition-all duration-300 ${isSelected ? 'ring-2 ring-stone-900' : 'hover:shadow-md'}`}>
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="w-full sm:w-48 h-32 rounded-xl overflow-hidden bg-stone-100 shrink-0">
            <img 
              src={listing.imageUrl || `https://picsum.photos/seed/${listing.id}/400/300`} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="uppercase text-[9px] tracking-widest border-stone-200">
                {listing.status}
              </Badge>
              <span className="text-[10px] text-stone-400 uppercase tracking-widest">
                {listing.propertyType} • {listing.type}
              </span>
            </div>
            <h3 className="text-xl font-serif font-medium">{listing.title}</h3>
            <p className="text-sm text-stone-500 line-clamp-1 font-light">{listing.description}</p>
            <div className="flex items-center gap-4 pt-2">
              <span className="text-lg font-medium text-stone-900">{listing.price}</span>
              <span className="text-sm text-stone-400 font-light">{listing.location}</span>
            </div>
          </div>
          <div className="flex sm:flex-col gap-2 justify-end">
            <Button size="icon" variant="outline" className="rounded-full border-stone-200" onClick={onViewDetails}>
              <Eye className="h-4 w-4" />
            </Button>
            {onApprove && (
              <Button size="icon" variant="outline" className="rounded-full border-stone-200 text-green-600 hover:bg-green-50" onClick={onApprove}>
                <Check className="h-4 w-4" />
              </Button>
            )}
            {onReject && (
              <Button size="icon" variant="outline" className="rounded-full border-stone-200 text-orange-600 hover:bg-orange-50" onClick={onReject}>
                <X className="h-4 w-4" />
              </Button>
            )}
            <Button size="icon" variant="outline" className="rounded-full border-stone-200 text-red-600 hover:bg-red-50" onClick={onDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-20 bg-white rounded-3xl border border-stone-200 border-dashed">
      <p className="text-stone-400 italic font-light">{message}</p>
    </div>
  );
}
