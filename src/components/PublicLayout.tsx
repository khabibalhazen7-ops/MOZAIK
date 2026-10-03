import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { QuoteModalProvider, useQuoteModal } from '../context/QuoteModalContext';
import { RequestQuoteModal } from './RequestQuoteModal';
import { MessageSquare, ArrowUpRight } from 'lucide-react';
import { getSettings } from '../services/db';
import { SiteSettings } from '../types';

const PublicLayoutContent: React.FC = () => {
  const { openQuoteModal } = useQuoteModal();
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const location = useLocation();

  useEffect(() => {
    getSettings().then(setSettings).catch(console.warn);
  }, []);

  const rawNumber = settings?.whatsappNumber || settings?.whatsapp || '+62 812-8888-0919';
  const cleanNumber = rawNumber.replace(/[^0-9]/g, '');
  const waUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(
    'Hello MOZAIK, I would like to inquire about your natural stone collection.'
  )}`;

  // Don't show sticky mobile bar on contact page or product detail (which has its own product-focused bar)
  const isContact = location.pathname.startsWith('/contact');
  const isProductDetail = location.pathname.startsWith('/products/');

  return (
    <div className="flex flex-col min-h-screen bg-[#FBF9F5] text-[#2C2926] relative pb-16 md:pb-0">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <RequestQuoteModal />

      {/* Desktop Floating WhatsApp Button - Requirement 12 */}
      {!isContact && (
        <aside
          aria-label="Direct Consultation"
          className="fixed bottom-8 right-8 z-40 hidden md:flex items-center"
        >
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-4 py-3 bg-[#1C1A18] hover:bg-[#2C2926] text-[#FBF9F5] border border-[#4A4036] shadow-xl transition-all duration-300 group hover:shadow-2xl"
            title="Chat with MOZAIK Stone Specialist on WhatsApp"
          >
            <div className="relative">
              <MessageSquare className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full" />
            </div>
            <div className="text-left font-mono">
              <span className="block text-[9px] uppercase tracking-widest text-[#A89F8D] leading-none">
                QUARRY DIRECT
              </span>
              <span className="block text-xs uppercase tracking-[0.14em] font-semibold text-white mt-0.5">
                Chat on WhatsApp
              </span>
            </div>
          </a>
        </aside>
      )}

      {/* Sticky Mobile Quick Action Bar - Requirement 20 */}
      {!isContact && !isProductDetail && (
        <aside aria-label="Quick Actions" className="fixed bottom-0 inset-x-0 z-40 bg-[#1C1A18]/95 backdrop-blur-md border-t border-[#2C2926] p-2.5 flex items-center justify-between gap-2 md:hidden">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 bg-[#2C2926] border border-[#4A4036] text-white text-[11px] uppercase tracking-wider font-semibold"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#D4CCB8]" />
            <span>WhatsApp</span>
          </a>
          <button
            onClick={() => openQuoteModal(null, 'mobile-sticky')}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 bg-[#FBF9F5] text-[#1C1A18] text-[11px] uppercase tracking-wider font-semibold cursor-pointer shadow-xs"
          >
            <span>Get a Quote</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </aside>
      )}
    </div>
  );
};

export const PublicLayout: React.FC = () => {
  return (
    <QuoteModalProvider>
      <PublicLayoutContent />
    </QuoteModalProvider>
  );
};
