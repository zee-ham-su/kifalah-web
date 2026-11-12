import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Menu, X, Heart } from 'lucide-react';

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Programmes', path: '/programmes' },
  { label: 'Impact', path: '/impact' },
  { label: 'News', path: '/news' },
  { label: 'Contact', path: '/contact' },
];

export function Navbar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => setIsOpen(false);

  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-white'
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <img src="/logo.svg" alt="Kifalah Foundation Logo" className="h-10 w-10 transition-transform group-hover:scale-105" />
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-tight text-emerald-900">Kifalah</span>
              <span className="text-xs font-medium text-amber-600 tracking-wider">FOUNDATION GHANA</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <Link 
                key={item.path} 
                href={item.path}
                className={`text-sm font-medium transition-colors hover:text-emerald-700 ${
                  location === item.path ? 'text-emerald-700' : 'text-gray-600'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <Button variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50" asChild>
              <Link href="/get-involved">Get Involved</Link>
            </Button>
            <Button className="bg-amber-500 hover:bg-amber-600 text-white border-0 shadow-sm" asChild>
              <Link href="/support-us" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Support Us
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden p-2 text-gray-600 hover:text-emerald-700 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <div className={`lg:hidden border-t border-gray-100 bg-white transition-all duration-300 overflow-hidden ${
        isOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              href={item.path}
              onClick={closeMenu}
              className={`text-base font-medium py-2 transition-colors ${
                location === item.path ? 'text-emerald-700' : 'text-gray-700'
              }`}
            >
              {item.label}
            </Link>
          ))}
          <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
            <Button variant="outline" className="w-full justify-center border-emerald-200 text-emerald-700" onClick={closeMenu} asChild>
              <Link href="/get-involved">Get Involved</Link>
            </Button>
            <Button className="w-full justify-center bg-amber-500 hover:bg-amber-600 text-white border-0" onClick={closeMenu} asChild>
              <Link href="/support-us">Support Us</Link>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}