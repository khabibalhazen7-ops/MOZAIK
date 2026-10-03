import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Mail,
  Phone,
  MessageSquare,
  Calendar,
  Building,
  MapPin,
  Layers,
  Clock,
  CheckCircle,
  Tag,
  Trash2,
  ExternalLink
} from 'lucide-react';
import { getInquiryById, updateInquiryStatus, deleteInquiry, getSettings } from '../../services/db';
import { Inquiry, InquiryStatus, SiteSettings } from '../../types';

export const InquiryDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [inquiry, setInquiry] = useState<Inquiry | null>(null);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [statusSuccess, setStatusSuccess] = useState(false);

  const statuses: InquiryStatus[] = ['new', 'contacted', 'quoted', 'won', 'closed'];

  useEffect(() => {
    async function load() {
      if (!id) return;
      setLoading(true);
      try {
        const [inq, siteSettings] = await Promise.all([
          getInquiryById(id),
          getSettings()
        ]);
        setInquiry(inq);
        setSettings(siteSettings);
      } catch (err) {
        console.error("Load inquiry detail error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleStatusChange = async (newStatus: InquiryStatus) => {
    if (!id || !inquiry) return;
    setStatusUpdating(true);
    setStatusSuccess(false);
    try {
      await updateInquiryStatus(id, newStatus);
      setInquiry({ ...inquiry, status: newStatus });
      setStatusSuccess(true);
      setTimeout(() => setStatusSuccess(false), 2000);
    } catch (err) {
      console.error("Status update error:", err);
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    if (window.confirm("Are you sure you want to permanently delete this inquiry record?")) {
      try {
        await deleteInquiry(id);
        navigate('/admin/inquiries');
      } catch (err) {
        console.error("Delete inquiry error:", err);
      }
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-xs text-[#8C7A6B] font-mono">
        Loading inquiry details...
      </div>
    );
  }

  if (!inquiry) {
    return (
      <div className="p-10 max-w-2xl mx-auto text-center space-y-4">
        <h2 className="font-serif text-2xl text-[#2C2926]">Inquiry Not Found</h2>
        <p className="text-xs text-[#7B756C]">
          The inquiry record may have been removed or updated.
        </p>
        <Link
          to="/admin/inquiries"
          className="inline-flex items-center text-xs uppercase tracking-wider px-5 py-2.5 bg-[#2C2926] text-white"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
          <span>Back to Inquiries</span>
        </Link>
      </div>
    );
  }

  const cleanCustomerPhone = inquiry.phone.replace(/[^0-9]/g, '');
  const productName = inquiry.productName || inquiry.productInterest || 'Natural Stone Collection';

  // WhatsApp Message Generation - Requirement 12
  const waAdminMessage = `Hello ${inquiry.name},\n\nThank you for your inquiry about ${productName}.\n\nWe would like to discuss your project requirements further.\n\nThank you,\nMOZAIK`;
  const waUrl = `https://wa.me/${cleanCustomerPhone}?text=${encodeURIComponent(waAdminMessage)}`;

  // Email Mailto Link - Requirement 13
  const emailSubject = `MOZAIK Inquiry — ${productName}`;
  const mailtoUrl = `mailto:${inquiry.email}?subject=${encodeURIComponent(
    emailSubject
  )}&body=${encodeURIComponent(
    `Hello ${inquiry.name},\n\nThank you for inquiring with MOZAIK about ${productName} for your ${inquiry.projectType} project.\n\n`
  )}`;

  return (
    <div className="p-6 sm:p-10 max-w-5xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E5DFD5]">
        <div>
          <Link
            to="/admin/inquiries"
            className="inline-flex items-center text-xs uppercase tracking-wider text-[#8C7A6B] hover:text-[#2C2926] mb-2 font-mono"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            <span>Back to Inquiry List</span>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-3xl text-[#2C2926]">
              Inquiry: {inquiry.name}
            </h1>
            <span
              className={`text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 border ${
                inquiry.status.toLowerCase() === 'new'
                  ? 'bg-amber-50 border-amber-300 text-amber-800'
                  : inquiry.status.toLowerCase() === 'contacted'
                  ? 'bg-blue-50 border-blue-300 text-blue-800'
                  : inquiry.status.toLowerCase() === 'quoted'
                  ? 'bg-purple-50 border-purple-300 text-purple-800'
                  : inquiry.status.toLowerCase() === 'won'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : 'bg-stone-50 border-stone-300 text-stone-600'
              }`}
            >
              {inquiry.status}
            </span>
          </div>
          <p className="text-xs text-[#7B756C] mt-1 font-mono">
            Received on {new Date(inquiry.createdAt).toLocaleString()} via {inquiry.sourcePage || 'website'}
          </p>
        </div>

        {/* Quick Communication Actions - Requirements 12 & 13 */}
        <div className="flex items-center gap-3">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2C2926] hover:bg-[#4A4036] text-white text-xs uppercase tracking-[0.16em] font-semibold transition-all shadow-xs"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat on WhatsApp</span>
          </a>

          <a
            href={mailtoUrl}
            className="inline-flex items-center gap-2 px-4 py-2.5 border border-[#E5DFD5] bg-white hover:bg-[#FBF9F5] text-[#2C2926] text-xs uppercase tracking-[0.16em] font-semibold transition-all"
          >
            <Mail className="w-4 h-4 text-[#8C7A6B]" />
            <span>Send Email</span>
          </a>

          <button
            onClick={handleDelete}
            title="Delete Inquiry"
            className="p-2.5 text-red-600 hover:text-red-800 border border-red-200 bg-red-50 hover:bg-red-100 transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Status Changer Bar */}
      <div className="bg-white p-4 sm:p-5 border border-[#E5DFD5] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-wider text-[#8C7A6B] block">
            Lead Pipeline Management
          </span>
          <p className="text-xs text-[#2C2926] font-medium mt-0.5">
            Update customer inquiry status:
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {statuses.map((st) => (
            <button
              key={st}
              disabled={statusUpdating}
              onClick={() => handleStatusChange(st)}
              className={`px-3.5 py-1.5 text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer ${
                inquiry.status.toLowerCase() === st
                  ? 'bg-[#2C2926] text-white font-semibold'
                  : 'bg-[#FBF9F5] border border-[#E5DFD5] text-[#7B756C] hover:text-[#2C2926] hover:bg-[#EFECE6]'
              }`}
            >
              {st}
            </button>
          ))}
          {statusSuccess && (
            <span className="text-[11px] text-emerald-700 flex items-center gap-1 font-mono">
              <CheckCircle className="w-3.5 h-3.5" /> Updated
            </span>
          )}
        </div>
      </div>

      {/* Information Cards Grid - Requirement 9 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Customer Information */}
        <div className="bg-white p-6 sm:p-8 border border-[#E5DFD5] space-y-4 shadow-xs">
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#8C7A6B] block pb-2 border-b border-[#EFECE6]">
            1. Customer Information
          </span>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-[#8C7A6B] font-mono uppercase text-[10px] block">Full Name</span>
              <span className="font-serif text-lg font-medium text-[#2C2926]">{inquiry.name}</span>
            </div>

            <div>
              <span className="text-[#8C7A6B] font-mono uppercase text-[10px] block">Company / Studio</span>
              <span className="text-[#2C2926] font-medium">{inquiry.company || 'Private Homeowner / Individual'}</span>
            </div>

            <div>
              <span className="text-[#8C7A6B] font-mono uppercase text-[10px] block">Email Address</span>
              <a href={`mailto:${inquiry.email}`} className="text-[#2C2926] hover:underline font-mono">
                {inquiry.email}
              </a>
            </div>

            <div>
              <span className="text-[#8C7A6B] font-mono uppercase text-[10px] block">WhatsApp / Phone</span>
              <a href={waUrl} target="_blank" rel="noreferrer" className="text-[#2C2926] hover:underline font-mono flex items-center gap-1">
                <span>{inquiry.phone}</span>
                <ExternalLink className="w-3 h-3 text-[#8C7A6B]" />
              </a>
            </div>

            <div>
              <span className="text-[#8C7A6B] font-mono uppercase text-[10px] block">Country</span>
              <span className="text-[#2C2926] font-medium">{inquiry.country || 'Indonesia'}</span>
            </div>
          </div>
        </div>

        {/* Project Information */}
        <div className="bg-white p-6 sm:p-8 border border-[#E5DFD5] space-y-4 shadow-xs">
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#8C7A6B] block pb-2 border-b border-[#EFECE6]">
            2. Project & Material Specifications
          </span>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-[#8C7A6B] font-mono uppercase text-[10px] block">Project Typology</span>
              <span className="px-2 py-0.5 bg-[#EFECE6] text-[#2C2926] font-mono inline-block mt-0.5">
                {inquiry.projectType}
              </span>
            </div>

            <div>
              <span className="text-[#8C7A6B] font-mono uppercase text-[10px] block">Specified Product</span>
              <span className="font-serif text-base font-medium text-[#2C2926]">
                {productName}
              </span>
              {inquiry.productId && (
                <span className="text-[10px] text-[#8C7A6B] font-mono block">
                  ID / Slug: {inquiry.productId}
                </span>
              )}
            </div>

            <div>
              <span className="text-[#8C7A6B] font-mono uppercase text-[10px] block">Estimated Quantity / Area</span>
              <span className="text-[#2C2926] font-medium">{inquiry.estimatedQuantity || 'To be determined'}</span>
            </div>

            <div>
              <span className="text-[#8C7A6B] font-mono uppercase text-[10px] block">Project Location / Delivery Port</span>
              <span className="text-[#2C2926] font-medium">{inquiry.projectLocation || 'To be specified'}</span>
            </div>

            <div>
              <span className="text-[#8C7A6B] font-mono uppercase text-[10px] block">Source Page</span>
              <span className="text-[#7B756C] font-mono text-[11px]">/{inquiry.sourcePage || 'contact'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Message Narrative */}
      <div className="bg-white p-6 sm:p-8 border border-[#E5DFD5] space-y-3 shadow-xs">
        <span className="text-[10px] uppercase font-mono tracking-widest text-[#8C7A6B] block pb-2 border-b border-[#EFECE6]">
          3. Client Message & Notes
        </span>
        <div className="p-4 bg-[#FBF9F5] border border-[#EFECE6] text-xs sm:text-sm text-[#2C2926] leading-relaxed whitespace-pre-line font-light">
          {inquiry.message}
        </div>
      </div>
    </div>
  );
};
