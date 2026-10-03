import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Clock, MessageSquare, ArrowRight, ShieldCheck } from 'lucide-react';
import { SEO } from '../components/SEO';
import { QuoteForm } from '../components/QuoteForm';
import { getSettings } from '../services/db';
import { SiteSettings } from '../types';

export const Contact: React.FC = () => {
  const [searchParams] = useSearchParams();
  const prefilledProduct = searchParams.get('product') || '';
  const prefilledProject = searchParams.get('project') || '';

  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    async function loadSettings() {
      try {
        const s = await getSettings();
        setSettings(s);
      } catch (err) {
        console.warn("Settings fetch notice:", err);
      }
    }
    loadSettings();
  }, []);

  const activeWaNumber = settings?.whatsappNumber || settings?.whatsapp || '+62 812-8888-0919';
  const cleanWaNumber = activeWaNumber.replace(/[^0-9]/g, '');

  return (
    <div className="bg-[#FBF9F5] min-h-screen">
      <SEO
        title="Contact MOZAIK | Request a Natural Stone Quote"
        description="Connect with MOZAIK architectural natural stone consultants. Request physical stone samples, project quantity takeoffs, and custom fabrication quotes."
        canonicalUrl="/contact"
        keywords="contact mozaik, request natural stone quote, natural stone supplier indonesia contact, stone samples request"
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Contact", url: "/contact" }
        ]}
      />

      {/* Header Banner */}
      <section className="bg-[#1C1A18] text-white py-20 px-6 sm:px-8 lg:px-12 border-b border-[#2C2926]">
        <div className="max-w-7xl mx-auto">
          <nav className="text-xs uppercase tracking-[0.2em] text-[#D4CCB8] mb-4 flex items-center space-x-2 font-mono">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white">Contact & Quotation</span>
          </nav>

          <span className="text-xs uppercase tracking-[0.3em] text-[#D4CCB8] font-semibold block mb-2 font-mono">
            ARCHITECTURAL CONSULTATION
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-normal text-[#FBF9F5]">
            Contact MOZAIK
          </h1>
          <p className="text-sm sm:text-base text-[#D4CCB8]/90 max-w-2xl mt-4 leading-relaxed font-light">
            Whether specifying for a private villa, commercial masterplan, or custom mosaic artwork, our team will calculate quantities, ship physical samples, and support your construction timeline.
          </p>
        </div>
      </section>

      {/* Contact Content Grid - Requirement 15 */}
      <section className="py-20 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: Reusable Request Quote Form (7 cols) */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-12 border border-[#E5DFD5] shadow-xs">
            <div className="mb-8 pb-4 border-b border-[#E5DFD5]">
              <span className="text-xs uppercase tracking-[0.25em] text-[#8C7A6B] font-semibold block mb-1 font-mono">
                DIRECT LEAD GENERATION
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#2C2926]">
                Request a Project Quote
              </h2>
              <p className="text-xs text-[#7B756C] mt-1 font-light">
                Fill out the specifications below. Our stone advisors will reach out promptly with tailored pricing and logistics estimates.
              </p>
            </div>

            <QuoteForm
              initialProduct={
                prefilledProduct
                  ? { name: prefilledProduct }
                  : prefilledProject
                  ? { name: `Materials for ${prefilledProject}` }
                  : null
              }
              sourcePage="contact"
            />
          </div>

          {/* Right Column: Direct Channels from Firestore Settings (5 cols) */}
          <div className="lg:col-span-5 space-y-8">
            {/* Quick Channels Card */}
            <div className="bg-[#2C2926] text-white p-8 border border-[#1C1A18] space-y-6 shadow-xs">
              <span className="text-xs uppercase tracking-[0.25em] text-[#D4CCB8] block font-mono">
                DIRECT CONTACT
              </span>
              <h3 className="font-serif text-2xl text-[#FBF9F5]">
                Direct Lines to MOZAIK
              </h3>
              <p className="text-xs text-[#D4CCB8]/80 leading-relaxed font-light">
                For urgent project schedules, tender documentation, or instant WhatsApp communication with our stone specialists:
              </p>

              <div className="space-y-4 pt-2 border-t border-[#4A4036]">
                <a
                  href={`https://wa.me/${cleanWaNumber}?text=${encodeURIComponent(
                    'Hello MOZAIK, I would like to consult on my project requirements.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3.5 bg-[#1C1A18] hover:bg-[#4A4036] transition-colors border border-[#4A4036]"
                >
                  <MessageSquare className="w-5 h-5 text-[#D4CCB8] shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#A89F8D] block font-mono">
                      WhatsApp Quick Response
                    </span>
                    <span className="text-xs font-semibold text-white">
                      {activeWaNumber}
                    </span>
                  </div>
                </a>

                <a
                  href={`mailto:${settings?.email || 'info@mozaikstone.com'}`}
                  className="flex items-center gap-3 p-3.5 bg-[#1C1A18] hover:bg-[#4A4036] transition-colors border border-[#4A4036]"
                >
                  <Mail className="w-5 h-5 text-[#D4CCB8] shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#A89F8D] block font-mono">
                      Email Documentation
                    </span>
                    <span className="text-xs font-semibold text-white">
                      {settings?.email || 'info@mozaikstone.com'}
                    </span>
                  </div>
                </a>

                {settings?.phone && (
                  <a
                    href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
                    className="flex items-center gap-3 p-3.5 bg-[#1C1A18] hover:bg-[#4A4036] transition-colors border border-[#4A4036]"
                  >
                    <Phone className="w-5 h-5 text-[#D4CCB8] shrink-0" />
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#A89F8D] block font-mono">
                        Studio Landline
                      </span>
                      <span className="text-xs font-semibold text-white">
                        {settings.phone}
                      </span>
                    </div>
                  </a>
                )}
              </div>
            </div>

            {/* Studio Hours & Address Card */}
            <div className="bg-white p-8 border border-[#E5DFD5] space-y-6 shadow-xs">
              <h4 className="font-serif text-lg text-[#2C2926] pb-3 border-b border-[#EFECE6]">
                Quarry Registry & Showrooms
              </h4>

              <div className="space-y-4 text-xs text-[#7B756C]">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#2C2926] shrink-0 mt-1" />
                  <div>
                    <strong className="block text-[#2C2926] font-medium">Distribution & Showroom:</strong>
                    <span>{settings?.address || 'Sentra Industri Batu Alam & Arsitektur Nusantara, Jl. Sunset Road No. 88, Bali & Jakarta, Indonesia'}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[#2C2926] shrink-0 mt-1" />
                  <div>
                    <strong className="block text-[#2C2926] font-medium">Business Hours:</strong>
                    <span>{settings?.businessHours || 'Monday - Friday: 08:30 - 17:30 WIB | Saturday: 09:00 - 15:00 WIB'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
