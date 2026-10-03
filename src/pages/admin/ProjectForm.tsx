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
  ExternalLink,
  Star
} from 'lucide-react';
import {
  getProjectById,
  saveProject,
  uploadProjectCoverImage,
  uploadProjectGalleryImage,
  getProducts
} from '../../services/db';
import { Project, ProjectGalleryImage, Product } from '../../types';

export const ProjectForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);

  // Project Form Fields
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [location, setLocation] = useState('');
  const [country, setCountry] = useState('Indonesia');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [category, setCategory] = useState('Hospitality');
  const [client, setClient] = useState('');
  const [architect, setArchitect] = useState('');
  const [description, setDescription] = useState('');
  const [selectedProductSlugs, setSelectedProductSlugs] = useState<string[]>([]);
  const [customProductsUsed, setCustomProductsUsed] = useState('');
  const [application, setApplication] = useState('');
  const [featured, setFeatured] = useState(false);

  // SEO Fields
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [seoKeywords, setSeoKeywords] = useState('');

  // Images
  const [coverImage, setCoverImage] = useState('');
  const [galleryImages, setGalleryImages] = useState<ProjectGalleryImage[]>([]);

  // Upload States
  const [coverProgress, setCoverProgress] = useState<number | null>(null);
  const [galleryProgress, setGalleryProgress] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const projectCategories = [
    'Residential',
    'Commercial',
    'Landscape',
    'Hospitality',
    'Architecture',
    'Interior',
    'Exterior',
    'Public Space'
  ];

  useEffect(() => {
    async function initData() {
      try {
        const prods = await getProducts();
        setAvailableProducts(prods);

        if (id) {
          const project = await getProjectById(id);
          if (project) {
            setName(project.name);
            setSlug(project.slug);
            setLocation(project.location || '');
            setCountry(project.country || 'Indonesia');
            setYear(project.year || new Date().getFullYear().toString());
            setCategory(project.category || 'Hospitality');
            setClient(project.client || '');
            setArchitect(project.architect || '');
            setDescription(project.description || '');
            setApplication(project.application || '');
            setFeatured(Boolean(project.featured));
            setCoverImage(project.coverImage || '');
            setSeoTitle(project.seoTitle || '');
            setSeoDescription(project.seoDescription || '');
            setSeoKeywords(project.seoKeywords || '');

            // Parse products used
            const rawProds = project.productsUsed;
            if (Array.isArray(rawProds)) {
              setSelectedProductSlugs(rawProds);
            } else if (typeof rawProds === 'string') {
              const parts = rawProds.split(',').map((s) => s.trim());
              const matchedSlugs: string[] = [];
              const unmatched: string[] = [];

              parts.forEach((p) => {
                const found = prods.find(
                  (prod) =>
                    prod.slug.toLowerCase() === p.toLowerCase() ||
                    prod.name.toLowerCase() === p.toLowerCase()
                );
                if (found) {
                  matchedSlugs.push(found.slug);
                } else if (p) {
                  unmatched.push(p);
                }
              });

              setSelectedProductSlugs(matchedSlugs);
              setCustomProductsUsed(unmatched.join(', '));
            }

            // Parse gallery images
            if (Array.isArray(project.galleryImages)) {
              const normalized = project.galleryImages.map((img: any, idx) => {
                if (typeof img === 'string') {
                  return {
                    url: img,
                    alt: `${project.name} - MOZAIK Natural Stone Project`,
                    order: idx + 1
                  };
                }
                return {
                  url: img.url || '',
                  alt: img.alt || `${project.name} - MOZAIK Natural Stone Project`,
                  order: img.order || idx + 1
                };
              });
              setGalleryImages(normalized);
            }
          }
        }
      } catch (err) {
        console.error("ProjectForm init error:", err);
      } finally {
        setLoading(false);
      }
    }

    initData();
  }, [id]);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEditing) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setSlug(generatedSlug);
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setCoverProgress(10);
    try {
      const targetId = id || slug || 'proj_' + Date.now();
      const url = await uploadProjectCoverImage(file, targetId, (prog) => {
        setCoverProgress(prog);
      });
      setCoverImage(url);
      setStatusMessage({ type: 'success', text: 'Cover image uploaded to Firebase Storage!' });
    } catch (err: any) {
      console.error(err);
      setUploadError(err.message || 'Cover upload failed.');
    } finally {
      setCoverProgress(null);
    }
  };

  const handleMultipleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadError(null);
    setGalleryProgress(10);
    try {
      const targetId = id || slug || 'proj_' + Date.now();
      const uploaded: ProjectGalleryImage[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const progBase = Math.round((i / files.length) * 100);
        const url = await uploadProjectGalleryImage(file, targetId, (prog) => {
          setGalleryProgress(progBase + Math.round(prog / files.length));
        });

        uploaded.push({
          url,
          alt: `${name || 'Project'} - MOZAIK Natural Stone Project`,
          order: galleryImages.length + uploaded.length + 1
        });
      }

      setGalleryImages((prev) => [...prev, ...uploaded]);
      setStatusMessage({
        type: 'success',
        text: `Successfully uploaded ${uploaded.length} gallery photo(s)!`
      });
    } catch (err: any) {
      console.error(err);
      setUploadError(err.message || 'Gallery upload failed.');
    } finally {
      setGalleryProgress(null);
    }
  };

  const handleUpdateGalleryAlt = (idx: number, newAlt: string) => {
    setGalleryImages((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], alt: newAlt };
      return copy;
    });
  };

  const handleMoveGallery = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= galleryImages.length) return;

    setGalleryImages((prev) => {
      const copy = [...prev];
      const item = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = item;
      return copy.map((img, i) => ({ ...img, order: i + 1 }));
    });
  };

  const handleDeleteGalleryImage = (index: number) => {
    if (window.confirm("Are you sure you want to remove this gallery photo?")) {
      setGalleryImages((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleDeleteCoverImage = () => {
    if (window.confirm("Are you sure you want to remove the cover image?")) {
      setCoverImage('');
    }
  };

  const toggleProductSelect = (productSlug: string) => {
    setSelectedProductSlugs((prev) =>
      prev.includes(productSlug)
        ? prev.filter((s) => s !== productSlug)
        : [...prev, productSlug]
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setStatusMessage({ type: 'error', text: 'Project Name is required.' });
      return;
    }
    if (!slug.trim()) {
      setStatusMessage({ type: 'error', text: 'Project Slug is required.' });
      return;
    }
    if (!coverImage.trim()) {
      setStatusMessage({ type: 'error', text: 'Please provide or upload a Cover Image.' });
      return;
    }

    setSaving(true);
    setStatusMessage(null);

    // Merge selected product slugs and custom text
    const combinedProducts = [
      ...selectedProductSlugs,
      ...(customProductsUsed ? [customProductsUsed.trim()] : [])
    ].join(', ');

    try {
      await saveProject(
        {
          name: name.trim(),
          slug: slug.trim(),
          location: location.trim(),
          country: country.trim() || 'Indonesia',
          year: year.trim(),
          category,
          client: client.trim(),
          architect: architect.trim(),
          description: description.trim(),
          productsUsed: combinedProducts,
          application: application.trim(),
          featured,
          coverImage: coverImage.trim(),
          galleryImages: galleryImages.map((img, i) => ({
            url: img.url,
            alt: img.alt.trim() || `${name.trim()} - MOZAIK Natural Stone Project`,
            order: i + 1
          })),
          seoTitle:
            seoTitle.trim() || `${name.trim()} | Natural Stone Project | MOZAIK`,
          seoDescription:
            seoDescription.trim() ||
            description.trim() ||
            `Explore ${name.trim()} featuring Indonesian natural stone by MOZAIK.`,
          seoKeywords:
            seoKeywords.trim() ||
            `${name.toLowerCase()}, natural stone project, indonesia architecture stone`
        },
        id
      );

      setStatusMessage({
        type: 'success',
        text: isEditing
          ? 'Project updated successfully in Firestore!'
          : 'Project created and published to Firestore!'
      });

      setTimeout(() => {
        navigate('/admin/projects');
      }, 700);
    } catch (err: any) {
      console.error(err);
      setStatusMessage({
        type: 'error',
        text: err.message || 'Failed to save project document.'
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-xs text-[#8C7A6B] font-mono">
        Loading project data from Firestore...
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-10 max-w-5xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E5DFD5]">
        <div>
          <Link
            to="/admin/projects"
            className="inline-flex items-center text-xs uppercase tracking-wider text-[#8C7A6B] hover:text-[#2C2926] mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            <span>Back to Projects</span>
          </Link>
          <h1 className="font-serif text-3xl text-[#2C2926]">
            {isEditing ? `Edit Project: ${name}` : 'Create New Project'}
          </h1>
          <p className="text-xs text-[#7B756C] mt-1 font-light">
            Architectural portfolio entry stored directly in Firestore and Firebase Storage.
          </p>
        </div>

        {isEditing && (
          <a
            href={`/projects/${slug}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 border border-[#E5DFD5] text-[#2C2926] hover:bg-white text-xs uppercase tracking-wider font-semibold transition-colors"
          >
            <span>View Live Page</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>

      {statusMessage && (
        <div
          className={`p-4 border text-xs flex items-center gap-2 ${
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

      {uploadError && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs">
          {uploadError}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* Section 1: General Project Info */}
        <div className="bg-white p-6 sm:p-8 border border-[#E5DFD5] space-y-6">
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#8C7A6B] block">
            1. Project Profile & Identification
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-[#7B756C] uppercase font-mono text-[11px] tracking-wider mb-1">
                Project Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Private Villa Bali"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full bg-[#FBF9F5] border border-[#E5DFD5] p-2.5 text-xs text-[#2C2926] focus:outline-hidden focus:border-[#2C2926]"
              />
            </div>

            <div>
              <label className="block text-[#7B756C] uppercase font-mono text-[11px] tracking-wider mb-1">
                URL Slug *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. private-villa-bali"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full bg-[#FBF9F5] border border-[#E5DFD5] p-2.5 text-xs text-[#2C2926] font-mono focus:outline-hidden focus:border-[#2C2926]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-[#7B756C] uppercase font-mono text-[11px] tracking-wider mb-1">
                Location (City / Area) *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Uluwatu, Bali"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-[#FBF9F5] border border-[#E5DFD5] p-2.5 text-xs text-[#2C2926] focus:outline-hidden focus:border-[#2C2926]"
              />
            </div>

            <div>
              <label className="block text-[#7B756C] uppercase font-mono text-[11px] tracking-wider mb-1">
                Country
              </label>
              <input
                type="text"
                placeholder="e.g. Indonesia"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full bg-[#FBF9F5] border border-[#E5DFD5] p-2.5 text-xs text-[#2C2926] focus:outline-hidden focus:border-[#2C2926]"
              />
            </div>

            <div>
              <label className="block text-[#7B756C] uppercase font-mono text-[11px] tracking-wider mb-1">
                Completion Year *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 2024"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full bg-[#FBF9F5] border border-[#E5DFD5] p-2.5 text-xs text-[#2C2926] focus:outline-hidden focus:border-[#2C2926]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-[#7B756C] uppercase font-mono text-[11px] tracking-wider mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#FBF9F5] border border-[#E5DFD5] p-2.5 text-xs text-[#2C2926] focus:outline-hidden focus:border-[#2C2926]"
              >
                {projectCategories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[#7B756C] uppercase font-mono text-[11px] tracking-wider mb-1">
                Client / Company
              </label>
              <input
                type="text"
                placeholder="e.g. Alila Hotels / Private"
                value={client}
                onChange={(e) => setClient(e.target.value)}
                className="w-full bg-[#FBF9F5] border border-[#E5DFD5] p-2.5 text-xs text-[#2C2926] focus:outline-hidden focus:border-[#2C2926]"
              />
            </div>

            <div>
              <label className="block text-[#7B756C] uppercase font-mono text-[11px] tracking-wider mb-1">
                Architect / Designer
              </label>
              <input
                type="text"
                placeholder="e.g. WOHA Architects"
                value={architect}
                onChange={(e) => setArchitect(e.target.value)}
                className="w-full bg-[#FBF9F5] border border-[#E5DFD5] p-2.5 text-xs text-[#2C2926] focus:outline-hidden focus:border-[#2C2926]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#7B756C] uppercase font-mono text-[11px] tracking-wider mb-1">
              Application Details
            </label>
            <input
              type="text"
              placeholder="e.g. Cantilevered Swimming Pool, Villa Pool Terraces, Spa Bathrooms"
              value={application}
              onChange={(e) => setApplication(e.target.value)}
              className="w-full bg-[#FBF9F5] border border-[#E5DFD5] p-2.5 text-xs text-[#2C2926] focus:outline-hidden focus:border-[#2C2926]"
            />
          </div>

          <div>
            <label className="block text-[#7B756C] uppercase font-mono text-[11px] tracking-wider mb-1">
              Project Description *
            </label>
            <textarea
              rows={4}
              required
              placeholder="Full architectural narrative detailing natural stone selection, quarry finishes, and spatial execution..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#FBF9F5] border border-[#E5DFD5] p-2.5 text-xs text-[#2C2926] focus:outline-hidden focus:border-[#2C2926]"
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
              <span className="text-xs uppercase font-mono tracking-wider flex items-center gap-1 font-semibold">
                <Star className="w-3.5 h-3.5 text-[#8C7A6B] fill-[#8C7A6B]" />
                Featured Project (Highlighted on Homepage, Max 3)
              </span>
            </label>
          </div>
        </div>

        {/* Section 2: Related Products Used */}
        <div className="bg-white p-6 sm:p-8 border border-[#E5DFD5] space-y-4">
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#8C7A6B] block">
            2. Natural Stone Products Used (Cross-Linked in Portfolio)
          </span>
          <p className="text-xs text-[#7B756C]">
            Select products from the MOZAIK catalog to automatically link them to their respective product detail pages.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-56 overflow-y-auto p-2 bg-[#FBF9F5] border border-[#E5DFD5]">
            {availableProducts.map((p) => {
              const isSelected = selectedProductSlugs.includes(p.slug);
              return (
                <button
                  type="button"
                  key={p.slug}
                  onClick={() => toggleProductSelect(p.slug)}
                  className={`flex items-center gap-2.5 p-2 text-left border text-xs transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#2C2926] text-white border-[#2C2926]'
                      : 'bg-white text-[#2C2926] border-[#E5DFD5] hover:border-[#8C7A6B]'
                  }`}
                >
                  <img
                    src={p.mainImage}
                    alt={p.name}
                    className="w-8 h-8 object-cover shrink-0 bg-[#EFECE6]"
                  />
                  <div className="min-w-0">
                    <p className="font-medium truncate text-[11px]">{p.name}</p>
                    <p className="text-[9px] opacity-75 truncate">{p.category}</p>
                  </div>
                </button>
              );
            })}
          </div>

          <div>
            <label className="block text-[#7B756C] uppercase font-mono text-[11px] tracking-wider mb-1">
              Additional / Custom Materials Description
            </label>
            <input
              type="text"
              placeholder="e.g. Custom Honed Black Andesite Coping 600x300x30mm"
              value={customProductsUsed}
              onChange={(e) => setCustomProductsUsed(e.target.value)}
              className="w-full bg-[#FBF9F5] border border-[#E5DFD5] p-2.5 text-xs text-[#2C2926] focus:outline-hidden focus:border-[#2C2926]"
            />
          </div>
        </div>

        {/* Section 3: Project Cover Image */}
        <div className="bg-white p-6 sm:p-8 border border-[#E5DFD5] space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#8C7A6B] block">
              3. Project Cover Image (Hero Banner)
            </span>
            <span className="text-[10px] text-[#8C7A6B] font-mono">
              Path: projects/{'{id}'}/cover/
            </span>
          </div>

          {coverImage ? (
            <div className="relative aspect-21/9 w-full max-w-xl bg-[#EFECE6] border border-[#E5DFD5] overflow-hidden group">
              <img
                src={coverImage}
                alt="Cover Preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-[#1C1A18]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleDeleteCoverImage}
                  className="px-3 py-1.5 bg-red-600 text-white text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove Cover</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 border border-dashed border-[#E5DFD5] bg-[#FBF9F5] text-center text-xs text-[#7B756C]">
              No cover image selected. Upload one or paste a URL below.
            </div>
          )}

          <div className="space-y-2">
            <input
              type="url"
              placeholder="https://... or upload image file below"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              className="w-full bg-[#FBF9F5] border border-[#E5DFD5] p-2 text-xs text-[#2C2926] font-mono text-[11px]"
            />
            <div className="flex items-center gap-3">
              <label className="inline-flex items-center gap-2 px-3 py-2 bg-[#EFECE6] hover:bg-[#E5DFD5] text-[#2C2926] cursor-pointer text-xs font-semibold transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>
                  {coverProgress !== null
                    ? `Uploading (${coverProgress}%)...`
                    : 'Upload Cover Image (Max 10MB)'}
                </span>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  disabled={coverProgress !== null}
                  onChange={handleCoverUpload}
                  className="hidden"
                />
              </label>
              <span className="text-[10px] text-[#8C7A6B]">
                JPG, JPEG, PNG, WEBP. Max 10 MB.
              </span>
            </div>
          </div>
        </div>

        {/* Section 4: Project Gallery Images */}
        <div className="bg-white p-6 sm:p-8 border border-[#E5DFD5] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#8C7A6B] block">
                4. Project Installation Gallery ({galleryImages.length} Photos)
              </span>
              <p className="text-xs text-[#7B756C] mt-0.5">
                Upload multiple photography assets stored in projects/{'{id}'}/gallery/. Reorder or configure custom alt tags for SEO.
              </p>
            </div>

            <label className="inline-flex items-center gap-2 px-4 py-2 bg-[#2C2926] hover:bg-[#4A4036] text-white cursor-pointer text-xs font-semibold uppercase tracking-wider transition-colors shrink-0">
              <Upload className="w-3.5 h-3.5" />
              <span>
                {galleryProgress !== null
                  ? `Uploading (${galleryProgress}%)...`
                  : '+ Upload Gallery Images'}
              </span>
              <input
                type="file"
                multiple
                accept="image/jpeg,image/jpg,image/png,image/webp"
                disabled={galleryProgress !== null}
                onChange={handleMultipleGalleryUpload}
                className="hidden"
              />
            </label>
          </div>

          {galleryImages.length === 0 ? (
            <div className="py-12 border border-dashed border-[#E5DFD5] bg-[#FBF9F5] text-center text-xs text-[#7B756C]">
              No gallery images uploaded yet. Click "+ Upload Gallery Images" to add photos.
            </div>
          ) : (
            <div className="space-y-3">
              {galleryImages.map((img, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3 bg-[#FBF9F5] border border-[#E5DFD5] hover:border-[#8C7A6B] transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-mono text-xs text-[#8C7A6B] w-6 shrink-0">
                      #{idx + 1}
                    </span>
                    <div className="w-16 h-12 bg-[#EFECE6] border border-[#E5DFD5] overflow-hidden shrink-0">
                      <img
                        src={img.url}
                        alt={img.alt}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <input
                        type="text"
                        placeholder="Image SEO Alt Text"
                        value={img.alt}
                        onChange={(e) => handleUpdateGalleryAlt(idx, e.target.value)}
                        className="w-full bg-white border border-[#E5DFD5] px-2 py-1 text-xs text-[#2C2926] focus:outline-hidden focus:border-[#2C2926]"
                      />
                      <span className="text-[10px] text-[#8C7A6B] font-mono truncate block mt-0.5">
                        {img.url}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveGallery(idx, 'up')}
                      title="Move Up"
                      className="p-1.5 border border-[#E5DFD5] bg-white text-[#2C2926] hover:bg-[#EFECE6] disabled:opacity-30 cursor-pointer"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === galleryImages.length - 1}
                      onClick={() => handleMoveGallery(idx, 'down')}
                      title="Move Down"
                      className="p-1.5 border border-[#E5DFD5] bg-white text-[#2C2926] hover:bg-[#EFECE6] disabled:opacity-30 cursor-pointer"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteGalleryImage(idx)}
                      title="Delete Image"
                      className="p-1.5 border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 5: Project SEO Metadata */}
        <div className="bg-white p-6 sm:p-8 border border-[#E5DFD5] space-y-4">
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#8C7A6B] block">
            5. Search Engine Optimization (SEO)
          </span>

          <div>
            <label className="block text-[#7B756C] uppercase font-mono text-[11px] tracking-wider mb-1">
              SEO Title Tag
            </label>
            <input
              type="text"
              placeholder={`${name || 'Project Name'} | Natural Stone Project | MOZAIK`}
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              className="w-full bg-[#FBF9F5] border border-[#E5DFD5] p-2.5 text-xs text-[#2C2926] focus:outline-hidden focus:border-[#2C2926]"
            />
          </div>

          <div>
            <label className="block text-[#7B756C] uppercase font-mono text-[11px] tracking-wider mb-1">
              SEO Meta Description
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Explore a private villa project in Bali featuring Indonesian natural stone for architectural and landscape applications."
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              className="w-full bg-[#FBF9F5] border border-[#E5DFD5] p-2.5 text-xs text-[#2C2926] focus:outline-hidden focus:border-[#2C2926]"
            />
          </div>

          <div>
            <label className="block text-[#7B756C] uppercase font-mono text-[11px] tracking-wider mb-1">
              SEO Keywords (Comma Separated)
            </label>
            <input
              type="text"
              placeholder="bali stone architecture, private villa stone, pool quartzite"
              value={seoKeywords}
              onChange={(e) => setSeoKeywords(e.target.value)}
              className="w-full bg-[#FBF9F5] border border-[#E5DFD5] p-2.5 text-xs text-[#2C2926] focus:outline-hidden focus:border-[#2C2926]"
            />
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-4 border-t border-[#E5DFD5] flex items-center justify-between gap-4">
          <Link
            to="/admin/projects"
            className="px-6 py-2.5 border border-[#E5DFD5] text-[#7B756C] hover:bg-white text-xs uppercase tracking-wider font-semibold transition-colors"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={saving || coverProgress !== null || galleryProgress !== null}
            className="px-8 py-2.5 bg-[#2C2926] hover:bg-[#4A4036] text-white text-xs uppercase tracking-[0.18em] font-semibold cursor-pointer disabled:opacity-50 transition-colors shadow-xs"
          >
            {saving ? 'Saving Project...' : isEditing ? 'Update Project' : 'Publish Project'}
          </button>
        </div>
      </form>
    </div>
  );
};
