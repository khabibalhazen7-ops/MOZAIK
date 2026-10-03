import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useQuoteModal } from '../context/QuoteModalContext';

export const Header: React.FC = () => {
  const { openQuoteModal } = useQuoteModal();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAdmin } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Collection', path: '/collection' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Projects', path: '/projects' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#FBF9F5]/95 backdrop-blur-md shadow-xs border-b border-[#E5DFD5]'
          : 'bg-[#FBF9F5] border-b border-[#EFECE6]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="group flex flex-col tracking-wider">
          <span className="font-serif text-2xl lg:text-3xl font-semibold tracking-[0.2em] text-[#2C2926] group-hover:text-[#4A4036] transition-colors">
            MOZAIK
          </span>
          <span className="text-[9px] tracking-[0.28em] text-[#7B756C] uppercase font-medium">
            Natural Stone Collection
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-xs uppercase tracking-[0.16em] transition-colors py-1 ${
                isActive(link.path)
                  ? 'text-[#2C2926] font-semibold border-b-2 border-[#2C2926]'
                  : 'text-[#7B756C] hover:text-[#2C2926]'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Action Button & Admin */}
        <div className="hidden md:flex items-center space-x-4">
          {isAdmin && (
            <Link
              to="/admin"
              className="flex items-center text-xs tracking-wider text-[#4A4036] bg-[#EFECE6] hover:bg-[#E5DFD5] px-3 py-2 rounded-xs font-medium transition-colors"
              title="Admin Portal"
            >
              <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-[#2C2926]" />
              Admin
            </Link>
          )}

          <button
            onClick={() => openQuoteModal(null, 'header')}
            className="inline-flex items-center justify-center text-xs uppercase tracking-[0.18em] px-5 py-2.5 bg-[#2C2926] text-[#FBF9F5] hover:bg-[#4A4036] transition-all duration-200 group cursor-pointer"
          >
            <span>Get a Quote</span>
            <ArrowUpRight className="w-3.5 h-3.5 ml-1.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>

        {/* Mobile Header Controls: Get Quote CTA + Menu Button */}
        <div className="flex md:hidden items-center space-x-2">
          <button
            onClick={() => openQuoteModal(null, 'mobile-header')}
            className="inline-flex items-center text-[10px] uppercase tracking-[0.16em] font-semibold px-3 py-1.5 bg-[#2C2926] text-[#FBF9F5] hover:bg-[#4A4036] transition-colors"
          >
            <span>Get Quote</span>
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#2C2926] hover:text-[#4A4036] focus:outline-hidden cursor-pointer"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#E5DFD5] bg-[#FBF9F5] px-6 py-6 space-y-4 animate-in fade-in duration-200">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-sm uppercase tracking-[0.18em] py-2 ${
                  isActive(link.path)
                    ? 'text-[#2C2926] font-semibold pl-2 border-l-2 border-[#2C2926]'
                    : 'text-[#7B756C] hover:text-[#2C2926]'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="pt-4 border-t border-[#EFECE6] flex flex-col space-y-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openQuoteModal(null, 'mobile-menu');
              }}
              className="w-full text-center text-xs uppercase tracking-[0.2em] py-3 bg-[#2C2926] text-[#FBF9F5] hover:bg-[#4A4036] cursor-pointer"
            >
              Get a Quote
            </button>

            <Link
              to="/admin"
              className="text-center text-xs tracking-wider text-[#7B756C] hover:text-[#2C2926] py-1"
            >
              Admin Dashboard Login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
