import { Hammer, Facebook, Instagram, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-stone-50 border-t border-stone-200 py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="col-span-2">
            <a href="#" className="flex items-center gap-2">
              <div className="flex h-10 w-12 items-center justify-center rounded-lg bg-stone-900 text-white font-bold text-lg">
                PBS
              </div>
              <span className="text-xl font-bold tracking-tight text-stone-900">
                Real Estate
              </span>
            </a>
            <p className="mt-4 max-w-sm text-stone-600">
              Your trusted partner for premium real estate in Chandigarh. Specializing in plots, residential, commercial, and agricultural land.
            </p>
            <div className="mt-6 flex gap-4">
              <a href="https://facebook.com/britpunjabi" className="text-stone-400 hover:text-stone-900 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://instagram.com/britpunjabi" className="text-stone-400 hover:text-stone-900 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://twitter.com/britpunjabi" className="text-stone-400 hover:text-stone-900 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-stone-900">Quick Links</h4>
            <ul className="mt-4 space-y-2 text-stone-600">
              <li><a href="#services" className="hover:text-stone-900">Services</a></li>
              <li><a href="#portfolio" className="hover:text-stone-900">Portfolio</a></li>
              <li><a href="#booking" className="hover:text-stone-900">Booking</a></li>
              <li><a href="#contact" className="hover:text-stone-900">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-stone-900">Legal</h4>
            <ul className="mt-4 space-y-2 text-stone-600">
              <li><a href="#" className="hover:text-stone-900">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-stone-900">Terms of Service</a></li>
              <li><a href="#" className="hover:text-stone-900">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t border-stone-200 pt-8 text-center text-sm text-stone-500">
          <p>
            © {new Date().getFullYear()}{' '}
            <a 
              href="https://www.britpunjabi.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="font-medium text-stone-900 hover:underline"
            >
              Progressive Build Solutions
            </a>
            . All rights reserved.
          </p>
          <p className="mt-1">Designed for Excellence.</p>
        </div>
      </div>
    </footer>
  );
}
