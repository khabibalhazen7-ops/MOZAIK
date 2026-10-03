import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  Star,
  Layers,
  AlertCircle,
  Check,
  X
} from 'lucide-react';
import { getProducts, getCategories, deleteProduct } from '../../services/db';
import { Product, Category } from '../../types';

export const AdminProducts: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Delete Confirmation Modal State
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [prods, cats] = await Promise.all([getProducts(), getCategories()]);
      setProducts(prods);
      setCategories(cats);
    } catch (err: any) {
      console.error("Products load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleConfirmDelete = async () => {
    if (!productToDelete?.id) return;
    setDeleting(true);
    try {
      await deleteProduct(productToDelete.id, productToDelete);
      setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));
      setFeedbackMessage({
        type: 'success',
        text: `Product "${productToDelete.name}" deleted successfully from Firestore and Storage.`
      });
      setProductToDelete(null);
    } catch (err: any) {
      console.error("Delete error:", err);
      setFeedbackMessage({
        type: 'error',
        text: 'Failed to delete product. Please try again.'
      });
    } finally {
      setDeleting(false);
    }
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.material?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCat =
        selectedCategory === 'All' ||
        p.category.toLowerCase() === selectedCategory.toLowerCase();

      const matchStatus =
        selectedStatus === 'All' ||
        (selectedStatus === 'Featured' ? p.featured : p.availability?.toLowerCase().includes(selectedStatus.toLowerCase()));

      return matchSearch && matchCat && matchStatus;
    });
  }, [products, searchQuery, selectedCategory, selectedStatus]);

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E5DFD5]">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-[#8C7A6B] font-semibold font-mono">
            CATALOG MANAGEMENT
          </span>
          <h1 className="font-serif text-3xl text-[#2C2926] mt-1 font-normal">
            Products ({products.length})
          </h1>
        </div>

        <Link
          to="/admin/products/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2C2926] text-white hover:bg-[#4A4036] text-xs uppercase tracking-[0.16em] font-semibold transition-all shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Product</span>
        </Link>
      </div>

      {/* Feedback Alert */}
      {feedbackMessage && (
        <div
          className={`p-4 border text-xs flex items-center justify-between gap-2 ${
            feedbackMessage.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedbackMessage.type === 'success' ? (
              <Check className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{feedbackMessage.text}</span>
          </div>
          <button
            onClick={() => setFeedbackMessage(null)}
            className="text-xs underline hover:opacity-80"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Filters & Search Toolbar */}
      <div className="bg-white p-5 border border-[#E5DFD5] flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7B756C]" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#FBF9F5] border border-[#E5DFD5] pl-10 pr-4 py-2 text-xs text-[#2C2926] placeholder-[#A89F8D] focus:outline-hidden focus:border-[#2C2926]"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto">
          {/* Category Filter */}
          <div className="flex items-center gap-1.5 shrink-0 text-xs">
            <span className="text-[#7B756C] font-mono text-[11px] uppercase">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-[#FBF9F5] border border-[#E5DFD5] px-3 py-1.5 text-xs text-[#2C2926] focus:outline-hidden"
            >
              <option value="All">All Categories</option>
              {categories.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 shrink-0 text-xs">
            <span className="text-[#7B756C] font-mono text-[11px] uppercase">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-[#FBF9F5] border border-[#E5DFD5] px-3 py-1.5 text-xs text-[#2C2926] focus:outline-hidden"
            >
              <option value="All">All Statuses</option>
              <option value="In Stock">In Stock</option>
              <option value="Custom Cut">Custom Cut</option>
              <option value="Made to Order">Made to Order</option>
              <option value="Featured">Featured Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Table / Empty State / Loading State */}
      <div className="bg-white border border-[#E5DFD5] shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-xs text-[#7B756C] space-y-3">
            <div className="w-8 h-8 border-2 border-[#2C2926] border-t-transparent animate-spin rounded-full mx-auto" />
            <p>Loading products from Firestore database...</p>
          </div>
        ) : products.length === 0 ? (
          /* Empty State */
          <div className="p-16 text-center space-y-4">
            <Layers className="w-12 h-12 text-[#A89F8D] mx-auto" />
            <h3 className="font-serif text-2xl text-[#2C2926]">No products yet.</h3>
            <p className="text-xs text-[#7B756C] max-w-sm mx-auto">
              Start by publishing your first natural stone material, pebble mosaic, or architectural paver to the collection.
            </p>
            <div className="pt-2">
              <Link
                to="/admin/products/new"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#2C2926] text-white hover:bg-[#4A4036] text-xs uppercase tracking-wider font-semibold transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Your First Product</span>
              </Link>
            </div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#7B756C]">
            No products match the selected filters or search criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FBF9F5] border-b border-[#E5DFD5] text-[#7B756C] uppercase font-mono">
                <tr>
                  <th className="py-3.5 px-4">Product Image</th>
                  <th className="py-3.5 px-4">Product Name</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Featured</th>
                  <th className="py-3.5 px-4">Updated Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFECE6]">
                {filteredProducts.map((p) => {
                  const updatedDate = p.updatedAt
                    ? new Date(p.updatedAt).toLocaleDateString()
                    : p.createdAt
                    ? new Date(p.createdAt).toLocaleDateString()
                    : '-';

                  return (
                    <tr key={p.id || p.slug} className="hover:bg-[#FBF9F5] transition-colors">
                      {/* Product Image */}
                      <td className="py-3 px-4">
                        <div className="w-14 h-14 bg-[#EFECE6] border border-[#E5DFD5] overflow-hidden shrink-0">
                          <img
                            src={p.mainImage}
                            alt={p.name}
                            loading="lazy"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </td>

                      {/* Product Name & Slug */}
                      <td className="py-3 px-4">
                        <Link
                          to={`/admin/products/${p.id || p.slug}/edit`}
                          className="font-medium text-sm text-[#2C2926] hover:text-[#8C7A6B] transition-colors block"
                        >
                          {p.name}
                        </Link>
                        <span className="text-[11px] text-[#7B756C] font-mono block">
                          /products/{p.slug}
                        </span>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-1 bg-[#EFECE6] text-[#2C2926] uppercase text-[10px] tracking-wider font-medium">
                          {p.category}
                        </span>
                      </td>

                      {/* Status / Availability */}
                      <td className="py-3 px-4">
                        <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 bg-green-50 text-green-800 border border-green-200 font-medium">
                          {p.availability || 'In Stock'}
                        </span>
                      </td>

                      {/* Featured */}
                      <td className="py-3 px-4">
                        {p.featured ? (
                          <span className="inline-flex items-center gap-1 text-[10px] text-amber-800 bg-amber-100 px-2 py-0.5 font-medium">
                            <Star className="w-3 h-3 fill-amber-700 text-amber-700" />
                            Featured
                          </span>
                        ) : (
                          <span className="text-[#A89F8D] text-[11px]">-</span>
                        )}
                      </td>

                      {/* Updated Date */}
                      <td className="py-3 px-4 text-[#7B756C] font-mono text-[11px]">
                        {updatedDate}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right space-x-2">
                        {/* View Public Page */}
                        <a
                          href={`/products/${p.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-block p-1.5 text-[#7B756C] hover:text-[#2C2926] transition-colors"
                          title="View on Public Website"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>

                        {/* Edit */}
                        <Link
                          to={`/admin/products/${p.id || p.slug}/edit`}
                          className="inline-block p-1.5 text-[#2C2926] hover:text-[#8C7A6B] transition-colors"
                          title="Edit Product"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() => setProductToDelete(p)}
                          className="p-1.5 text-red-600 hover:text-red-800 transition-colors cursor-pointer"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 10. DELETE CONFIRMATION MODAL */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 bg-[#1C1A18]/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border border-[#E5DFD5] shadow-2xl p-6 sm:p-8 space-y-5 text-xs animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5DFD5]">
              <div className="flex items-center gap-2 text-red-700">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <h3 className="font-serif text-lg text-[#2C2926]">Delete Product</h3>
              </div>
              <button
                onClick={() => setProductToDelete(null)}
                className="text-[#7B756C] hover:text-[#2C2926]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-sm text-[#2C2926] leading-relaxed">
              Are you sure you want to delete this product?
            </p>

            <div className="bg-[#FBF9F5] p-3 border border-[#E5DFD5] flex items-center gap-3">
              <img
                src={productToDelete.mainImage}
                alt=""
                className="w-12 h-12 object-cover border"
              />
              <div className="min-w-0">
                <strong className="block text-[#2C2926] truncate">{productToDelete.name}</strong>
                <span className="text-[#8C7A6B] font-mono text-[10px] block">
                  {productToDelete.category} • {productToDelete.slug}
                </span>
              </div>
            </div>

            <p className="text-[#7B756C] text-[11px] leading-relaxed">
              This will permanently remove the product document from Firestore, delete associated image files from Firebase Storage, and remove it from the public catalog.
            </p>

            <div className="pt-3 border-t border-[#E5DFD5] flex items-center justify-end gap-3">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setProductToDelete(null)}
                className="px-5 py-2.5 border border-[#E5DFD5] bg-white text-[#7B756C] hover:text-[#2C2926] uppercase tracking-wider font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleConfirmDelete}
                className="px-6 py-2.5 bg-red-700 text-white hover:bg-red-800 uppercase tracking-wider font-semibold transition-all cursor-pointer disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
