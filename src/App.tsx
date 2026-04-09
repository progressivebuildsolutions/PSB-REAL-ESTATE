import React from 'react';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { AuthProvider } from './lib/AuthContext';
import { Toaster } from 'sonner';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { Portfolio } from './components/Portfolio';
import { PostRequirement } from './components/PostRequirement';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { Chatbot } from './components/Chatbot';
import { WhatsAppPopup } from './components/WhatsAppPopup';
import { BackToTop } from './components/BackToTop';

import { ErrorBoundary } from './components/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <AuthProvider>
          <Helmet>
            <title>PBS Real Estate | Best Property Dealer in Chandigarh, Mohali, Panchkula</title>
            <meta name="description" content="PBS Real Estate (Progressive Build Solutions) - Buy, Sell, Rent, Lease Plots, Kothis, Villas, Flats, Commercial & Agricultural Land in Chandigarh. Expert Remodeling & Renovation services." />
            <meta name="keywords" content="Real Estate Chandigarh, Property Dealer Mohali, Buy Plots Chandigarh, Kothis for Sale Chandigarh, Villas in Mohali, Commercial Property Chandigarh, Agricultural Land Punjab, House Renovation Chandigarh, PBS Real Estate, Progressive Build Solutions" />
            <meta property="og:title" content="PBS Real Estate - Your Trusted Property Partner in Chandigarh" />
            <meta property="og:description" content="Premium real estate services including sales, purchase, rent, lease, and remodeling in the Tricity area." />
            <meta property="og:image" content="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1200" />
            <meta name="robots" content="index, follow" />
            <link rel="canonical" href="https://www.britpunjabi.com" />
          </Helmet>
          <div className="min-h-screen bg-white font-sans text-stone-900 selection:bg-stone-200 selection:text-stone-900">
            <Navbar />
            <main>
              <Hero />
              <Services />
              <Portfolio />
              <PostRequirement />
              <Contact />
            </main>
            <Footer />
            <Chatbot />
            <WhatsAppPopup />
            <BackToTop />
            <Toaster position="top-center" />
          </div>
        </AuthProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}
