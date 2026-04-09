import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { toast } from 'sonner';

export function Contact() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      await addDoc(collection(db, 'inquiries'), {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        message: formData.get('message'),
        status: 'new',
        createdAt: serverTimestamp(),
      });
      toast.success('Message sent! We will get back to you soon.');
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-16 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">Get in Touch</h2>
            <p className="mt-4 text-lg text-stone-600">
              Have a question or ready to start your project? Reach out to us today.
            </p>

            <div className="mt-12 space-y-8">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-stone-100 text-stone-900">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-bold">Call Us</div>
                  <div className="text-stone-600">+91 78883 80934</div>
                  <div className="text-stone-600">+91 98769 05782</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-stone-100 text-stone-900">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-bold">Email Us</div>
                  <div className="text-stone-600">info@britpunjabi.com</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-stone-100 text-stone-900">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-bold">Visit Us</div>
                  <div className="text-stone-600">
                    OFFICE NO 12, ANGREJ SINGH COMPLEX,<br />
                    BADHERI MAIN MARKET, SECTOR 41 D,<br />
                    CHANDIGARH 160036
                  </div>
                </div>
              </div>
            </div>

            {/* Google Map Embed */}
            <div className="mt-12 h-64 overflow-hidden rounded-3xl bg-stone-100">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3430.245648714041!2d76.7364!3d30.7254!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390fed0000000000%3A0x0!2zMzDCsDQzJzMxLjQiTiA3NsKwNDQnMTEuMCJF!5e0!3m2!1sen!2sin!4v1712580000000!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-stone-100 bg-white p-8 shadow-xl"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="contact-name">Full Name</Label>
                <Input id="contact-name" name="name" placeholder="Your Name" required />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="contact-email">Email</Label>
                  <Input id="contact-email" name="email" type="email" placeholder="email@example.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-phone">Phone</Label>
                  <Input id="contact-phone" name="phone" placeholder="Phone Number" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-message">Message</Label>
                <Textarea id="contact-message" name="message" placeholder="How can we help you?" className="min-h-[150px]" required />
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-stone-900 py-6 text-lg hover:bg-stone-800">
                {loading ? 'Sending...' : 'Send Message'} <Send className="ml-2 h-5 w-5" />
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
