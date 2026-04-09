import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar as CalendarIcon, Clock, Send } from 'lucide-react';
import { Button } from './ui/button';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { format } from 'date-fns';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { toast } from 'sonner';

export function BookingSystem() {
  const [date, setDate] = useState<Date>();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!date) {
      toast.error('Please select a date');
      return;
    }

    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      await addDoc(collection(db, 'bookings'), {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        service: formData.get('service'),
        date: date,
        status: 'pending',
        createdAt: serverTimestamp(),
      });
      toast.success('Booking request sent! We will contact you shortly.');
      (e.target as HTMLFormElement).reset();
      setDate(undefined);
    } catch (error) {
      toast.error('Failed to send booking request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="booking" className="bg-stone-900 py-24 text-white">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-16 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Book a Consultation</h2>
            <p className="mt-4 text-lg text-stone-400">
              Schedule a site visit or a meeting with our experts to discuss your project requirements.
            </p>
            
            <div className="mt-10 space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-stone-800">
                  <CalendarIcon className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-medium">Flexible Scheduling</div>
                  <div className="text-sm text-stone-500">Pick a date that works for you.</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-stone-800">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-medium">Expert Advice</div>
                  <div className="text-sm text-stone-500">Get insights from our senior engineers.</div>
                </div>
              </div>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl bg-white p-8 text-stone-900"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" placeholder="John Doe" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" name="email" type="email" placeholder="john@example.com" required />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" name="phone" placeholder="+91 98765 43210" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="service">Service Required</Label>
                  <Select name="service" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="residential">Residential Construction</SelectItem>
                      <SelectItem value="commercial">Commercial Project</SelectItem>
                      <SelectItem value="renovation">Renovation</SelectItem>
                      <SelectItem value="interior">Interior Design</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Preferred Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full justify-start text-left font-normal ${!date && 'text-muted-foreground'}`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <Button type="submit" disabled={loading} className="w-full bg-stone-900 py-6 text-lg hover:bg-stone-800">
                {loading ? 'Processing...' : 'Request Booking'} <Send className="ml-2 h-5 w-5" />
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
