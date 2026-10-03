import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Upload, Check, AlertCircle, Search, ExternalLink, Star } from 'lucide-react';
import { getCategories, saveCategory, deleteCategory, uploadCategoryImage } from '../../services/db';
import { Category } from '../../types';

export const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [featured, setFeatured] = useState(false);
  const [order, setOrder] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setName('');
    setSlug('');
    setDescription('');
    setImage('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80');
    setSeoTitle('');
    setSeoDescription('');
    setFeatured(false);
    setOrder(categories.length + 1);
    setStatusMessage(null);
    setUploadProgress(0);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: Category) => {
    setEditingCategory(c);
    setName(c.name);
    setSlug(c.slug);
    setDescription(c.description || '');
    setImage(c.image || '');
    setSeoTitle(c.seoTitle || '');
    setSeoDescription(c.seoDescription || '');
    setFeatured(!!c.featured);
    setOrder(c.order || 1);
    setStatusMessage(null);
    setUploadProgress(0);
    setIsModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingCategory) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''));
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      setStatusMessage({ type: 'error', text: 'Allowed formats: JPG, JPEG, PNG, WEBP.' });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setStatusMessage({ type: 'error', text: 'File exceeds maximum size of 10 MB.' });
      return;
    }

    setUploading(true);
    setUploadProgress(10);
    setStatusMessage(null);
    try {
      const targetId = editingCategory?.id || slug || 'cat_' + Date.now();
      const url = await uploadCategoryImage(file, targetId, (prog) => {
        setUploadProgress(prog);
      });
      setImage(url);
      setStatusMessage({ type: 'success', text: 'Image uploaded to Firebase Storage!' });
    } catch (err: any) {
      console.error(err);
      setStatusMessage({ type: 'error', text: err.message || 'Category image upload failed.' });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) {
      setStatusMessage({ type: 'error', text: 'Category Name and Slug are required.' });
      return;
    }

    setSaving(true);
    setStatusMessage(null);
    try {
      await saveCategory(
        {
          name: name.trim(),
          slug: slug.trim(),
          description: description.trim(),
          image: image.trim(),
          seoTitle: seoTitle.trim() || `${name.trim()} Collection | MOZAIK Natural Stone`,
          seoDescription: seoDescription.trim() || description.trim(),
          featured,
          order: Number(order)
        },
        editingCategory?.id
      );
      setStatusMessage({ type: 'success', text: 'Category saved successfully!' });
      await loadData();
      setTimeout(() => setIsModalOpen(false), 600);
    } catch (err: any) {
      console.error(err);
      setStatusMessage({ type: 'error', text: err.message || 'Failed to save category.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (cat: Category) => {
    if (!cat.id) return;
    if (window.confirm(`Are you sure you want to delete category "${cat.name}"?`)) {
      try {
        await deleteCategory(cat.id, cat);
        await loadData();
      } catch (err) {
        console.error(err);
        alert("Failed to delete category.");
      }
    }
  };

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E5DFD5]">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-[#8C7A6B] font-semibold">
            Catalog Structure & Taxonomies
          </span>
          <h1 className="font-serif text-3xl text-[#2C2926] mt-1">
            Category Management ({categories.length})
          </h1>
          <p className="text-xs text-[#7B756C] mt-1 font-light">
            Manage Indonesian quarry material groups, SEO titles, descriptions, and cover banners stored in Firebase.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2C2926] text-white hover:bg-[#4A4036] text-xs uppercase tracking-[0.16em] font-semibold transition-all cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#7B756C]" />
          <input
            type="text"
            placeholder="Search categories by name, slug or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-[#E5DFD5] text-xs text-[#2C2926] placeholder-[#A0988E] focus:outline-hidden focus:border-[#2C2926]"
          />
        </div>
        <div className="text-xs text-[#8C7A6B] font-mono">
          Showing {filteredCategories.length} of {categories.length}
        </div>
      </div>

      {/* Categories Grid */}
      {loading ? (
        <div className="py-20 text-center text-xs text-[#8C7A6B] font-mono">
          Loading categories from Firestore...
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="py-20 text-center bg-white border border-[#E5DFD5] p-8 text-xs text-[#8C7A6B]">
          No categories found matching your query.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((cat) => (
            <div
              key={cat.id || cat.slug}
              className="bg-white border border-[#E5DFD5] overflow-hidden flex flex-col justify-between group hover:border-[#8C7A6B] transition-colors"
            >
              <div className="relative aspect-16/9 bg-[#EFECE6] overflow-hidden">
                <img
                  src={cat.image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                />
                <div className="absolute top-2 left-2 flex items-center gap-1.5">
                  <span className="bg-[#1C1A18]/85 text-white text-[10px] px-2 py-0.5 font-mono uppercase tracking-wider">
                    Order #{cat.order ?? 1}
                  </span>
                  {cat.featured && (
                    <span className="bg-[#8C7A6B] text-white text-[10px] px-2 py-0.5 font-mono uppercase tracking-wider flex items-center gap-1">
                      <Star className="w-2.5 h-2.5 fill-white" /> Featured
                    </span>
                  )}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-lg font-medium text-[#2C2926] mb-1">
                    {cat.name}
                  </h3>
                  <span className="text-[11px] text-[#8C7A6B] font-mono block mb-2">
                    /collection/{cat.slug}
                  </span>
                  <p className="text-xs text-[#7B756C] line-clamp-2 leading-relaxed">
                    {cat.description || 'No description provided.'}
                  </p>
                  {cat.seoTitle && (
                    <div className="mt-3 pt-3 border-t border-[#F2EFE9] text-[10px] text-[#8C7A6B] space-y-0.5">
                      <p className="truncate"><span className="font-semibold text-[#2C2926]">SEO:</span> {cat.seoTitle}</p>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-[#EFECE6] flex items-center justify-between mt-4">
                  <a
                    href={`/collection/${cat.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-[#2C2926] hover:text-[#8C7A6B] font-semibold"
                  >
                    <span>View Public Page</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(cat)}
                      title="Edit Category"
                      className="p-1.5 text-[#2C2926] hover:text-[#8C7A6B] cursor-pointer transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(cat)}
                      title="Delete Category"
                      className="p-1.5 text-red-600 hover:text-red-800 cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#1C1A18]/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-xl bg-white border border-[#E5DFD5] shadow-2xl p-6 sm:p-8 space-y-6 text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5DFD5]">
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#8C7A6B] font-mono">
                  {editingCategory ? 'Update Existing Category' : 'Create New Category'}
                </span>
                <h3 className="font-serif text-2xl text-[#2C2926] mt-0.5">
                  {editingCategory ? editingCategory.name : 'New Category'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#7B756C] hover:text-[#2C2926] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {statusMessage && (
              <div
                className={`p-3 border text-xs flex items-center gap-2 ${
                  statusMessage.type === 'success'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-red-50 border-red-200 text-red-800'
                }`}
              >
                {statusMessage.type === 'success' ? (
                  <Check className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
                <span>{statusMessage.text}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#7B756C] uppercase font-mono tracking-wider mb-1">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mosaic Stone"
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full bg-[#FBF9F5] border border-[#E5DFD5] p-2.5 text-[#2C2926] focus:outline-hidden focus:border-[#2C2926]"
                  />
                </div>

                <div>
                  <label className="block text-[#7B756C] uppercase font-mono tracking-wider mb-1">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. mosaic-stone"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full bg-[#FBF9F5] border border-[#E5DFD5] p-2.5 text-[#2C2926] font-mono focus:outline-hidden focus:border-[#2C2926]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#7B756C] uppercase font-mono tracking-wider mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={order}
                    onChange={(e) => setOrder(Number(e.target.value))}
                    className="w-full bg-[#FBF9F5] border border-[#E5DFD5] p-2.5 text-[#2C2926] focus:outline-hidden focus:border-[#2C2926]"
                  />
                </div>

                <div className="flex items-center pt-6">
                  <label className="inline-flex items-center gap-2 cursor-pointer text-[#2C2926]">
                    <input
                      type="checkbox"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                      className="w-4 h-4 accent-[#2C2926]"
                    />
                    <span className="text-xs uppercase font-mono tracking-wider">
                      Featured on Homepage
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-[#7B756C] uppercase font-mono tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Architectural summary and quarry material characteristics..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#FBF9F5] border border-[#E5DFD5] p-2.5 text-[#2C2926] focus:outline-hidden focus:border-[#2C2926]"
                />
              </div>

              {/* Cover Image Upload (Firebase Storage: categories/{categoryId}/cover/) */}
              <div>
                <label className="block text-[#7B756C] uppercase font-mono tracking-wider mb-1">
                  Category Cover Image (Stored in Firebase Storage)
                </label>
                
                {image && (
                  <div className="relative aspect-16/9 w-full max-w-xs mb-2 bg-[#EFECE6] border border-[#E5DFD5] overflow-hidden group">
                    <img src={image} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setImage('')}
                      className="absolute top-2 right-2 bg-red-600 text-white p-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Remove image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                <div className="space-y-2">
                  <input
                    type="url"
                    placeholder="https://... or upload image file below"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="w-full bg-[#FBF9F5] border border-[#E5DFD5] p-2 text-[#2C2926] font-mono text-[11px]"
                  />
                  <div className="flex items-center gap-3">
                    <label className="inline-flex items-center gap-2 px-3 py-2 bg-[#EFECE6] hover:bg-[#E5DFD5] text-[#2C2926] cursor-pointer text-xs font-semibold transition-colors">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploading ? `Uploading (${uploadProgress}%)...` : 'Upload File (Max 10MB)'}</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        disabled={uploading}
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                    <span className="text-[10px] text-[#8C7A6B]">
                      JPG, PNG, WEBP. Uploads to categories/{'{id}'}/cover/
                    </span>
                  </div>
                </div>
              </div>

              {/* SEO Meta Fields */}
              <div className="pt-2 border-t border-[#F2EFE9] space-y-3">
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#8C7A6B] block">
                  SEO Configuration
                </span>
                <div>
                  <label className="block text-[#7B756C] uppercase font-mono tracking-wider mb-1">
                    SEO Meta Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Mosaic Stone Collection | MOZAIK Natural Stone"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    className="w-full bg-[#FBF9F5] border border-[#E5DFD5] p-2.5 text-[#2C2926] focus:outline-hidden focus:border-[#2C2926]"
                  />
                </div>
                <div>
                  <label className="block text-[#7B756C] uppercase font-mono tracking-wider mb-1">
                    SEO Meta Description
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Meta description for search engine listings..."
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                    className="w-full bg-[#FBF9F5] border border-[#E5DFD5] p-2.5 text-[#2C2926] focus:outline-hidden focus:border-[#2C2926]"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[#E5DFD5] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-[#E5DFD5] text-[#7B756C] hover:bg-[#FBF9F5] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="px-6 py-2 bg-[#2C2926] hover:bg-[#4A4036] text-white uppercase tracking-wider font-semibold cursor-pointer disabled:opacity-50 transition-colors"
                >
                  {saving ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
