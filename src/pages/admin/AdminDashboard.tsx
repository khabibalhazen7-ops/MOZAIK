import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  Star,
  FolderTree,
  Inbox,
  Plus,
  ArrowRight,
  TrendingUp,
  Image as ImageIcon,
  Building,
  CheckCircle2,
  Clock,
  PhoneCall,
  DollarSign,
  Trophy
} from 'lucide-react';
import { getDashboardStatistics, getProducts } from '../../services/db';
import { Product } from '../../types';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    featuredProducts: 0,
    totalProjects: 0,
    featuredProjects: 0,
    totalGallery: 0,
    totalInquiries: 0,
    newInquiries: 0,
    contacted: 0,
    quoted: 0,
    won: 0
  });
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [dashStats, prodList] = await Promise.all([
          getDashboardStatistics(),
          getProducts()
        ]);
        setStats(dashStats);
        setRecentProducts(prodList || []);
      } catch (err) {
        console.error("Dashboard metrics error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E5DFD5]">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-[#8C7A6B] font-semibold font-mono">
            PORTAL OVERVIEW
          </span>
          <h1 className="font-serif text-3xl text-[#2C2926] mt-1 font-normal">
            Admin Dashboard
          </h1>
          <p className="text-xs text-[#7B756C] mt-1 font-light">
            Real-time Firestore metrics for natural stone catalog, project portfolios, and customer inquiries.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/products/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2C2926] text-white hover:bg-[#4A4036] text-xs uppercase tracking-[0.16em] font-semibold transition-all shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </Link>
        </div>
      </div>

      {/* Row 1: Core Content Catalog Statistics - Requirement 19 */}
      <div>
        <span className="text-[10px] uppercase font-mono tracking-widest text-[#8C7A6B] block mb-3">
          Content & Asset Inventory
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Total Products */}
          <div className="bg-white p-6 border border-[#E5DFD5] shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-wider text-[#7B756C] font-mono">
                Total Products
              </span>
              <div className="p-2.5 bg-[#EFECE6] text-[#2C2926]">
                <Layers className="w-5 h-5" />
              </div>
            </div>
            <div className="font-serif text-3xl font-medium text-[#2C2926]">
              {loading ? '-' : stats.totalProducts}
            </div>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#F2EFE9] text-[11px]">
              <span className="text-[#8C7A6B]">
                {stats.featuredProducts} featured
              </span>
              <Link
                to="/admin/products"
                className="text-[#2C2926] hover:text-[#8C7A6B] inline-flex items-center gap-1 font-semibold"
              >
                <span>View</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Total Projects */}
          <div className="bg-white p-6 border border-[#E5DFD5] shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-wider text-[#7B756C] font-mono">
                Total Projects
              </span>
              <div className="p-2.5 bg-[#EFECE6] text-[#2C2926]">
                <Building className="w-5 h-5" />
              </div>
            </div>
            <div className="font-serif text-3xl font-medium text-[#2C2926]">
              {loading ? '-' : stats.totalProjects}
            </div>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#F2EFE9] text-[11px]">
              <span className="text-[#8C7A6B]">
                {stats.featuredProjects} highlighted
              </span>
              <Link
                to="/admin/projects"
                className="text-[#2C2926] hover:text-[#8C7A6B] inline-flex items-center gap-1 font-semibold"
              >
                <span>View</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Total Gallery Images */}
          <div className="bg-white p-6 border border-[#E5DFD5] shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-wider text-[#7B756C] font-mono">
                Total Gallery Images
              </span>
              <div className="p-2.5 bg-[#EFECE6] text-[#2C2926]">
                <ImageIcon className="w-5 h-5" />
              </div>
            </div>
            <div className="font-serif text-3xl font-medium text-[#2C2926]">
              {loading ? '-' : stats.totalGallery}
            </div>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#F2EFE9] text-[11px]">
              <span className="text-[#8C7A6B]">Inspiration photos</span>
              <Link
                to="/admin/gallery"
                className="text-[#2C2926] hover:text-[#8C7A6B] inline-flex items-center gap-1 font-semibold"
              >
                <span>View</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Lead Generation Pipeline Statistics - Requirement 19 */}
      <div>
        <span className="text-[10px] uppercase font-mono tracking-widest text-[#8C7A6B] block mb-3">
          Customer Inquiry Pipeline (status in Firestore)
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* New Inquiries (status == 'new') */}
          <div className="bg-white p-6 border border-[#E5DFD5] shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-wider text-[#7B756C] font-mono">
                New Inquiries
              </span>
              <div className="p-2 bg-amber-50 text-amber-800 border border-amber-200">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="font-serif text-3xl font-medium text-[#2C2926] flex items-baseline gap-2">
              <span>{loading ? '-' : stats.newInquiries}</span>
              {stats.newInquiries > 0 && (
                <span className="text-[10px] text-amber-800 bg-amber-100 px-2 py-0.5 font-mono uppercase">
                  Action Needed
                </span>
              )}
            </div>
            <Link
              to="/admin/inquiries"
              className="text-[11px] text-[#8C7A6B] hover:text-[#2C2926] mt-2 inline-flex items-center gap-1 font-semibold"
            >
              <span>Review Inquiries</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Contacted */}
          <div className="bg-white p-6 border border-[#E5DFD5] shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-wider text-[#7B756C] font-mono">
                Contacted
              </span>
              <div className="p-2 bg-blue-50 text-blue-800 border border-blue-200">
                <PhoneCall className="w-4 h-4" />
              </div>
            </div>
            <div className="font-serif text-3xl font-medium text-[#2C2926]">
              {loading ? '-' : stats.contacted}
            </div>
            <span className="text-[11px] text-[#8C7A6B] mt-2 block font-mono">
              In discussion
            </span>
          </div>

          {/* Quoted */}
          <div className="bg-white p-6 border border-[#E5DFD5] shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-wider text-[#7B756C] font-mono">
                Quoted
              </span>
              <div className="p-2 bg-purple-50 text-purple-800 border border-purple-200">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="font-serif text-3xl font-medium text-[#2C2926]">
              {loading ? '-' : stats.quoted}
            </div>
            <span className="text-[11px] text-[#8C7A6B] mt-2 block font-mono">
              Proposal submitted
            </span>
          </div>

          {/* Won */}
          <div className="bg-white p-6 border border-[#E5DFD5] shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-wider text-[#7B756C] font-mono">
                Won
              </span>
              <div className="p-2 bg-emerald-50 text-emerald-800 border border-emerald-200">
                <Trophy className="w-4 h-4" />
              </div>
            </div>
            <div className="font-serif text-3xl font-medium text-[#2C2926]">
              {loading ? '-' : stats.won}
            </div>
            <span className="text-[11px] text-[#8C7A6B] mt-2 block font-mono">
              Order confirmed
            </span>
          </div>
        </div>
      </div>

      {/* Quick Launch & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Recent Products */}
        <div className="lg:col-span-8 bg-white border border-[#E5DFD5] p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#EFECE6]">
            <div>
              <h2 className="font-serif text-xl text-[#2C2926]">
                Recent Natural Stone Products
              </h2>
              <p className="text-xs text-[#7B756C] mt-0.5">
                Active catalog materials loaded directly from Firestore.
              </p>
            </div>
            <Link
              to="/admin/products"
              className="text-xs uppercase tracking-[0.16em] text-[#2C2926] font-semibold hover:text-[#8C7A6B] inline-flex items-center"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs text-[#7B756C]">
              Loading product catalog...
            </div>
          ) : recentProducts.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#7B756C]">
              No products found in Firestore. Click "+ Add Product" to publish your first material.
            </div>
          ) : (
            <div className="divide-y divide-[#EFECE6]">
              {recentProducts.slice(0, 5).map((p) => (
                <div
                  key={p.id || p.slug}
                  className="py-3.5 flex items-center justify-between gap-4 hover:bg-[#FBF9F5] px-2 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 bg-[#EFECE6] border border-[#E5DFD5] overflow-hidden shrink-0">
                      <img
                        src={p.mainImage}
                        alt={p.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-serif text-sm font-medium text-[#2C2926] truncate">
                        {p.name}
                      </h4>
                      <span className="text-[10px] text-[#8C7A6B] font-mono">
                        {p.category} • {p.finish || 'Honed'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-[#EFECE6] text-[#2C2926]">
                      {p.availability}
                    </span>
                    <Link
                      to={`/admin/products/${p.id || p.slug}/edit`}
                      className="text-xs uppercase tracking-wider text-[#2C2926] hover:text-[#8C7A6B] font-semibold"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Quick Shortcuts */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#2C2926] text-white p-6 sm:p-8 border border-[#1C1A18] space-y-4 shadow-xs">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#D4CCB8] font-mono block">
              COMMERCIAL INBOX
            </span>
            <h3 className="font-serif text-2xl text-white">
              Customer Leads
            </h3>
            <p className="text-xs text-[#D4CCB8]/80 leading-relaxed font-light">
              Respond directly to architects and project developers requesting quotation estimates and material samples.
            </p>
            <Link
              to="/admin/inquiries"
              className="inline-flex items-center justify-center w-full py-3 px-4 bg-[#FBF9F5] text-[#1C1A18] hover:bg-[#D4CCB8] text-xs uppercase tracking-[0.18em] font-semibold transition-all mt-2 cursor-pointer shadow-xs"
            >
              <span>Manage Inquiries ({stats.newInquiries} New)</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Link>
          </div>

          <div className="bg-white p-6 border border-[#E5DFD5] space-y-3 shadow-xs">
            <h4 className="font-serif text-base text-[#2C2926] pb-2 border-b border-[#EFECE6]">
              Catalog Maintenance
            </h4>
            <div className="space-y-2 text-xs">
              <Link
                to="/admin/products"
                className="flex items-center justify-between p-2.5 bg-[#FBF9F5] hover:bg-[#EFECE6] transition-colors"
              >
                <span>Filter & Search Products</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#7B756C]" />
              </Link>
              <Link
                to="/admin/categories"
                className="flex items-center justify-between p-2.5 bg-[#FBF9F5] hover:bg-[#EFECE6] transition-colors"
              >
                <span>Manage Categories & SEO</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#7B756C]" />
              </Link>
              <Link
                to="/admin/gallery"
                className="flex items-center justify-between p-2.5 bg-[#FBF9F5] hover:bg-[#EFECE6] transition-colors"
              >
                <span>Manage Gallery & Photos</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#7B756C]" />
              </Link>
              <Link
                to="/admin/projects"
                className="flex items-center justify-between p-2.5 bg-[#FBF9F5] hover:bg-[#EFECE6] transition-colors"
              >
                <span>Manage Architectural Projects</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#7B756C]" />
              </Link>
              <Link
                to="/admin/settings"
                className="flex items-center justify-between p-2.5 bg-[#FBF9F5] hover:bg-[#EFECE6] transition-colors"
              >
                <span>Configure WhatsApp & Studio Settings</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#7B756C]" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
