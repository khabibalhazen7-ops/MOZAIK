import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Mail,
  Phone,
  MessageSquare,
  Search,
  Filter,
  Eye,
  CheckCircle,
  ExternalLink,
  Trash2,
  Download
} from 'lucide-react';
import { getInquiries, updateInquiryStatus, deleteInquiry } from '../../services/db';
import { Inquiry, InquiryStatus } from '../../types';

export const AdminInquiries: React.FC = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [projectTypeFilter, setProjectTypeFilter] = useState<string>('All');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const statuses: InquiryStatus[] = ['new', 'contacted', 'quoted', 'won', 'closed'];

  const projectTypes = [
    'All',
    'Residential',
    'Commercial',
    'Landscape',
    'Hospitality',
    'Architecture',
    'Interior',
    'Exterior',
    'Other'
  ];

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getInquiries();
      setInquiries(data);
    } catch (err) {
      console.error("Load inquiries error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (id: string, newStatus: InquiryStatus) => {
    setUpdatingId(id);
    try {
      await updateInquiryStatus(id, newStatus);
      setInquiries((prev) =>
        prev.map((i) => (i.id === id ? { ...i, status: newStatus } : i))
      );
    } catch (err) {
      console.error("Update status error:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (window.confirm("Permanently delete this inquiry record?")) {
      try {
        await deleteInquiry(id);
        setInquiries((prev) => prev.filter((i) => i.id !== id));
      } catch (err) {
        console.error("Delete error:", err);
      }
    }
  };

  const exportToCSV = () => {
    if (filteredInquiries.length === 0) return;
    const headers = [
      'ID',
      'Date',
      'Customer Name',
      'Company',
      'Email',
      'Phone',
      'Country',
      'Project Type',
      'Product Interest',
      'Estimated Quantity',
      'Project Location',
      'Source Page',
      'Status',
      'Message'
    ];

    const rows = filteredInquiries.map((inq) => [
      inq.id || '',
      new Date(inq.createdAt).toISOString(),
      `"${(inq.name || '').replace(/"/g, '""')}"`,
      `"${(inq.company || '').replace(/"/g, '""')}"`,
      `"${(inq.email || '').replace(/"/g, '""')}"`,
      `"${(inq.phone || '').replace(/"/g, '""')}"`,
      `"${(inq.country || 'Indonesia').replace(/"/g, '""')}"`,
      `"${(inq.projectType || '').replace(/"/g, '""')}"`,
      `"${(inq.productName || inq.productInterest || '').replace(/"/g, '""')}"`,
      `"${(inq.estimatedQuantity || '').replace(/"/g, '""')}"`,
      `"${(inq.projectLocation || '').replace(/"/g, '""')}"`,
      `"${(inq.sourcePage || '').replace(/"/g, '""')}"`,
      `"${(inq.status || 'new').replace(/"/g, '""')}"`,
      `"${(inq.message || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mozaik-inquiries-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const filteredInquiries = useMemo(() => {
    return inquiries.filter((inq) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        inq.name.toLowerCase().includes(q) ||
        (inq.company && inq.company.toLowerCase().includes(q)) ||
        (inq.productName && inq.productName.toLowerCase().includes(q)) ||
        (inq.productInterest && inq.productInterest.toLowerCase().includes(q)) ||
        inq.email.toLowerCase().includes(q) ||
        inq.phone.includes(q);

      const matchesStatus =
        statusFilter === 'All' ||
        (inq.status || '').toLowerCase() === statusFilter.toLowerCase();

      const matchesType =
        projectTypeFilter === 'All' ||
        inq.projectType.toLowerCase() === projectTypeFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [inquiries, searchQuery, statusFilter, projectTypeFilter]);

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E5DFD5]">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-[#8C7A6B] font-semibold font-mono">
            COMMERCIAL INBOX
          </span>
          <h1 className="font-serif text-3xl text-[#2C2926] mt-1 font-normal">
            Customer Inquiries ({inquiries.length})
          </h1>
          <p className="text-xs text-[#7B756C] mt-1 font-light">
            Review incoming project quote requests, material inquiries, and sample orders from Firestore.
          </p>
        </div>

        {/* Quick Status Pill Counters and Export */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 overflow-x-auto text-[11px] font-mono">
            <span className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200">
              {inquiries.filter((i) => (i.status || '').toLowerCase() === 'new').length} New
            </span>
            <span className="px-2.5 py-1 bg-blue-50 text-blue-800 border border-blue-200">
              {inquiries.filter((i) => (i.status || '').toLowerCase() === 'contacted').length} Contacted
            </span>
            <span className="px-2.5 py-1 bg-purple-50 text-purple-800 border border-purple-200">
              {inquiries.filter((i) => (i.status || '').toLowerCase() === 'quoted').length} Quoted
            </span>
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200">
              {inquiries.filter((i) => (i.status || '').toLowerCase() === 'won').length} Won
            </span>
          </div>

          <button
            onClick={exportToCSV}
            disabled={filteredInquiries.length === 0}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#E5DFD5] bg-white hover:bg-[#FBF9F5] text-[#2C2926] text-xs uppercase tracking-wider font-semibold transition-all shadow-xs cursor-pointer disabled:opacity-50"
            title="Download CSV export of customer inquiries"
          >
            <Download className="w-3.5 h-3.5 text-[#8C7A6B]" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar - Requirement 8 */}
      <div className="bg-white p-4 border border-[#E5DFD5] space-y-3 shadow-xs">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#7B756C]" />
            <input
              type="text"
              placeholder="Search customer, company or product..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#FBF9F5] border border-[#E5DFD5] text-xs text-[#2C2926] placeholder-[#A0988E] focus:outline-hidden focus:border-[#2C2926]"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-wider text-[#8C7A6B] font-mono hidden sm:inline">
              Status:
            </span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#FBF9F5] border border-[#E5DFD5] px-3 py-2 text-xs text-[#2C2926] focus:outline-hidden focus:border-[#2C2926]"
            >
              <option value="All">All Statuses</option>
              {statuses.map((st) => (
                <option key={st} value={st}>
                  {st.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          {/* Project Type Filter */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-wider text-[#8C7A6B] font-mono hidden sm:inline">
              Project:
            </span>
            <select
              value={projectTypeFilter}
              onChange={(e) => setProjectTypeFilter(e.target.value)}
              className="bg-[#FBF9F5] border border-[#E5DFD5] px-3 py-2 text-xs text-[#2C2926] focus:outline-hidden focus:border-[#2C2926]"
            >
              {projectTypes.map((pt) => (
                <option key={pt} value={pt}>
                  {pt}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-[11px] text-[#8C7A6B] font-mono flex items-center justify-between pt-1 border-t border-[#F2EFE9]">
          <span>
            Showing {filteredInquiries.length} of {inquiries.length} inquiries
          </span>
          {(searchQuery || statusFilter !== 'All' || projectTypeFilter !== 'All') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('All');
                setProjectTypeFilter('All');
              }}
              className="text-xs text-[#2C2926] hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Inquiry List Table - Requirement 8 */}
      {loading ? (
        <div className="py-20 text-center text-xs text-[#8C7A6B] font-mono">
          Loading inquiries from Firestore...
        </div>
      ) : filteredInquiries.length === 0 ? (
        <div className="py-20 text-center bg-white border border-[#E5DFD5] p-8 text-xs text-[#8C7A6B]">
          No customer inquiries match your current search and filter criteria.
        </div>
      ) : (
        <div className="bg-white border border-[#E5DFD5] overflow-x-auto shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FBF9F5] border-b border-[#E5DFD5] text-[#7B756C] font-mono uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Customer Name</th>
                <th className="py-3 px-4">Company</th>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Project Type</th>
                <th className="py-3 px-4">Country</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFECE6]">
              {filteredInquiries.map((inq) => {
                const dateStr = new Date(inq.createdAt).toLocaleDateString();
                const productName =
                  inq.productName || inq.productInterest || 'General Inquiry';

                return (
                  <tr
                    key={inq.id}
                    className="hover:bg-[#FBF9F5] transition-colors"
                  >
                    {/* Customer Name */}
                    <td className="py-3.5 px-4 font-medium text-[#2C2926]">
                      <Link
                        to={`/admin/inquiries/${inq.id}`}
                        className="hover:underline font-serif text-sm block"
                      >
                        {inq.name}
                      </Link>
                      <span className="text-[10px] text-[#8C7A6B] font-mono block">
                        {inq.email}
                      </span>
                    </td>

                    {/* Company */}
                    <td className="py-3.5 px-4 text-[#7B756C]">
                      {inq.company || '-'}
                    </td>

                    {/* Product */}
                    <td className="py-3.5 px-4 font-medium text-[#2C2926] max-w-xs truncate">
                      {productName}
                    </td>

                    {/* Project Type */}
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 bg-[#EFECE6] text-[#2C2926] text-[10px] font-mono uppercase tracking-wider">
                        {inq.projectType}
                      </span>
                    </td>

                    {/* Country */}
                    <td className="py-3.5 px-4 text-[#7B756C]">
                      {inq.country || 'Indonesia'}
                    </td>

                    {/* Status Changer */}
                    <td className="py-3.5 px-4">
                      <select
                        value={(inq.status || 'new').toLowerCase()}
                        disabled={updatingId === inq.id}
                        onChange={(e) =>
                          handleStatusChange(inq.id!, e.target.value as InquiryStatus)
                        }
                        className={`text-[10px] font-mono uppercase tracking-wider px-2 py-1 border cursor-pointer ${
                          inq.status.toLowerCase() === 'new'
                            ? 'bg-amber-50 border-amber-300 text-amber-800'
                            : inq.status.toLowerCase() === 'contacted'
                            ? 'bg-blue-50 border-blue-300 text-blue-800'
                            : inq.status.toLowerCase() === 'quoted'
                            ? 'bg-purple-50 border-purple-300 text-purple-800'
                            : inq.status.toLowerCase() === 'won'
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                            : 'bg-stone-50 border-stone-300 text-stone-600'
                        }`}
                      >
                        {statuses.map((st) => (
                          <option key={st} value={st}>
                            {st.toUpperCase()}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 text-[10px] font-mono text-[#7B756C]">
                      {dateStr}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        {/* Quick WhatsApp Chat */}
                        <a
                          href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                            `Hello ${inq.name},\n\nThank you for your inquiry about ${productName}.\n\nWe would like to discuss your project requirements further.\n\nThank you,\nMOZAIK`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Chat on WhatsApp"
                          className="p-1.5 text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50 transition-colors"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </a>

                        {/* Quick Email */}
                        <a
                          href={`mailto:${inq.email}?subject=${encodeURIComponent(
                            `MOZAIK Inquiry — ${productName}`
                          )}&body=${encodeURIComponent(
                            `Hello ${inq.name},\n\nThank you for reaching out to MOZAIK regarding ${productName}.\n\n`
                          )}`}
                          title="Send Email"
                          className="p-1.5 text-blue-700 hover:text-blue-900 hover:bg-blue-50 transition-colors"
                        >
                          <Mail className="w-4 h-4" />
                        </a>

                        {/* Open Detail */}
                        <Link
                          to={`/admin/inquiries/${inq.id}`}
                          title="Open Inquiry Detail"
                          className="p-1.5 text-[#2C2926] hover:text-[#8C7A6B] hover:bg-[#FBF9F5] transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>

                        {/* Delete Record */}
                        <button
                          onClick={() => handleDelete(inq.id)}
                          title="Delete Record"
                          className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
