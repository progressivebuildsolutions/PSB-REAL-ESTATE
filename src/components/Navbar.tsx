import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';
import { Building2, Menu, X, Phone, Search, LogIn, LogOut, User, ShieldCheck } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '../lib/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, signInWithGoogle, logout, isAdmin } = useAuth();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Buy', href: '#properties' },
    { name: 'Post Requirement', href: '#post-requirement' },
    { name: 'Services', href: '#services' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav 
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        isScrolled || !isHomePage ? 'bg-white/90 py-3 shadow-sm backdrop-blur-md' : 'bg-gradient-to-b from-black/60 to-transparent py-6'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-12 items-center justify-center rounded-lg bg-stone-900 text-white font-bold text-lg">
            PBS
          </div>
          <span className={`text-xl font-bold tracking-tight hidden sm:inline ${isScrolled || !isHomePage ? 'text-stone-900' : 'text-white'}`}>
            Real Estate
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              className={`text-sm font-medium transition-colors ${isScrolled || !isHomePage ? 'text-stone-600 hover:text-stone-900' : 'text-stone-200 hover:text-white'}`}
            >
              {link.name}
            </a>
          ))}

          {isAdmin && (
            <Link 
              to="/admin"
              className={`text-sm font-medium flex items-center gap-1 transition-colors ${isScrolled || !isHomePage ? 'text-stone-900' : 'text-stone-100 hover:text-white'}`}
            >
              <ShieldCheck className="h-4 w-4" />
              Admin
            </Link>
          )}
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="outline-none">
                  <Avatar className="h-9 w-9 border-2 border-white/20">
                    <AvatarImage src={user.photoURL || ''} />
                    <AvatarFallback className="bg-stone-800 text-white text-xs">
                      {user.displayName?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-xl p-2">
                <DropdownMenuItem className="rounded-lg gap-2 cursor-default">
                  <User className="h-4 w-4" />
                  <span className="text-xs font-medium truncate">{user.displayName}</span>
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem asChild className="rounded-lg gap-2 cursor-pointer">
                    <Link to="/admin">
                      <ShieldCheck className="h-4 w-4 text-stone-900" />
                      <span className="font-medium">Admin Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={logout} className="rounded-lg gap-2 text-red-600 focus:text-red-600 cursor-pointer">
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button 
              onClick={signInWithGoogle}
              variant="outline" 
              className={`rounded-full px-6 gap-2 ${isScrolled ? 'border-stone-200' : 'border-white/30 bg-white/10 text-white hover:bg-white/20'}`}
            >
              <LogIn className="h-4 w-4" />
              Login
            </Button>
          )}

          <Button 
            variant="default" 
            className="rounded-full bg-stone-900 px-6 hover:bg-stone-800 text-white"
            onClick={() => {
              if (isHomePage) {
                document.getElementById('post-requirement')?.scrollIntoView({ behavior: 'smooth' });
              } else {
                window.location.href = '/#post-requirement';
              }
            }}
          >
            Post Property
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button 
          className={`md:hidden p-2 rounded-lg hover:bg-stone-100 ${isScrolled || !isHomePage ? 'text-stone-900' : 'text-white'}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t bg-white md:hidden overflow-hidden"
          >
            <div className="flex flex-col gap-4 p-6">
              {isAdmin && (
                <Link 
                  to="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-lg font-medium text-stone-900 flex items-center gap-2"
                >
                  <ShieldCheck className="h-5 w-5 text-stone-900" />
                  Admin Dashboard
                </Link>
              )}
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-lg font-medium text-stone-900"
                >
                  {link.name}
                </a>
              ))}
              
              {user ? (
                <div className="flex items-center justify-between border-t pt-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.photoURL || ''} />
                      <AvatarFallback>{user.displayName?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{user.displayName}</span>
                  </div>
                  <Button variant="ghost" onClick={logout} className="text-red-600">
                    <LogOut className="h-5 w-5" />
                  </Button>
                </div>
              ) : (
                <Button onClick={signInWithGoogle} className="w-full rounded-xl gap-2 py-6">
                  <LogIn className="h-5 w-5" />
                  Login with Google
                </Button>
              )}

              <Button 
                className="w-full rounded-xl bg-stone-900 py-6"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (isHomePage) {
                    document.getElementById('post-requirement')?.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    window.location.href = '/#post-requirement';
                  }
                }}
              >
                Post Property
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
