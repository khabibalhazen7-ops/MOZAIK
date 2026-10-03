import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Clock, MessageSquare, ArrowUpRight } from 'lucide-react';
import { getSettings } from '../services/db';
import { SiteSettings } from '../types';
import { useQuoteModal } from '../context/QuoteModalContext';

export const Footer: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const { openQuoteModal } = useQuoteModal();

  useEffect(() => {
    getSettings().then(setSettings).catch(console.warn);
  }, []);

  const rawNumber = settings?.whatsappNumber || settings?.whatsapp || '+62 812-8888-0919';
  const cleanNumber = rawNumber.replace(/[^0-9]/g, '');
  const waUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(
    'Hello MOZAIK, I would like to inquire about natural stone materials.'
  )}`;

  return (
    <footer className="bg-[#1C1A18] text-[#EFECE6] border-t border-[#2C2926]">
      {/* Top CTA Strip */}
      <div className="border-b border-[#2C2926] py-12 px-6 sm:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#D4CCB8] font-mono">
              ARCHITECTURAL NATURAL STONE SOLUTIONS
            </span>
            <h3 className="font-serif text-2xl lg:text-3xl font-normal text-white mt-1">
              Specifying natural stone for your next landmark project?
            </h3>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => openQuoteModal(null, 'footer-cta')}
              className="inline-flex items-center text-xs uppercase tracking-[0.2em] px-6 py-3.5 bg-[#FBF9F5] text-[#1C1A18] hover:bg-[#D4CCB8] transition-all font-semibold cursor-pointer shadow-xs"
            >
              <span>Request Material Quote</span>
              <ArrowUpRight className="w-4 h-4 ml-2" />
            </button>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-xs uppercase tracking-[0.2em] px-6 py-3.5 border border-[#4A4036] text-[#EFECE6] hover:bg-[#2C2926] transition-all"
            >
              <MessageSquare className="w-4 h-4 mr-2 text-[#D4CCB8]" />
              <span>WhatsApp Direct</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Columns */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
        {/* Col 1: Brand & Philosophy */}
        <div className="lg:col-span-2 space-y-4">
          <Link to="/" className="inline-block">
            <span className="font-serif text-3xl tracking-[0.25em] text-white font-medium">
              MOZAIK
            </span>
            <span className="block text-[9px] tracking-[0.3em] text-[#A89F8D] uppercase mt-0.5 font-mono">
              NATURAL STONE COLLECTION
            </span>
          </Link>
          <p className="text-sm text-[#A89F8D] leading-relaxed max-w-sm pt-2 font-light">
            Curating premium volcanic andesite, basalt, quartzite, river pebble mosaics, and bespoke architectural stones. Tailored for architects, developers, interior designers, and luxury landscape spaces worldwide.
          </p>
          <div className="pt-2 text-xs text-[#7B756C]">
            <p className="font-mono text-[11px]">Natural Stone. Timeless Design.</p>
          </div>
        </div>

        {/* Col 2: Categories */}
        <div className="space-y-3">
          <h4 className="text-xs uppercase tracking-[0.2em] text-[#D4CCB8] font-semibold font-mono">
            Classifications
          </h4>
          <ul className="space-y-2 text-sm text-[#A89F8D]">
            <li>
              <Link to="/collection/mosaic-stone" className="hover:text-white transition-colors">
                Mosaic Stone
              </Link>
            </li>
            <li>
              <Link to="/collection/pebble" className="hover:text-white transition-colors">
                Pebble Stone
              </Link>
            </li>
            <li>
              <Link to="/collection/gravel" className="hover:text-white transition-colors">
                Architectural Gravel
              </Link>
            </li>
            <li>
              <Link to="/collection/natural-stone" className="hover:text-white transition-colors">
                Natural Stone Pavers
              </Link>
            </li>
            <li>
              <Link to="/collection/decorative-stone" className="hover:text-white transition-colors">
                Decorative Stone
              </Link>
            </li>
            <li>
              <Link to="/collection/custom-mosaic" className="hover:text-white transition-colors">
                Custom Mosaic
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Applications & Navigation */}
        <div className="space-y-3">
          <h4 className="text-xs uppercase tracking-[0.2em] text-[#D4CCB8] font-semibold font-mono">
            Applications
          </h4>
          <ul className="space-y-2 text-sm text-[#A89F8D]">
            <li>
              <Link to="/gallery?filter=Landscape" className="hover:text-white transition-colors">
                Landscape & Gardens
              </Link>
            </li>
            <li>
              <Link to="/gallery?filter=Pool" className="hover:text-white transition-colors">
                Resort Swimming Pools
              </Link>
            </li>
            <li>
              <Link to="/gallery?filter=Wall" className="hover:text-white transition-colors">
                Monolithic Wall Cladding
              </Link>
            </li>
            <li>
              <Link to="/gallery?filter=Interior" className="hover:text-white transition-colors">
                Luxury Interiors & Spa
              </Link>
            </li>
            <li>
              <Link to="/gallery?filter=Commercial" className="hover:text-white transition-colors">
                Commercial & Urban Plazas
              </Link>
            </li>
            <li>
              <Link to="/projects" className="hover:text-white transition-colors">
                Portfolio Projects
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 4: Contact & Studio (Dynamic from Firestore Settings - Requirement 10) */}
        <div className="space-y-3">
          <h4 className="text-xs uppercase tracking-[0.2em] text-[#D4CCB8] font-semibold font-mono">
            Contact & Studio
          </h4>
          <ul className="space-y-3 text-xs text-[#A89F8D]">
            <li className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#D4CCB8] shrink-0 mt-0.5" />
              <span>{settings?.address || 'Sentra Industri Batu Alam Nusantara, Jl. Sunset Road No. 88, Bali & Jakarta, Indonesia'}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-[#D4CCB8] shrink-0" />
              <a href={`mailto:${settings?.email || 'info@mozaikstone.com'}`} className="hover:text-white">
                {settings?.email || 'info@mozaikstone.com'}
              </a>
            </li>
            {settings?.phone && (
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#D4CCB8] shrink-0" />
                <a href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`} className="hover:text-white">
                  {settings.phone}
                </a>
              </li>
            )}
            <li className="flex items-center gap-2.5">
              <MessageSquare className="w-4 h-4 text-[#D4CCB8] shrink-0" />
              <a href={waUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white font-mono">
                {rawNumber}
              </a>
            </li>
            <li className="flex items-start gap-2.5 pt-1">
              <Clock className="w-4 h-4 text-[#D4CCB8] shrink-0 mt-0.5" />
              <span>{settings?.businessHours || 'Monday - Friday: 08:30 - 17:30 WIB'}</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Legal Bar */}
      <div className="border-t border-[#2C2926] py-8 px-6 sm:px-8 lg:px-12 text-xs text-[#7B756C]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} MOZAIK Natural Stone Collection. All rights reserved.</p>
          <div className="flex items-center space-x-6 text-[11px] font-mono">
            <Link to="/about" className="hover:text-white transition-colors">Our Quarries</Link>
            <Link to="/contact" className="hover:text-white transition-colors">Quotation</Link>
            <Link to="/admin" className="hover:text-white transition-colors">Admin Console</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
