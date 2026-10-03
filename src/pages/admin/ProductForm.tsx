import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Upload,
  X,
  Check,
  AlertCircle,
  Image as ImageIcon,
  ArrowUp,
  ArrowDown,
  Trash2,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import {
  getProductById,
  getCategories,
  saveProduct,
  uploadProductImage
} from '../../services/db';
import { Product, Category, ProductGalleryImage } from '../../types';

export const ProductForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [category, setCategory] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [material, setMaterial] = useState('');
  const [color, setColor] = useState('');
  const [size, setSize] = useState('');
  const [finish, setFinish] = useState('');
  const [applications, setApplications] = useState<string[]>(['Landscape', 'Exterior']);
  const [minimumOrder, setMinimumOrder] = useState('20 m²');
  const [availability, setAvailability] = useState('In Stock (Ready to Ship)');
  const [featured, setFeatured] = useState(false);
  const [mainImage, setMainImage] = useState('');
  const [galleryImages, setGalleryImages] = useState<ProductGalleryImage[]>([]);
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [seoKeywords, setSeoKeywords] = useState('');

  // Image Upload States
  const [mainUploadProgress, setMainUploadProgress] = useState<number | null>(null);
  const [galleryUploadProgress, setGalleryUploadProgress] = useState<number | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  const availableApplications = [
    'Landscape',
    'Garden',
    'Interior',
    'Exterior',
    'Pool',
    'Wall',
    'Commercial',
    'Bathroom'
  ];

  // Load Categories & Existing Product
  useEffect(() => {
    async function init() {
      try {
        const catList = await getCategories();
        setCategories(catList);

        if (isEditing && id) {
          const existing = await getProductById(id);
          if (existing) {
            setName(existing.name);
            setSlug(existing.slug);
            setCategory(existing.category || catList[0]?.name || 'Mosaic Stone');
            setCategoryId(existing.categoryId || '');
            setShortDescription(existing.shortDescription || '');
            setDescription(existing.description || '');
            setMaterial(existing.material || '');
            setColor(existing.color || '');
            setSize(existing.size || '');
            setFinish(existing.finish || '');
            setApplications(existing.applications || []);
            setMinimumOrder(existing.minimumOrder || '');
            setAvailability(existing.availability || 'In Stock (Ready to Ship)');
            setFeatured(Boolean(existing.featured));
            setMainImage(existing.mainImage || '');
            
            // Normalize gallery images
            const normalizedGallery: ProductGalleryImage[] = (existing.galleryImages || []).map((img, idx) => {
              if (typeof img === 'string') {
                return { url: img, alt: `${existing.name} view ${idx + 1}`, order: idx + 1 };
              }
              return {
                url: img.url,
                alt: img.alt || `${existing.name} angle`,
                order: img.order || idx + 1
              };
            });
            setGalleryImages(normalizedGallery);

            setSeoTitle(existing.seoTitle || '');
            setSeoDescription(existing.seoDescription || '');
            setSeoKeywords(existing.seoKeywords || '');
          } else {
            setStatusMessage({ type: 'error', text: 'Product not found in database.' });
          }
        } else {
          // Defaults for new product
          if (catList.length > 0) {
            setCategory(catList[0].name);
            setCategoryId(catList[0].id || catList[0].slug);
          }
          setMainImage('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80');
        }
      } catch (err: any) {
        console.error("Init error:", err);
        setStatusMessage({ type: 'error', text: 'Failed to load product data.' });
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [id, isEditing]);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEditing) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setSlug(generatedSlug);
      setSeoTitle(`${val} | MOZAIK Natural Stone`);
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCatName = e.target.value;
    setCategory(selectedCatName);
    const matched = categories.find((c) => c.name === selectedCatName);
    if (matched) {
      setCategoryId(matched.id || matched.slug);
    }
  };

  const toggleApplication = (app: string) => {
    if (applications.includes(app)) {
      setApplications(applications.filter((a) => a !== app));
    } else {
      setApplications([...applications, app]);
    }
  };

  // Main Image Upload
  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageError(null);
    setMainUploadProgress(5);
    try {
      const downloadUrl = await uploadProductImage(
        file,
        id || slug || 'new-product',
        'main',
        (progress) => setMainUploadProgress(progress)
      );
      setMainImage(downloadUrl);
    } catch (err: any) {
      console.error(err);
      setImageError(err.message || 'Main image upload failed.');
    } finally {
      setMainUploadProgress(null);
    }
  };

  // Gallery Images Upload
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setImageError(null);
    setGalleryUploadProgress(10);
    try {
      const newItems: ProductGalleryImage[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const progressPerFile = Math.round(((i + 1) / files.length) * 100);
        const downloadUrl = await uploadProductImage(
          file,
          id || slug || 'new-product',
          'gallery',
          () => setGalleryUploadProgress(progressPerFile)
        );
        newItems.push({
          url: downloadUrl,
          alt: `${name || 'Product'} gallery photo`,
          order: galleryImages.length + newItems.length + 1
        });
      }
      setGalleryImages((prev) => [...prev, ...newItems]);
    } catch (err: any) {
      console.error(err);
      setImageError(err.message || 'Gallery upload encountered an error.');
    } finally {
      setGalleryUploadProgress(null);
    }
  };

  // Reorder Gallery Images
  const moveGalleryImage = (index: number, direction: 'up' | 'down') => {
    const newItems = [...galleryImages];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;

    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;

    // Recalculate order field
    const reordered = newItems.map((item, idx) => ({ ...item, order: idx + 1 }));
    setGalleryImages(reordered);
  };

  const removeGalleryImage = (index: number) => {
    const filtered = galleryImages.filter((_, i) => i !== index);
    const reordered = filtered.map((item, idx) => ({ ...item, order: idx + 1 }));
    setGalleryImages(reordered);
  };

  const updateGalleryAlt = (index: number, alt: string) => {
    const updated = [...galleryImages];
    updated[index].alt = alt;
    setGalleryImages(updated);
  };

  // Submit Handler
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setImageError(null);
    setStatusMessage(null);

    if (!name.trim()) {
      setStatusMessage({ type: 'error', text: 'Product name is required.' });
      return;
    }
    if (!slug.trim()) {
      setStatusMessage({ type: 'error', text: 'Slug is required.' });
      return;
    }
    if (!mainImage.trim()) {
      setStatusMessage({ type: 'error', text: 'Please provide or upload a Main Image.' });
      return;
    }

    setSaving(true);
    try {
      const payload: Omit<Product, 'id'> = {
        name: name.trim(),
        slug: slug.trim(),
        categoryId: categoryId || category.toLowerCase().replace(/\s+/g, '-'),
        category: category || 'Natural Stone',
        shortDescription: shortDescription.trim(),
        description: description.trim(),
        material: material.trim(),
        color: color.trim(),
        size: size.trim(),
        finish: finish.trim(),
        applications,
        minimumOrder: minimumOrder.trim(),
        availability: availability.trim(),
        featured,
        mainImage: mainImage.trim(),
        galleryImages,
        seoTitle: seoTitle.trim() || `${name} | MOZAIK Natural Stone`,
        seoDescription: seoDescription.trim() || shortDescription.trim(),
        seoKeywords: seoKeywords.trim()
      };

      await saveProduct(payload, id);
      setStatusMessage({
        type: 'success',
        text: isEditing
          ? 'Product updated successfully in Firestore!'
          : 'Product created successfully in Firestore!'
      });

      setTimeout(() => {
        navigate('/admin/products');
      }, 1000);
    } catch (err: any) {
      console.error("Save product error:", err);
      setStatusMessage({
        type: 'error',
        text: err.message || 'Failed to save product to database.'
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-xs text-[#7B756C]">
        <div className="w-8 h-8 border-2 border-[#2C2926] border-t-transparent animate-spin rounded-full mx-auto mb-3" />
        <span>Loading Product Data...</span>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-10 max-w-5xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E5DFD5]">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/products"
            className="p-2 border border-[#E5DFD5] bg-white text-[#7B756C] hover:text-[#2C2926] transition-colors"
            title="Back to products list"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-[#8C7A6B] font-semibold font-mono">
              CATALOG EDITOR
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl text-[#2C2926] mt-0.5 font-normal">
              {isEditing ? `Edit: ${name || 'Product'}` : 'Add New Natural Stone Product'}
            </h1>
          </div>
        </div>

        {isEditing && slug && (
          <a
            href={`/products/${slug}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center text-xs uppercase tracking-wider text-[#4A4036] bg-white border border-[#E5DFD5] px-3.5 py-2 hover:bg-[#EFECE6] transition-colors font-medium"
          >
            <span>View Public Page</span>
            <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
          </a>
        )}
      </div>

      {/* Status Messages */}
      {statusMessage && (
        <div
          className={`p-4 border text-xs flex items-center gap-2.5 ${
            statusMessage.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-800'
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

      {imageError && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{imageError}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8 text-xs">
        {/* SECTION 1: BASIC INFORMATION */}
        <div className="bg-white border border-[#E5DFD5] p-6 sm:p-8 space-y-5 shadow-xs">
          <h2 className="font-serif text-lg text-[#2C2926] pb-3 border-b border-[#EFECE6]">
            1. Core Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-[#7B756C] uppercase font-mono tracking-wider mb-1.5">
                Product Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. White River Pebble Mosaic"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full bg-[#FBF9F5] border border-[#E5DFD5] p-2.5 text-[#2C2926] focus:outline-hidden focus:border-[#2C2926]"
              />
            </div>

            <div>
              <label className="block text-[#7B756C] uppercase font-mono tracking-wider mb-1.5">
                URL Slug * (SEO-friendly)
              </label>
              <input
                type="text"
                required
                placeholder="e.g. white-river-pebble-mosaic"
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                className="w-full bg-[#FBF9F5] border border-[#E5DFD5] p-2.5 text-[#2C2926] font-mono focus:outline-hidden focus:border-[#2C2926]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-[#7B756C] uppercase font-mono tracking-wider mb-1.5">
                Category *
              </label>
              <select
                value={category}
                onChange={handleCategoryChange}
                className="w-full bg-[#FBF9F5] border border-[#E5DFD5] p-2.5 text-[#2C2926] focus:outline-hidden"
              >
                {categories.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3 pt-6">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 text-[#2C2926] rounded-xs border-[#E5DFD5] focus:ring-0"
                />
                <span className="font-medium text-[#2C2926]">
                  Featured Product (Highlight on Homepage)
                </span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-[#7B756C] uppercase font-mono tracking-wider mb-1.5">
              Short Description (Card snippet)
            </label>
            <textarea
              rows={2}
              placeholder="Brief summary for collection cards..."
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              className="w-full bg-[#FBF9F5] border border-[#E5DFD5] p-2.5 text-[#2C2926] focus:outline-hidden leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-[#7B756C] uppercase font-mono tracking-wider mb-1.5">
              Full Description (Specifications & Architectural Notes)
            </label>
            <textarea
              rows={4}
              placeholder="Detailed description of geology, textures, and installation instructions..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#FBF9F5] border border-[#E5DFD5] p-2.5 text-[#2C2926] focus:outline-hidden leading-relaxed"
            />
          </div>
        </div>

        {/* SECTION 2: MATERIAL & SPECIFICATIONS */}
        <div className="bg-white border border-[#E5DFD5] p-6 sm:p-8 space-y-5 shadow-xs">
          <h2 className="font-serif text-lg text-[#2C2926] pb-3 border-b border-[#EFECE6]">
            2. Material & Dimensions Specifications
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-[#7B756C] uppercase font-mono tracking-wider mb-1.5">
                Material
              </label>
              <input
                type="text"
                placeholder="e.g. Volcanic Basalt"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                className="w-full bg-[#FBF9F5] border border-[#E5DFD5] p-2.5 text-[#2C2926]"
              />
            </div>

            <div>
              <label className="block text-[#7B756C] uppercase font-mono tracking-wider mb-1.5">
                Color Palette
              </label>
              <input
                type="text"
                placeholder="e.g. Deep Charcoal"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full bg-[#FBF9F5] border border-[#E5DFD5] p-2.5 text-[#2C2926]"
              />
            </div>

            <div>
              <label className="block text-[#7B756C] uppercase font-mono tracking-wider mb-1.5">
                Size / Calibration
              </label>
              <input
                type="text"
                placeholder="e.g. 600 x 600 x 20 mm"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="w-full bg-[#FBF9F5] border border-[#E5DFD5] p-2.5 text-[#2C2926]"
              />
            </div>

            <div>
              <label className="block text-[#7B756C] uppercase font-mono tracking-wider mb-1.5">
                Surface Finish
              </label>
              <input
                type="text"
                placeholder="e.g. Flamed / Honed"
                value={finish}
                onChange={(e) => setFinish(e.target.value)}
                className="w-full bg-[#FBF9F5] border border-[#E5DFD5] p-2.5 text-[#2C2926]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#7B756C] uppercase font-mono tracking-wider mb-1.5">
                Minimum Order Quantity
              </label>
              <input
                type="text"
                placeholder="e.g. 20 m²"
                value={minimumOrder}
                onChange={(e) => setMinimumOrder(e.target.value)}
                className="w-full bg-[#FBF9F5] border border-[#E5DFD5] p-2.5 text-[#2C2926]"
              />
            </div>

            <div>
              <label className="block text-[#7B756C] uppercase font-mono tracking-wider mb-1.5">
                Availability Status
              </label>
              <select
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                className="w-full bg-[#FBF9F5] border border-[#E5DFD5] p-2.5 text-[#2C2926] focus:outline-hidden"
              >
                <option value="In Stock (Ready to Ship)">In Stock (Ready to Ship)</option>
                <option value="In Stock & Custom Cut to Order">In Stock & Custom Cut to Order</option>
                <option value="Made to Order (3-4 Weeks)">Made to Order (3-4 Weeks)</option>
                <option value="Limited Reserve">Limited Reserve</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[#7B756C] uppercase font-mono tracking-wider mb-2">
              Recommended Applications
            </label>
            <div className="flex flex-wrap gap-2">
              {availableApplications.map((app) => {
                const selected = applications.includes(app);
                return (
                  <button
                    type="button"
                    key={app}
                    onClick={() => toggleApplication(app)}
                    className={`px-3 py-1.5 uppercase tracking-wider text-[11px] transition-colors cursor-pointer ${
                      selected
                        ? 'bg-[#2C2926] text-white font-medium'
                        : 'bg-[#EFECE6] text-[#7B756C] hover:bg-[#E5DFD5]'
                    }`}
                  >
                    {app}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* SECTION 3: IMAGE UPLOAD SYSTEM (FIREBASE STORAGE) */}
        <div className="bg-white border border-[#E5DFD5] p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#EFECE6]">
            <div>
              <h2 className="font-serif text-lg text-[#2C2926]">
                3. Product Photography (Firebase Storage)
              </h2>
              <p className="text-[11px] text-[#7B756C] mt-0.5">
                Images are uploaded to <code className="font-mono bg-[#EFECE6] px-1">products/{'{id}'}/main/</code> and <code className="font-mono bg-[#EFECE6] px-1">products/{'{id}'}/gallery/</code>. Max 10MB per file (JPG, PNG, WEBP).
              </p>
            </div>
          </div>

          {/* Main Image Uploader */}
          <div className="space-y-3">
            <label className="block text-[#7B756C] uppercase font-mono tracking-wider">
              Main Showcase Image *
            </label>

            <div className="flex flex-col sm:flex-row gap-5 items-start">
              {/* Preview Thumbnail */}
              <div className="w-36 h-28 bg-[#EFECE6] border border-[#E5DFD5] overflow-hidden shrink-0 relative group">
                {mainImage ? (
                  <img
                    src={mainImage}
                    alt="Main Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-[#7B756C] gap-1">
                    <ImageIcon className="w-6 h-6" />
                    <span className="text-[10px]">No Image</span>
                  </div>
                )}

                {mainUploadProgress !== null && (
                  <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white">
                    <span className="text-xs font-mono font-bold">{mainUploadProgress}%</span>
                    <span className="text-[9px] uppercase tracking-wider">Uploading</span>
                  </div>
                )}
              </div>

              {/* Actions & URL Input */}
              <div className="flex-1 space-y-2.5 w-full">
                <div className="flex flex-wrap items-center gap-3">
                  <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#2C2926] text-white hover:bg-[#4A4036] text-xs uppercase tracking-wider font-semibold cursor-pointer transition-colors shadow-xs">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{mainImage ? 'Replace Main Image' : 'Upload Main Image'}</span>
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp"
                      onChange={handleMainImageUpload}
                      className="hidden"
                    />
                  </label>

                  {mainImage && (
                    <button
                      type="button"
                      onClick={() => setMainImage('')}
                      className="inline-flex items-center gap-1.5 px-3 py-2 border border-red-200 text-red-700 hover:bg-red-50 text-xs transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  )}
                </div>

                <div>
                  <span className="text-[10px] text-[#8C7A6B] block mb-1">
                    Or direct Firebase Storage URL:
                  </span>
                  <input
                    type="url"
                    placeholder="https://firebasestorage.googleapis.com/..."
                    value={mainImage}
                    onChange={(e) => setMainImage(e.target.value)}
                    className="w-full bg-[#FBF9F5] border border-[#E5DFD5] p-2 text-[#2C2926] text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Gallery Images Uploader & Reordering */}
          <div className="pt-4 border-t border-[#EFECE6] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <label className="block text-[#7B756C] uppercase font-mono tracking-wider">
                  Additional Gallery Images ({galleryImages.length})
                </label>
                <span className="text-[11px] text-[#8C7A6B]">
                  Upload multiple angles. Use Move Up/Down buttons to reorder gallery order.
                </span>
              </div>

              <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#EFECE6] hover:bg-[#E5DFD5] text-[#2C2926] text-xs uppercase tracking-wider font-semibold cursor-pointer transition-colors shrink-0">
                <Upload className="w-3.5 h-3.5" />
                <span>
                  {galleryUploadProgress !== null
                    ? `Uploading (${galleryUploadProgress}%)...`
                    : 'Add Gallery Images'}
                </span>
                <input
                  type="file"
                  multiple
                  accept=".jpg,.jpeg,.png,.webp"
                  onChange={handleGalleryUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Gallery Images List */}
            {galleryImages.length === 0 ? (
              <div className="p-8 border border-dashed border-[#D4CCB8] text-center text-[#7B756C] bg-[#FBF9F5]">
                <ImageIcon className="w-8 h-8 mx-auto mb-2 text-[#A89F8D]" />
                <p>No additional gallery images yet.</p>
                <span className="text-[11px] text-[#A89F8D]">
                  Click "Add Gallery Images" to upload detail shots, wet/dry surface textures, or site installations.
                </span>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {galleryImages.map((img, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 bg-[#FBF9F5] border border-[#E5DFD5] p-3 group"
                  >
                    <div className="w-16 h-16 bg-[#EFECE6] overflow-hidden shrink-0 border border-[#E5DFD5]">
                      <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-mono text-[#8C7A6B]">
                          Position #{idx + 1}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => moveGalleryImage(idx, 'up')}
                            className="p-1 hover:bg-[#E5DFD5] disabled:opacity-30 cursor-pointer"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === galleryImages.length - 1}
                            onClick={() => moveGalleryImage(idx, 'down')}
                            className="p-1 hover:bg-[#E5DFD5] disabled:opacity-30 cursor-pointer"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeGalleryImage(idx)}
                            className="p-1 text-red-600 hover:bg-red-50 cursor-pointer ml-1"
                            title="Remove Photo"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      <input
                        type="text"
                        placeholder="Image alt text..."
                        value={img.alt}
                        onChange={(e) => updateGalleryAlt(idx, e.target.value)}
                        className="w-full bg-white border border-[#E5DFD5] px-2 py-1 text-[11px]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* SECTION 4: SEO SPECIFICATIONS */}
        <div className="bg-white border border-[#E5DFD5] p-6 sm:p-8 space-y-4 shadow-xs">
          <h2 className="font-serif text-lg text-[#2C2926] pb-3 border-b border-[#EFECE6]">
            4. Search Engine Optimization (SEO)
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-[#7B756C] uppercase font-mono tracking-wider mb-1.5">
                SEO Title
              </label>
              <input
                type="text"
                placeholder="e.g. White River Pebble Mosaic | MOZAIK Natural Stone"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                className="w-full bg-[#FBF9F5] border border-[#E5DFD5] p-2.5 text-[#2C2926]"
              />
            </div>

            <div>
              <label className="block text-[#7B756C] uppercase font-mono tracking-wider mb-1.5">
                Meta Description
              </label>
              <textarea
                rows={2}
                placeholder="Google search summary description..."
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                className="w-full bg-[#FBF9F5] border border-[#E5DFD5] p-2.5 text-[#2C2926]"
              />
            </div>

            <div>
              <label className="block text-[#7B756C] uppercase font-mono tracking-wider mb-1.5">
                Meta Keywords
              </label>
              <input
                type="text"
                placeholder="natural stone, mosaic stone, pebbles, bathroom floor stone"
                value={seoKeywords}
                onChange={(e) => setSeoKeywords(e.target.value)}
                className="w-full bg-[#FBF9F5] border border-[#E5DFD5] p-2.5 text-[#2C2926]"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-[#E5DFD5]">
          <Link
            to="/admin/products"
            className="px-6 py-3 border border-[#E5DFD5] bg-white text-[#7B756C] hover:text-[#2C2926] uppercase tracking-wider font-semibold transition-colors"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-[#2C2926] text-white hover:bg-[#4A4036] uppercase tracking-[0.2em] font-semibold transition-all shadow-xs cursor-pointer disabled:opacity-50 flex items-center gap-2"
          >
            {saving && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
            <span>{saving ? 'Saving to Database...' : isEditing ? 'Update Product' : 'Publish Product'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
