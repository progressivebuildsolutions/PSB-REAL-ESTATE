import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Send, CheckCircle2, ClipboardList } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { toast } from 'sonner';

export function PostRequirement() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      await addDoc(collection(db, 'requirements'), {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        propertyType: formData.get('propertyType'),
        budget: formData.get('budget'),
        location: formData.get('location'),
        message: formData.get('message'),
        status: 'new',
        createdAt: serverTimestamp(),
      });
      toast.success('Requirement posted successfully! Our agents will contact you.');
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      toast.error('Failed to post requirement. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="post-requirement" className="bg-stone-50 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-16 lg:grid-cols-2">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-4 py-1.5 text-sm font-medium text-white">
              <ClipboardList className="h-4 w-4" />
              Post Your Requirement
            </div>
            <h2 className="mt-6 text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">
              Can't find what you're <br />
              <span className="text-stone-500">looking for?</span>
            </h2>
            <p className="mt-6 text-lg text-stone-600">
              Tell us your specific requirements, and our team will find the best matching properties for you. Just like MagicBricks, we bring the best deals to your doorstep.
            </p>
            
            <ul className="mt-10 space-y-4">
              {[
                'Personalized property matching',
                'Verified listings only',
                'Expert negotiation support',
                'Zero hassle search experience',
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-stone-700">
                  <CheckCircle2 className="h-5 w-5 text-stone-900" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-stone-200 bg-white p-8 shadow-2xl"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="req-name">Full Name</Label>
                  <Input id="req-name" name="name" placeholder="Enter your name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="req-phone">Phone Number</Label>
                  <Input id="req-phone" name="phone" placeholder="+91 98765 43210" required />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="req-type">Property Type</Label>
                  <Select name="propertyType" required>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="plot">Plot / Land</SelectItem>
                      <SelectItem value="residential">Residential</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                      <SelectItem value="agricultural">Agricultural</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="req-budget">Budget Range</Label>
                  <Input id="req-budget" name="budget" placeholder="e.g. 50L - 1Cr" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="req-location">Preferred Location</Label>
                <Input id="req-location" name="location" placeholder="e.g. Sector 41, Chandigarh" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="req-message">Additional Details</Label>
                <Textarea id="req-message" name="message" placeholder="Any specific requirements?" className="min-h-[100px] rounded-xl" />
              </div>

              <Button type="submit" disabled={loading} className="w-full bg-stone-900 py-6 text-lg hover:bg-stone-800 rounded-xl">
                {loading ? 'Posting...' : 'Post Requirement'} <Send className="ml-2 h-5 w-5" />
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
