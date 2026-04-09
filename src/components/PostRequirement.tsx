import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Send, CheckCircle2, ClipboardList, Upload, Image as ImageIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { doc, setDoc, serverTimestamp, collection } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import { useAuth } from '../lib/AuthContext';
import { toast } from 'sonner';

export function PostRequirement() {
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [listingType, setListingType] = useState('buy');
  const { user, signInWithGoogle } = useAuth();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to post your requirement');
      signInWithGoogle();
      return;
    }

    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const listingId = doc(collection(db, 'listings')).id;
    
    try {
      let imageUrl = '';
      if (imageFile) {
        console.log('Starting image upload...', imageFile.name);
        toast.info('Uploading property image...');
        try {
          const storageRef = ref(storage, `listings/${listingId}/${Date.now()}_${imageFile.name}`);
          const uploadResult = await uploadBytes(storageRef, imageFile);
          imageUrl = await getDownloadURL(uploadResult.ref);
          console.log('Image upload successful:', imageUrl);
        } catch (uploadError: any) {
          console.error('Image upload failed:', uploadError);
          toast.error(`Image upload failed: ${uploadError.message || 'Unknown error'}. Posting without image.`);
          // Continue posting without image if upload fails
        }
      }

      // 1. Create Public Listing (No contact info)
      await setDoc(doc(db, 'listings', listingId), {
        title: `${formData.get('propertyType')} in ${formData.get('location')}`,
        description: formData.get('message') || 'No additional details provided.',
        type: listingType,
        propertyType: formData.get('propertyType'),
        price: formData.get('budget'),
        location: formData.get('location'),
        imageUrl: imageUrl,
        ownerId: user.uid,
        status: 'pending',
        createdAt: serverTimestamp(),
      });

      // 2. Create Private Details (Contact info)
      await setDoc(doc(db, 'listings_private', listingId), {
        listingId: listingId,
        contactName: formData.get('name'),
        contactPhone: formData.get('phone'),
        contactEmail: formData.get('email') || user.email,
        ownerId: user.uid,
      });

      toast.success('Requirement posted successfully! Admin will review and approve it soon.');
      (e.target as HTMLFormElement).reset();
      setImageFile(null);
      setImagePreview(null);
      setListingType('buy');
    } catch (error) {
      console.error('Error posting requirement:', error);
      toast.error('Failed to post requirement. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="post-requirement" className="bg-stone-50 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col justify-center">
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-stone-900 px-4 py-1.5 text-xs font-medium text-white sm:text-sm">
              <ClipboardList className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Post Your Requirement
            </div>
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-stone-900 sm:text-5xl lg:text-6xl">
              Can't find what you're <br className="hidden sm:block" />
              <span className="text-stone-500 italic">looking for?</span>
            </h2>
            <p className="mt-6 text-base text-stone-600 sm:text-lg">
              Tell us your specific requirements, and our team will find the best matching properties for you. Just like MagicBricks, we bring the best deals to your doorstep.
            </p>
            
            <ul className="mt-8 space-y-3 sm:mt-10 sm:space-y-4">
              {[
                'Personalized property matching',
                'Verified listings only',
                'Expert negotiation support',
                'Zero hassle search experience',
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-stone-700 sm:text-base">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-stone-900" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-stone-200 bg-white p-6 shadow-xl sm:rounded-3xl sm:p-8 sm:shadow-2xl"
          >
            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="req-name" className="text-sm font-medium">Full Name</Label>
                  <Input id="req-name" name="name" placeholder="Enter your name" required className="h-11 sm:h-12" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="req-phone" className="text-sm font-medium">Phone Number</Label>
                  <Input id="req-phone" name="phone" placeholder="+91 98765 43210" required className="h-11 sm:h-12" />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="req-listing-type" className="text-sm font-medium">Listing Type</Label>
                  <Select name="listingType" required value={listingType} onValueChange={setListingType}>
                    <SelectTrigger className="h-11 rounded-xl sm:h-12">
                      <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="buy">Buy</SelectItem>
                      <SelectItem value="sell">Sell</SelectItem>
                      <SelectItem value="rent">Rent</SelectItem>
                      <SelectItem value="lease">Lease</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="req-property-type" className="text-sm font-medium">Property Type</Label>
                  <Select name="propertyType" required>
                    <SelectTrigger className="h-11 rounded-xl sm:h-12">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="plot">Plot / Land</SelectItem>
                      <SelectItem value="residential">Residential</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                      <SelectItem value="agricultural">Agricultural</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="req-budget" className="text-sm font-medium">Budget / Price Range</Label>
                  <Input id="req-budget" name="budget" placeholder="e.g. 50L - 1Cr" required className="h-11 sm:h-12" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="req-location" className="text-sm font-medium">
                    {listingType === 'sell' ? 'Location' : 'Preferred Location'}
                  </Label>
                  <Input id="req-location" name="location" placeholder="e.g. Sector 41, Chandigarh" required className="h-11 sm:h-12" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="req-image" className="text-sm font-medium">Property Image (Max 5MB)</Label>
                <div className="flex items-center gap-4">
                  <div 
                    onClick={() => document.getElementById('req-image')?.click()}
                    className="flex-1 h-24 border-2 border-dashed border-stone-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-stone-400 transition-colors bg-stone-50 overflow-hidden relative"
                  >
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <>
                        <Upload className="h-6 w-6 text-stone-400" />
                        <span className="text-xs text-stone-500 mt-1">Click to upload</span>
                      </>
                    )}
                  </div>
                  <Input 
                    id="req-image" 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange}
                    className="hidden" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="req-message" className="text-sm font-medium">Additional Details</Label>
                <Textarea id="req-message" name="message" placeholder="Any specific requirements?" className="min-h-[100px] rounded-xl" />
              </div>

              <Button type="submit" disabled={loading} className="w-full bg-stone-900 py-6 text-lg hover:bg-stone-800 rounded-xl sm:py-7">
                {loading ? 'Posting...' : 'Post Requirement'} <Send className="ml-2 h-5 w-5" />
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
