import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, Check, AlertCircle, Building, Mail, Phone, Globe, MessageSquare } from 'lucide-react';
import { getSettings, updateSettings, seedInitialData } from '../../services/db';
import { SiteSettings } from '../../types';

export const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: 'MOZAIK',
    companyName: 'MOZAIK Natural Stone Collection',
    tagline: 'Natural Stone. Timeless Design.',
    subBrand: 'NATURAL STONE COLLECTION',
    email: 'info@mozaikstone.com',
    whatsapp: '+62 812-8888-0919',
    whatsappNumber: '+62 812-8888-0919',
    phone: '+62 21 5560 8820',
    address: 'Sentra Industri Batu Alam & Arsitektur Nusantara, Jl. Sunset Road No. 88, Bali & Jakarta, Indonesia',
    businessHours: 'Monday - Friday: 08:30 - 17:30 WIB | Saturday: 09:00 - 15:00 WIB',
    defaultSeoTitle: 'MOZAIK | Natural Stone & Mosaic Collection from Indonesia',
    defaultSeoDescription: 'Premium natural stone, mosaic stone, pebble, and architectural decorative stone crafted for modern architecture, landscape, and interior design.'
  });

  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const s = await getSettings();
        setSettings((prev) => ({
          ...prev,
          ...s,
          companyName: s.companyName || s.siteName || prev.companyName,
          whatsappNumber: s.whatsappNumber || s.whatsapp || prev.whatsappNumber
        }));
      } catch (err) {
        console.error("Load settings error:", err);
      }
    }
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatusMessage(null);
    try {
      await updateSettings({
        ...settings,
        siteName: settings.siteName || settings.companyName,
        whatsapp: settings.whatsappNumber || settings.whatsapp
      });
      setStatusMessage({ type: 'success', text: 'Settings updated successfully! Changes are live across the website.' });
    } catch (err) {
      console.error(err);
      setStatusMessage({ type: 'error', text: 'Failed to update settings in Firestore.' });
    } finally {
      setSaving(false);
    }
  };

  const handleReseed = async () => {
    if (window.confirm("Verify or re-seed baseline natural stone products, categories, gallery, and projects to Firestore?")) {
      setSeeding(true);
      try {
        await seedInitialData();
        setStatusMessage({ type: 'success', text: 'Database initialized with full natural stone catalog!' });
      } catch (err) {
        console.error(err);
        setStatusMessage({ type: 'error', text: 'Seed operation encountered an error.' });
      } finally {
        setSeeding(false);
      }
    }
  };

  return (
    <div className="p-6 sm:p-10 max-w-4xl mx-auto space-y-6">
      <div className="pb-6 border-b border-[#E5DFD5] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-[#8C7A6B] font-semibold font-mono">
            GLOBAL CONFIGURATION
          </span>
          <h1 className="font-serif text-3xl text-[#2C2926] mt-1 font-normal">
            Website & Contact Settings
          </h1>
          <p className="text-xs text-[#7B756C] mt-1 font-light">
            Stored in settings/contact and settings/general. Controls public contact channels, WhatsApp routing, and SEO defaults.
          </p>
        </div>

        <button
          type="button"
          onClick={handleReseed}
          disabled={seeding}
          className="inline-flex items-center gap-2 px-4 py-2 border border-[#E5DFD5] text-[#7B756C] hover:text-[#2C2926] hover:bg-white text-xs uppercase tracking-wider font-mono cursor-pointer transition-colors"
          title="Verify or seed baseline documents"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${seeding ? 'animate-spin' : ''}`} />
          <span>{seeding ? 'Seeding...' : 'Verify Data'}</span>
        </button>
      </div>

      {statusMessage && (
        <div
          className={`p-4 border text-xs flex items-center gap-2 ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          {statusMessage.type === 'success' ? <Check className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          <span>{statusMessage.text}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Section 1: Company Information - Requirement 16 */}
        <div className="bg-white border border-[#E5DFD5] p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-[#EFECE6]">
            <Building className="w-4 h-4 text-[#8C7A6B]" />
            <h3 className="font-serif text-base text-[#2C2926] font-medium">
              1. Company Information
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#7B756C] uppercase font-mono text-[11px] tracking-wider mb-1">
                Company Name *
              </label>
              <input
                type="text"
                required
                value={settings.companyName || ''}
                onChange={(e) => setSettings({ ...settings, companyName: e.target.value, siteName: e.target.value })}
                className="w-full bg-[#FBF9F5] border border-[#E5DFD5] p-2.5 text-[#2C2926] focus:outline-hidden focus:border-[#2C2926]"
              />
            </div>

            <div>
              <label className="block text-[#7B756C] uppercase font-mono text-[11px] tracking-wider mb-1">
                Tagline / Brand Motto
              </label>
              <input
                type="text"
                value={settings.tagline || ''}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full bg-[#FBF9F5] border border-[#E5DFD5] p-2.5 text-[#2C2926] focus:outline-hidden focus:border-[#2C2926]"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Contact Information - Requirement 16 */}
        <div className="bg-white border border-[#E5DFD5] p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-[#EFECE6]">
            <Mail className="w-4 h-4 text-[#8C7A6B]" />
            <h3 className="font-serif text-base text-[#2C2926] font-medium">
              2. Contact Information
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#7B756C] uppercase font-mono text-[11px] tracking-wider mb-1">
                Official Email Address *
              </label>
              <input
                type="email"
                required
                value={settings.email || ''}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full bg-[#FBF9F5] border border-[#E5DFD5] p-2.5 text-[#2C2926] focus:outline-hidden focus:border-[#2C2926]"
              />
            </div>

            <div>
              <label className="block text-[#7B756C] uppercase font-mono text-[11px] tracking-wider mb-1">
                Studio Landline / Phone
              </label>
              <input
                type="text"
                value={settings.phone || ''}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full bg-[#FBF9F5] border border-[#E5DFD5] p-2.5 text-[#2C2926] focus:outline-hidden focus:border-[#2C2926]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#7B756C] uppercase font-mono text-[11px] tracking-wider mb-1">
              Physical Showroom & Distribution Address *
            </label>
            <input
              type="text"
              required
              value={settings.address || ''}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              className="w-full bg-[#FBF9F5] border border-[#E5DFD5] p-2.5 text-[#2C2926] focus:outline-hidden focus:border-[#2C2926]"
            />
          </div>

          <div>
            <label className="block text-[#7B756C] uppercase font-mono text-[11px] tracking-wider mb-1">
              Business Hours *
            </label>
            <input
              type="text"
              required
              value={settings.businessHours || ''}
              onChange={(e) => setSettings({ ...settings, businessHours: e.target.value })}
              className="w-full bg-[#FBF9F5] border border-[#E5DFD5] p-2.5 text-[#2C2926] focus:outline-hidden focus:border-[#2C2926]"
            />
          </div>
        </div>

        {/* Section 3: WhatsApp Configuration - Requirement 10 & 16 */}
        <div className="bg-white border border-[#E5DFD5] p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-[#EFECE6]">
            <MessageSquare className="w-4 h-4 text-[#8C7A6B]" />
            <h3 className="font-serif text-base text-[#2C2926] font-medium">
              3. WhatsApp Configuration
            </h3>
          </div>
          <p className="text-xs text-[#7B756C]">
            Configures the dynamic WhatsApp number used across the Homepage, Product Detail pages, Quote Success screens, and Mobile Quick Bar.
          </p>

          <div>
            <label className="block text-[#7B756C] uppercase font-mono text-[11px] tracking-wider mb-1">
              WhatsApp Number (International format with country code) *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. +62 812-8888-0919"
              value={settings.whatsappNumber || settings.whatsapp || ''}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  whatsappNumber: e.target.value,
                  whatsapp: e.target.value
                })
              }
              className="w-full bg-[#FBF9F5] border border-[#E5DFD5] p-2.5 text-[#2C2926] font-mono focus:outline-hidden focus:border-[#2C2926]"
            />
            <span className="text-[10px] text-[#8C7A6B] font-mono mt-1 block">
              Active WhatsApp click-to-chat URL: https://wa.me/{(settings.whatsappNumber || settings.whatsapp || '').replace(/[^0-9]/g, '')}
            </span>
          </div>
        </div>

        {/* Section 4: SEO Settings - Requirement 26 */}
        <div className="bg-white border border-[#E5DFD5] p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-[#EFECE6]">
            <Globe className="w-4 h-4 text-[#8C7A6B]" />
            <h3 className="font-serif text-base text-[#2C2926] font-medium">
              4. Search Engine Optimization & Indexing (SEO)
            </h3>
          </div>
          <p className="text-xs text-[#7B756C]">
            Configures canonical domain URLs, Google Search Console verification token, and global fallback meta tags for search engine bots.
          </p>

          <div>
            <label className="block text-[#7B756C] uppercase font-mono text-[11px] tracking-wider mb-1">
              Canonical Site URL (Production Domain) *
            </label>
            <input
              type="url"
              placeholder="https://mozaikstone.com"
              value={settings.siteUrl || ''}
              onChange={(e) => setSettings({ ...settings, siteUrl: e.target.value })}
              className="w-full bg-[#FBF9F5] border border-[#E5DFD5] p-2.5 text-[#2C2926] font-mono focus:outline-hidden focus:border-[#2C2926]"
            />
            <span className="text-[10px] text-[#8C7A6B] font-mono mt-1 block">
              Used for canonical link generation, XML sitemap generation, and Open Graph share URLs.
            </span>
          </div>

          <div>
            <label className="block text-[#7B756C] uppercase font-mono text-[11px] tracking-wider mb-1">
              Default SEO Title *
            </label>
            <input
              type="text"
              required
              value={settings.defaultSeoTitle || ''}
              onChange={(e) => setSettings({ ...settings, defaultSeoTitle: e.target.value })}
              className="w-full bg-[#FBF9F5] border border-[#E5DFD5] p-2.5 text-[#2C2926] focus:outline-hidden focus:border-[#2C2926]"
            />
          </div>

          <div>
            <label className="block text-[#7B756C] uppercase font-mono text-[11px] tracking-wider mb-1">
              Default Meta Description *
            </label>
            <textarea
              rows={3}
              required
              value={settings.defaultSeoDescription || ''}
              onChange={(e) => setSettings({ ...settings, defaultSeoDescription: e.target.value })}
              className="w-full bg-[#FBF9F5] border border-[#E5DFD5] p-2.5 text-[#2C2926] focus:outline-hidden focus:border-[#2C2926]"
            />
          </div>

          <div>
            <label className="block text-[#7B756C] uppercase font-mono text-[11px] tracking-wider mb-1">
              Google Site Verification Code (Google Search Console)
            </label>
            <input
              type="text"
              placeholder="e.g. google-site-verification=abc123xyz..."
              value={settings.googleSiteVerification || ''}
              onChange={(e) => setSettings({ ...settings, googleSiteVerification: e.target.value })}
              className="w-full bg-[#FBF9F5] border border-[#E5DFD5] p-2.5 text-[#2C2926] font-mono focus:outline-hidden focus:border-[#2C2926]"
            />
            <span className="text-[10px] text-[#8C7A6B] font-mono mt-1 block">
              Leave blank until your official Google Search Console meta token is generated. When provided, injects directly into public &lt;head&gt;.
            </span>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-8 py-3 bg-[#2C2926] text-white hover:bg-[#4A4036] text-xs uppercase tracking-[0.18em] font-semibold cursor-pointer disabled:opacity-50 transition-colors shadow-xs"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
