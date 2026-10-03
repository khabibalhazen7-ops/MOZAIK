import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Upload, Check, AlertCircle, ZoomIn, Star, Search, Filter, ExternalLink } from 'lucide-react';
import { getGallery, saveGalleryItem, deleteGalleryItem, uploadGalleryImage } from '../../services/db';
import { GalleryItem } from '../../types';

export const AdminGallery: React.FC = () => {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);

  // Form
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Landscape');
  const [customCategory, setCustomCategory] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [altText, setAltText] = useState('');
  const [featured, setFeatured] = useState(false);
  const [order, setOrder] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const categories = [
    'Landscape',
    'Garden',
    'Interior',
    'Exterior',
    'Pool',
    'Wall',
    'Commercial',
    'Custom'
  ];

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getGallery();
      setGallery(data);
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
    setEditingItem(null);
    setTitle('');
    setCategory('Landscape');
    setCustomCategory('');
    setDescription('');
    setImage('https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=80');
    setAltText('');
    setFeatured(false);
    setOrder(gallery.length + 1);
    setStatusMessage(null);
    setUploadProgress(0);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: GalleryItem) => {
    setEditingItem(item);
    setTitle(item.title);
    if (categories.includes(item.category)) {
      setCategory(item.category);
      setCustomCategory('');
    } else {
      setCategory('Custom');
      setCustomCategory(item.category);
    }
    setDescription(item.description || '');
    setImage(item.imageUrl || item.image || '');
    setAltText(item.altText || '');
    setFeatured(!!item.featured);
    setOrder(item.order || 1);
    setStatusMessage(null);
    setUploadProgress(0);
    setIsModalOpen(true);
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
      const targetId = editingItem?.id || 'gal_' + Date.now();
      const url = await uploadGalleryImage(file, targetId, (prog) => {
        setUploadProgress(prog);
      });
      setImage(url);
      if (!altText) {
        setAltText(`${title || 'Natural Stone'} Installation`);
      }
      setStatusMessage({ type: 'success', text: 'Image uploaded to Firebase Storage!' });
    } catch (err: any) {
      console.error(err);
      setStatusMessage({ type: 'error', text: err.message || 'Gallery image upload failed.' });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !image.trim()) {
      setStatusMessage({ type: 'error', text: 'Title and Image are required.' });
      return;
    }

    const finalCategory = category === 'Custom' ? (customCategory.trim() || 'General') : category;

    setSaving(true);
    setStatusMessage(null);
    try {
      await saveGalleryItem(
        {
          title: title.trim(),
          category: finalCategory,
          description: description.trim(),
          image: image.trim(),
          imageUrl: image.trim(),
          altText: altText.trim() || `${title.trim()} - MOZAIK Natural Stone`,
          featured,
          order: Number(order)
        },
        editingItem?.id
      );
      setStatusMessage({ type: 'success', text: 'Gallery photo saved successfully!' });
      await loadData();
      setTimeout(() => setIsModalOpen(false), 600);
    } catch (err: any) {
      console.error(err);
      setStatusMessage({ type: 'error', text: err.message || 'Failed to save gallery photo.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item: GalleryItem) => {
    if (!item.id) return;
    if (window.confirm(`Delete gallery photo "${item.title}"?`)) {
      try {
        await deleteGalleryItem(item.id, item);
        await loadData();
      } catch (err) {
        console.error(err);
        alert("Failed to delete gallery item.");
      }
    }
  };

  const filteredGallery = gallery.filter((item) => {
    const matchesFilter = filterCategory === 'All' || item.category.toLowerCase() === filterCategory.toLowerCase();
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E5DFD5]">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-[#8C7A6B] font-semibold">
            Inspiration Media Library
          </span>
          <h1 className="font-serif text-3xl text-[#2C2926] mt-1">
            Gallery Management ({gallery.length})
          </h1>
          <p className="text-xs text-[#7B756C] mt-1 font-light">
            Upload and organize architectural natural stone project photography stored in Firebase Storage.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2C2926] text-white hover:bg-[#4A4036] text-xs uppercase tracking-[0.16em] font-semibold transition-all cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Gallery Photo</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#7B756C]" />
          <input
            type="text"
            placeholder="Search gallery by title, category, description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-[#E5DFD5] text-xs text-[#2C2926] placeholder-[#A0988E] focus:outline-hidden focus:border-[#2C2926]"
          />
        </div>

        {/* Category Pills Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
          <span className="text-[10px] uppercase font-mono tracking-wider text-[#8C7A6B] mr-1 hidden lg:inline">
            Category:
          </span>
          {['All', 'Landscape', 'Garden', 'Interior', 'Exterior', 'Pool', 'Wall', 'Commercial'].map((c) => (
            <button
              key={c}
              onClick={() => setFilterCategory(c)}
              className={`px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider transition-colors cursor-pointer shrink-0 ${
                filterCategory.toLowerCase() === c.toLowerCase()
                  ? 'bg-[#2C2926] text-white'
                  : 'bg-white border border-[#E5DFD5] text-[#7B756C] hover:text-[#2C2926]'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Gallery Photos */}
      {loading ? (
        <div className="py-20 text-center text-xs text-[#8C7A6B] font-mono">
          Loading gallery photos from Firestore...
        </div>
      ) : filteredGallery.length === 0 ? (
        <div className="py-20 text-center bg-white border border-[#E5DFD5] p-8 text-xs text-[#8C7A6B]">
          No gallery items found matching your filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredGallery.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-[#E5DFD5] overflow-hidden flex flex-col justify-between group hover:border-[#8C7A6B] transition-colors"
            >
              <div className="relative aspect-4/3 bg-[#EFECE6] overflow-hidden">
                <img
                  src={item.imageUrl || item.image}
                  alt={item.altText || item.title}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                />
                <div className="absolute top-2 left-2 flex items-center gap-1.5">
                  <span className="bg-[#1C1A18]/85 text-white text-[10px] px-2 py-0.5 font-mono uppercase tracking-wider">
                    {item.category}
                  </span>
                  {item.featured && (
                    <span className="bg-[#8C7A6B] text-white text-[10px] px-2 py-0.5 font-mono uppercase tracking-wider flex items-center gap-1">
                      <Star className="w-2.5 h-2.5 fill-white" /> Featured
                    </span>
                  )}
                </div>
                <div className="absolute top-2 right-2 bg-[#1C1A18]/85 text-white text-[10px] px-1.5 py-0.5 font-mono">
                  #{item.order ?? 1}
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-base font-medium text-[#2C2926] mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#7B756C] line-clamp-2 leading-relaxed">
                    {item.description || 'No description provided.'}
                  </p>
                  <p className="text-[10px] text-[#A0988E] font-mono mt-2 truncate">
                    Alt: {item.altText || item.title}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#EFECE6] flex items-center justify-between mt-3">
                  <a
                    href={`/gallery?filter=${encodeURIComponent(item.category)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-[#2C2926] hover:text-[#8C7A6B] font-semibold"
                  >
                    <span>View Public</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      title="Edit Gallery Photo"
                      className="p-1.5 text-[#2C2926] hover:text-[#8C7A6B] cursor-pointer transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
                      title="Delete Gallery Photo"
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

      {/* Gallery Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#1C1A18]/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-white border border-[#E5DFD5] shadow-2xl p-6 sm:p-8 space-y-6 text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5DFD5]">
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#8C7A6B] font-mono">
                  {editingItem ? 'Edit Gallery Photo' : 'Upload Gallery Photo'}
                </span>
                <h3 className="font-serif text-2xl text-[#2C2926] mt-0.5">
                  {editingItem ? editingItem.title : 'New Gallery Photo'}
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
              <div>
                <label className="block text-[#7B756C] uppercase font-mono tracking-wider mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Modern Lap Pool in Green Sukabumi"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#FBF9F5] border border-[#E5DFD5] p-2.5 text-[#2C2926] focus:outline-hidden focus:border-[#2C2926]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#7B756C] uppercase font-mono tracking-wider mb-1">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#FBF9F5] border border-[#E5DFD5] p-2.5 text-[#2C2926] focus:outline-hidden focus:border-[#2C2926]"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

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
              </div>

              {category === 'Custom' && (
                <div>
                  <label className="block text-[#7B756C] uppercase font-mono tracking-wider mb-1">
                    Custom Category Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Spa & Wellness"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className="w-full bg-[#FBF9F5] border border-[#E5DFD5] p-2.5 text-[#2C2926] focus:outline-hidden focus:border-[#2C2926]"
                  />
                </div>
              )}

              <div>
                <label className="block text-[#7B756C] uppercase font-mono tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Installation notes, stone finishes, architect details..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#FBF9F5] border border-[#E5DFD5] p-2.5 text-[#2C2926] focus:outline-hidden focus:border-[#2C2926]"
                />
              </div>

              {/* Photo Upload to Firebase Storage: gallery/{galleryId}/ */}
              <div>
                <label className="block text-[#7B756C] uppercase font-mono tracking-wider mb-1">
                  Photo (Stored in Firebase Storage) *
                </label>

                {image && (
                  <div className="relative aspect-4/3 w-full max-w-xs mb-2 bg-[#EFECE6] border border-[#E5DFD5] overflow-hidden group">
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
                    placeholder="https://... or upload photo file below"
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
                      JPG, PNG, WEBP. Uploads to gallery/{'{id}'}/
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[#7B756C] uppercase font-mono tracking-wider mb-1">
                  SEO Alt Text
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sukabumi Green stone swimming pool coping"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  className="w-full bg-[#FBF9F5] border border-[#E5DFD5] p-2.5 text-[#2C2926] focus:outline-hidden focus:border-[#2C2926]"
                />
              </div>

              <div className="pt-2">
                <label className="inline-flex items-center gap-2 cursor-pointer text-[#2C2926]">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="w-4 h-4 accent-[#2C2926]"
                  />
                  <span className="text-xs uppercase font-mono tracking-wider">
                    Feature in Homepage Gallery Highlight
                  </span>
                </label>
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
                  {saving ? 'Saving...' : 'Save Gallery Photo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
