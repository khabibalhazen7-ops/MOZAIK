import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MessageSquare,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Send,
  Loader2
} from 'lucide-react';
import { submitInquiry, getProducts, getSettings } from '../services/db';
import { Product, SiteSettings } from '../types';

interface QuoteFormProps {
  initialProduct?: {
    id?: string;
    name: string;
    slug?: string;
  } | null;
  sourcePage?: string;
  onSuccess?: () => void;
  isModal?: boolean;
}

export const QuoteForm: React.FC<QuoteFormProps> = ({
  initialProduct,
  sourcePage = 'contact',
  onSuccess,
  isModal = false
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('Indonesia');
  const [projectType, setProjectType] = useState('Residential');
  const [productId, setProductId] = useState(initialProduct?.id || '');
  const [productName, setProductName] = useState(initialProduct?.name || '');
  const [estimatedQuantity, setEstimatedQuantity] = useState('');
  const [projectLocation, setProjectLocation] = useState('');
  const [message, setMessage] = useState('');

  // States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const projectTypeOptions = [
    'Residential',
    'Commercial',
    'Landscape',
    'Hospitality',
    'Architecture',
    'Interior',
    'Exterior',
    'Other'
  ];

  useEffect(() => {
    async function loadInitial() {
      try {
        const [prodList, siteSettings] = await Promise.all([
          getProducts(),
          getSettings()
        ]);
        setProducts(prodList);
        setSettings(siteSettings);

        // If initialProduct passed but no productId, try match
        if (initialProduct?.name && !initialProduct.id) {
          const match = prodList.find(
            (p) =>
              p.name.toLowerCase() === initialProduct.name.toLowerCase() ||
              p.slug === initialProduct.slug
          );
          if (match) {
            setProductId(match.id || match.slug);
            setProductName(match.name);
          }
        }
      } catch (err) {
        console.error("QuoteForm load error:", err);
      }
    }
    loadInitial();
  }, [initialProduct]);

  // Sync initialProduct if it changes
  useEffect(() => {
    if (initialProduct) {
      setProductName(initialProduct.name);
      if (initialProduct.id) setProductId(initialProduct.id);
    }
  }, [initialProduct]);

  const handleProductSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (!val) {
      setProductId('');
      setProductName('');
      return;
    }
    const found = products.find((p) => (p.id || p.slug) === val || p.name === val);
    if (found) {
      setProductId(found.id || found.slug);
      setProductName(found.name);
    } else {
      setProductId('');
      setProductName(val);
    }
  };

  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    if (!name.trim()) {
      errors.name = 'Please enter your name.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      errors.email = 'Please enter a valid email address.';
    }

    // WhatsApp / Phone validation: numbers, +, -, spaces, at least 7 digits
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (!phone.trim() || cleanPhone.length < 7) {
      errors.phone = 'Please enter a valid WhatsApp number.';
    }

    if (!projectType) {
      errors.projectType = 'Please select a project type.';
    }

    if (!message.trim()) {
      errors.message = 'Please enter your project message.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent duplicate submission

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await submitInquiry({
        name: name.trim(),
        company: company.trim(),
        email: email.trim(),
        phone: phone.trim(),
        country: country.trim(),
        projectType,
        productId,
        productName: productName.trim() || 'General Inquiry',
        estimatedQuantity: estimatedQuantity.trim(),
        projectLocation: projectLocation.trim(),
        message: message.trim(),
        sourcePage
      });

      setIsSuccess(true);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error("Quote submission error:", err);
      // Clean, customer-facing error message without internal Firebase codes (Requirement 18)
      setErrorMessage(
        'Unable to submit your inquiry. Please try again or contact us through WhatsApp.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // WhatsApp Link Helper
  const getWhatsAppLink = () => {
    const rawNumber = settings?.whatsappNumber || settings?.whatsapp || '+62 812-8888-0919';
    const cleanNumber = rawNumber.replace(/[^0-9]/g, '');
    const prefilledText = `Hello MOZAIK,\n\nI have just submitted a quote inquiry for:\nName: ${name}\nProduct: ${
      productName || 'Natural Stone Collection'
    }\nProject: ${projectType}\nLocation: ${projectLocation || 'Indonesia'}\n\nI would like to discuss my requirements further.\n\nThank you.`;

    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(prefilledText)}`;
  };

  // Success Confirmation View - Requirement 6
  if (isSuccess) {
    return (
      <div className="bg-white p-8 sm:p-10 border border-[#E5DFD5] text-center space-y-6">
        <div className="w-14 h-14 bg-[#EFECE6] text-[#2C2926] rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-7 h-7 text-[#8C7A6B]" />
        </div>

        <div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#8C7A6B] block mb-1">
            SUBMISSION CONFIRMED
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#2C2926]">
            Thank You for Your Inquiry
          </h2>
          <p className="text-xs sm:text-sm text-[#7B756C] mt-2 max-w-md mx-auto leading-relaxed">
            Thank you for contacting MOZAIK. Our team will review your project requirements and get back to you soon.
          </p>
        </div>

        {/* Selected Product Review */}
        {productName && (
          <div className="p-3 bg-[#FBF9F5] border border-[#EFECE6] inline-block text-xs text-[#2C2926] font-mono">
            Specified Product: <span className="font-semibold">{productName}</span>
          </div>
        )}

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          {/* Chat on WhatsApp Button - Requirement 6 */}
          <a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#2C2926] hover:bg-[#4A4036] text-white text-xs uppercase tracking-[0.16em] font-semibold transition-all shadow-xs"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat on WhatsApp</span>
          </a>

          {/* Back to Collection Button - Requirement 6 */}
          <Link
            to="/collection"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 border border-[#E5DFD5] text-[#2C2926] hover:bg-[#FBF9F5] text-xs uppercase tracking-[0.16em] font-semibold transition-all"
          >
            <span>Back to Collection</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Auto-selected product banner if coming from product detail */}
      {productName && (
        <div className="p-3 bg-[#FBF9F5] border-l-2 border-[#2C2926] text-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#8C7A6B] block">
              Inquiring for Product:
            </span>
            <span className="font-serif text-sm font-medium text-[#2C2926]">
              {productName}
            </span>
          </div>
          {initialProduct?.slug && (
            <span className="text-[10px] text-[#8C7A6B] font-mono">
              Auto-Selected
            </span>
          )}
        </div>
      )}

      {/* Row 1: Name and Company */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[#7B756C] uppercase font-mono text-[11px] tracking-wider mb-1">
            Full Name *
          </label>
          <input
            type="text"
            placeholder="e.g. Sarah Jenkins"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (fieldErrors.name) setFieldErrors((prev) => ({ ...prev, name: '' }));
            }}
            className={`w-full bg-[#FBF9F5] border p-2.5 text-xs text-[#2C2926] focus:outline-hidden ${
              fieldErrors.name ? 'border-red-400' : 'border-[#E5DFD5] focus:border-[#2C2926]'
            }`}
          />
          {fieldErrors.name && (
            <p className="text-red-600 text-[10px] mt-1">{fieldErrors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-[#7B756C] uppercase font-mono text-[11px] tracking-wider mb-1">
            Company / Studio
          </label>
          <input
            type="text"
            placeholder="e.g. Jenkins Architecture Atelier"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="w-full bg-[#FBF9F5] border border-[#E5DFD5] p-2.5 text-xs text-[#2C2926] focus:outline-hidden focus:border-[#2C2926]"
          />
        </div>
      </div>

      {/* Row 2: Email and WhatsApp */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[#7B756C] uppercase font-mono text-[11px] tracking-wider mb-1">
            Email Address *
          </label>
          <input
            type="email"
            placeholder="name@company.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: '' }));
            }}
            className={`w-full bg-[#FBF9F5] border p-2.5 text-xs text-[#2C2926] focus:outline-hidden ${
              fieldErrors.email ? 'border-red-400' : 'border-[#E5DFD5] focus:border-[#2C2926]'
            }`}
          />
          {fieldErrors.email && (
            <p className="text-red-600 text-[10px] mt-1">{fieldErrors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-[#7B756C] uppercase font-mono text-[11px] tracking-wider mb-1">
            WhatsApp / Phone *
          </label>
          <input
            type="tel"
            placeholder="+62 812-xxxx-xxxx"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              if (fieldErrors.phone) setFieldErrors((prev) => ({ ...prev, phone: '' }));
            }}
            className={`w-full bg-[#FBF9F5] border p-2.5 text-xs text-[#2C2926] focus:outline-hidden ${
              fieldErrors.phone ? 'border-red-400' : 'border-[#E5DFD5] focus:border-[#2C2926]'
            }`}
          />
          {fieldErrors.phone && (
            <p className="text-red-600 text-[10px] mt-1">{fieldErrors.phone}</p>
          )}
        </div>
      </div>

      {/* Row 3: Country and Project Type */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[#7B756C] uppercase font-mono text-[11px] tracking-wider mb-1">
            Country
          </label>
          <input
            type="text"
            placeholder="e.g. Indonesia, Australia, Singapore"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full bg-[#FBF9F5] border border-[#E5DFD5] p-2.5 text-xs text-[#2C2926] focus:outline-hidden focus:border-[#2C2926]"
          />
        </div>

        <div>
          <label className="block text-[#7B756C] uppercase font-mono text-[11px] tracking-wider mb-1">
            Project Type *
          </label>
          <select
            value={projectType}
            onChange={(e) => {
              setProjectType(e.target.value);
              if (fieldErrors.projectType) setFieldErrors((prev) => ({ ...prev, projectType: '' }));
            }}
            className="w-full bg-[#FBF9F5] border border-[#E5DFD5] p-2.5 text-xs text-[#2C2926] focus:outline-hidden focus:border-[#2C2926]"
          >
            {projectTypeOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          {fieldErrors.projectType && (
            <p className="text-red-600 text-[10px] mt-1">{fieldErrors.projectType}</p>
          )}
        </div>
      </div>

      {/* Row 4: Product Interest & Estimated Quantity */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[#7B756C] uppercase font-mono text-[11px] tracking-wider mb-1">
            Product Interest
          </label>
          <select
            value={productId || productName}
            onChange={handleProductSelectChange}
            className="w-full bg-[#FBF9F5] border border-[#E5DFD5] p-2.5 text-xs text-[#2C2926] focus:outline-hidden focus:border-[#2C2926]"
          >
            <option value="">General Natural Stone Inquiry</option>
            {products.map((p) => (
              <option key={p.id || p.slug} value={p.id || p.slug}>
                {p.name} ({p.category})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[#7B756C] uppercase font-mono text-[11px] tracking-wider mb-1">
            Estimated Quantity / Area
          </label>
          <input
            type="text"
            placeholder="e.g. 250 m² or 2 containers"
            value={estimatedQuantity}
            onChange={(e) => setEstimatedQuantity(e.target.value)}
            className="w-full bg-[#FBF9F5] border border-[#E5DFD5] p-2.5 text-xs text-[#2C2926] focus:outline-hidden focus:border-[#2C2926]"
          />
        </div>
      </div>

      {/* Project Location */}
      <div>
        <label className="block text-[#7B756C] uppercase font-mono text-[11px] tracking-wider mb-1">
          Project Location / Delivery Destination
        </label>
        <input
          type="text"
          placeholder="e.g. Seminyak, Bali or Port of Tanjung Priok, Jakarta"
          value={projectLocation}
          onChange={(e) => setProjectLocation(e.target.value)}
          className="w-full bg-[#FBF9F5] border border-[#E5DFD5] p-2.5 text-xs text-[#2C2926] focus:outline-hidden focus:border-[#2C2926]"
        />
      </div>

      {/* Message */}
      <div>
        <label className="block text-[#7B756C] uppercase font-mono text-[11px] tracking-wider mb-1">
          Project Message & Specifications *
        </label>
        <textarea
          rows={isModal ? 3 : 5}
          placeholder="Please describe your architectural requirements, desired surface finishes, project timeline, or sample requests..."
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            if (fieldErrors.message) setFieldErrors((prev) => ({ ...prev, message: '' }));
          }}
          className={`w-full bg-[#FBF9F5] border p-2.5 text-xs text-[#2C2926] focus:outline-hidden ${
            fieldErrors.message ? 'border-red-400' : 'border-[#E5DFD5] focus:border-[#2C2926]'
          }`}
        />
        {fieldErrors.message && (
          <p className="text-red-600 text-[10px] mt-1">{fieldErrors.message}</p>
        )}
      </div>

      {/* Submit Button & Spam Protection - Requirement 18 */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 px-6 bg-[#2C2926] hover:bg-[#4A4036] text-white text-xs uppercase tracking-[0.18em] font-semibold cursor-pointer disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-xs"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Sending...</span>
            </>
          ) : (
            <>
              <Send className="w-3.5 h-3.5" />
              <span>Submit Request for Quote</span>
            </>
          )}
        </button>
        <p className="text-[10px] text-[#8C7A6B] text-center mt-2 font-mono">
          We protect your privacy. Your inquiry is directly routed to our commercial project advisors.
        </p>
      </div>
    </form>
  );
};
