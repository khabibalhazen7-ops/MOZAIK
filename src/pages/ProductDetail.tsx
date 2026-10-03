import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowUpRight,
  MessageSquare,
  FileDown,
  Check,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  Layers
} from 'lucide-react';
import { SEO } from '../components/SEO';
import { ProductCard } from '../components/ProductCard';
import { Product, SiteSettings, Project } from '../types';
import { getProductBySlug, getProducts, getSettings, getProjects } from '../services/db';
import { useQuoteModal } from '../context/QuoteModalContext';

export const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { openQuoteModal } = useQuoteModal();
  const [product, setProduct] = useState<Product | null>(null);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [featuredInProjects, setFeaturedInProjects] = useState<Project[]>([]);
  const [activeImage, setActiveImage] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Lightbox State
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    async function loadProduct() {
      if (!slug) return;
      setLoading(true);
      try {
        const [prod, siteSettings, allProds, allProjects] = await Promise.all([
          getProductBySlug(slug),
          getSettings(),
          getProducts(),
          getProjects()
        ]);
        setSettings(siteSettings);
        if (prod) {
          setProduct(prod);
          setActiveImage(prod.mainImage);

          // Related products: same category first, up to 4 items, exclude current
          const sameCategory = allProds.filter(
            (p) => p.slug !== prod.slug && p.category === prod.category
          );
          const otherCategory = allProds.filter(
            (p) => p.slug !== prod.slug && p.category !== prod.category
          );
          const related = [...sameCategory, ...otherCategory].slice(0, 4);
          setRelatedProducts(related);

          // Find projects that specify this material
          const matched = allProjects.filter((pr) => {
            const used =
              typeof pr.productsUsed === 'string'
                ? pr.productsUsed.toLowerCase()
                : Array.isArray(pr.productsUsed)
                ? pr.productsUsed.join(' ').toLowerCase()
                : '';
            return (
              used.includes(prod.slug.toLowerCase()) ||
              used.includes(prod.name.toLowerCase())
            );
          });
          setFeaturedInProjects(matched);
        } else {
          setProduct(null);
        }
      } catch (err) {
        console.error('Failed to load product detail:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  // Gallery image array
  const galleryUrls = (product?.galleryImages || []).map((img) =>
    typeof img === 'string' ? img : img.url
  );
  const allImages = product
    ? [product.mainImage, ...galleryUrls].filter(Boolean)
    : [];

  // Synchronize lightbox index when active image changes
  const handleOpenLightbox = (index?: number) => {
    const idx =
      typeof index === 'number'
        ? index
        : allImages.indexOf(activeImage) >= 0
        ? allImages.indexOf(activeImage)
        : 0;
    setLightboxIndex(idx);
    setLightboxOpen(true);
  };

  const handlePrevLightbox = () => {
    setLightboxIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const handleNextLightbox = () => {
    setLightboxIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  // Lightbox keyboard controls
  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowLeft') handlePrevLightbox();
      if (e.key === 'ArrowRight') handleNextLightbox();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, allImages.length]);

  const handleDownloadCatalog = () => {
    if (!product) return;
    setDownloadSuccess(true);
    const specSheetContent = `MOZAIK NATURAL STONE COLLECTION
PRODUCT ARCHITECTURAL SPECIFICATION SHEET
======================================================
Product Name: ${product.name}
Category: ${product.category}
Material: ${product.material}
Color Palette: ${product.color}
Standard Dimensions: ${product.size}
Surface Finish: ${product.finish}
Recommended Applications: ${product.applications?.join(', ')}
Minimum Order Quantity: ${product.minimumOrder}
Availability Status: ${product.availability}

DESCRIPTION:
${product.description}

TECHNICAL & ORDERING CONTACT:
MOZAIK Studio & Direct Quarry Logistics
WhatsApp: ${settings?.whatsappNumber || settings?.whatsapp || '+62 812-8888-0919'}
Email: ${settings?.email || 'info@mozaikstone.com'}
Web: https://mozaikstone.com
======================================================
Generated: ${new Date().toLocaleDateString()}`;

    const blob = new Blob([specSheetContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `MOZAIK_SpecSheet_${product.slug}.txt`;
    link.click();
    URL.revokeObjectURL(url);

    setTimeout(() => setDownloadSuccess(false), 4000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBF9F5] flex items-center justify-center py-24">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-[#2C2926] border-t-transparent animate-spin rounded-full mx-auto mb-4" />
          <span className="text-xs uppercase tracking-[0.25em] text-[#7B756C]">
            Loading Stone Specification...
          </span>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FBF9F5] py-24 px-6 text-center">
        <div className="max-w-md mx-auto bg-white p-12 border border-[#E5DFD5]">
          <h2 className="font-serif text-2xl text-[#2C2926] mb-3">Product Not Found</h2>
          <p className="text-sm text-[#7B756C] mb-6">
            The requested natural stone material specification does not exist or has been relocated.
          </p>
          <Link
            to="/collection"
            className="inline-flex items-center text-xs uppercase tracking-[0.2em] px-6 py-3 bg-[#2C2926] text-white hover:bg-[#4A4036]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span>Return to Collection</span>
          </Link>
        </div>
      </div>
    );
  }

  const categorySlug = product.category.toLowerCase().replace(/\s+/g, '-');
  const rawNumber = settings?.whatsappNumber || settings?.whatsapp || '+62 812-8888-0919';
  const cleanNumber = rawNumber.replace(/[^0-9]/g, '');
  const waUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(
    `Hello MOZAIK,\n\nI am interested in:\nProduct: ${product.name} (${product.category})\n\nI would like to request more information, physical sample availability, and a quotation.\n\nThank you.`
  )}`;

  // Filter specification table rows - only show fields that are non-empty
  const specRows = [
    { label: 'Material', value: product.material },
    { label: 'Color', value: product.color },
    { label: 'Size', value: product.size },
    { label: 'Finish', value: product.finish },
    {
      label: 'Application',
      value:
        product.applications && product.applications.length > 0
          ? product.applications.join(', ')
          : undefined
    },
    { label: 'Minimum Order', value: product.minimumOrder },
    { label: 'Availability', value: product.availability }
  ].filter((row) => Boolean(row.value && row.value.trim()));

  return (
    <div className="bg-[#FBF9F5] min-h-screen pb-24 sm:pb-16">
      <SEO
        title={product.seoTitle || `${product.name} | Natural Stone | MOZAIK`}
        description={
          product.seoDescription ||
          product.shortDescription ||
          `Explore ${product.name} from MOZAIK, a natural Indonesian stone material for landscape, garden, interior and architectural applications.`
        }
        canonicalUrl={`/products/${product.slug}`}
        keywords={
          product.seoKeywords ||
          `${product.name}, ${product.material}, ${product.category}, natural stone indonesia`
        }
        ogImage={product.mainImage}
        ogType="product"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Collection', url: '/collection' },
          { name: product.category, url: `/collection/${categorySlug}` },
          { name: product.name, url: `/products/${product.slug}` }
        ]}
        productData={{
          name: product.name,
          description: product.description || product.shortDescription,
          image: product.mainImage,
          category: product.category,
          material: product.material
        }}
      />

      {/* ==================================================
          11. BREADCRUMB
          Home > Collection > Category > Product
          ================================================== */}
      <section className="bg-white border-b border-[#E5DFD5] py-3.5 px-6 sm:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <nav
            aria-label="Breadcrumb"
            className="text-xs uppercase tracking-[0.18em] text-[#7B756C] flex items-center space-x-2 font-mono overflow-x-auto"
          >
            <Link to="/" className="hover:text-[#2C2926] transition-colors">
              Home
            </Link>
            <span aria-hidden="true">&gt;</span>
            <Link to="/collection" className="hover:text-[#2C2926] transition-colors">
              Collection
            </Link>
            <span aria-hidden="true">&gt;</span>
            <Link
              to={`/collection/${categorySlug}`}
              className="hover:text-[#2C2926] transition-colors"
            >
              {product.category}
            </Link>
            <span aria-hidden="true">&gt;</span>
            <span className="text-[#2C2926] font-semibold truncate max-w-xs">
              {product.name}
            </span>
          </nav>

          <button
            onClick={() => navigate(-1)}
            className="hidden sm:inline-flex items-center text-xs text-[#7B756C] hover:text-[#2C2926] uppercase tracking-wider cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            Back
          </button>
        </div>
      </section>

      {/* ==================================================
          3 & 4. PRODUCT DETAIL SHOWCASE & IMAGE GALLERY
          LEFT: Large product image + thumbnails
          RIGHT: Product information & CTAs
          ================================================== */}
      <section className="py-12 sm:py-16 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* LEFT: Image Gallery (7 cols on desktop) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Large Active Viewport */}
            <div
              onClick={() => handleOpenLightbox()}
              className="relative aspect-4/3 bg-[#EFECE6] border border-[#E5DFD5] overflow-hidden group cursor-zoom-in"
              title="Click to view fullscreen gallery"
            >
              <img
                src={activeImage || product.mainImage}
                alt={`${product.name} - MOZAIK Natural Stone`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
              />

              {/* Category Marker */}
              <div className="absolute top-4 left-4">
                <span className="text-[10px] uppercase tracking-[0.2em] px-3 py-1 bg-[#1C1A18]/85 text-[#FBF9F5] backdrop-blur-xs font-medium">
                  {product.category}
                </span>
              </div>

              {/* Click to Enlarge Badge */}
              <div className="absolute bottom-4 right-4 opacity-80 group-hover:opacity-100 transition-opacity">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1C1A18]/80 text-[#FBF9F5] text-[10px] uppercase tracking-widest backdrop-blur-xs">
                  <Maximize2 className="w-3 h-3" />
                  <span className="hidden sm:inline">Fullscreen</span>
                </div>
              </div>
            </div>

            {/* Thumbnail Gallery (Desktop: beneath or side; Mobile: horizontal scroll) */}
            {allImages.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
                {allImages.map((imgUrl, idx) => {
                  const isSelected = (activeImage || product.mainImage) === imgUrl;
                  return (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(imgUrl)}
                      className={`relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 bg-[#EFECE6] border transition-all cursor-pointer overflow-hidden ${
                        isSelected
                          ? 'border-[#2C2926] ring-2 ring-[#2C2926]'
                          : 'border-[#E5DFD5] opacity-70 hover:opacity-100'
                      }`}
                      aria-label={`View image ${idx + 1}`}
                    >
                      <img
                        src={imgUrl}
                        alt={`${product.name} view ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* RIGHT: Product Information (5 cols on desktop) */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              {/* Category & Availability */}
              <div className="flex items-center space-x-2 text-[11px] uppercase tracking-[0.22em] text-[#8C7A6B] font-mono mb-2">
                <span>{product.category}</span>
                <span>•</span>
                <span className="text-[#2C2926] font-semibold">{product.availability}</span>
              </div>

              {/* Product Name */}
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#2C2926] font-medium leading-tight mb-4">
                {product.name}
              </h1>

              {/* Short Description */}
              {product.shortDescription && (
                <p className="text-sm sm:text-base text-[#7B756C] leading-relaxed mb-6 font-light">
                  {product.shortDescription}
                </p>
              )}

              {/* Quick Summary Highlights */}
              <div className="bg-white border border-[#E5DFD5] p-5 mb-8 space-y-2.5 text-xs">
                {product.material && (
                  <div className="flex justify-between items-center">
                    <span className="text-[#7B756C] uppercase tracking-wider font-mono">
                      Material
                    </span>
                    <span className="text-[#2C2926] font-medium text-right">
                      {product.material}
                    </span>
                  </div>
                )}
                {product.color && (
                  <div className="flex justify-between items-center">
                    <span className="text-[#7B756C] uppercase tracking-wider font-mono">
                      Color
                    </span>
                    <span className="text-[#2C2926] font-medium text-right">
                      {product.color}
                    </span>
                  </div>
                )}
                {product.size && (
                  <div className="flex justify-between items-center">
                    <span className="text-[#7B756C] uppercase tracking-wider font-mono">
                      Size
                    </span>
                    <span className="text-[#2C2926] font-medium text-right">
                      {product.size}
                    </span>
                  </div>
                )}
                {product.finish && (
                  <div className="flex justify-between items-center">
                    <span className="text-[#7B756C] uppercase tracking-wider font-mono">
                      Finish
                    </span>
                    <span className="text-[#2C2926] font-medium text-right">
                      {product.finish}
                    </span>
                  </div>
                )}
                {product.minimumOrder && (
                  <div className="flex justify-between items-center">
                    <span className="text-[#7B756C] uppercase tracking-wider font-mono">
                      Minimum Order
                    </span>
                    <span className="text-[#2C2926] font-medium text-right">
                      {product.minimumOrder}
                    </span>
                  </div>
                )}
                {product.availability && (
                  <div className="flex justify-between items-center">
                    <span className="text-[#7B756C] uppercase tracking-wider font-mono">
                      Availability
                    </span>
                    <span className="text-[#2C2926] font-medium text-right">
                      {product.availability}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-3 pt-4 border-t border-[#E5DFD5]">
              {/* Primary CTA: Request a Quote */}
              <button
                onClick={() =>
                  openQuoteModal(
                    {
                      id: product.id || product.slug,
                      name: product.name,
                      slug: product.slug
                    },
                    'product-detail-primary'
                  )
                }
                className="w-full inline-flex items-center justify-center py-4 px-6 bg-[#2C2926] text-[#FBF9F5] hover:bg-[#4A4036] text-xs uppercase tracking-[0.2em] font-semibold transition-all shadow-xs group cursor-pointer"
              >
                <span>Request a Quote</span>
                <ArrowUpRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>

              {/* Secondary CTA: Chat on WhatsApp */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center py-3.5 px-4 border border-[#2C2926] text-[#2C2926] hover:bg-[#2C2926] hover:text-white text-xs uppercase tracking-[0.16em] font-medium transition-all"
                >
                  <MessageSquare className="w-4 h-4 mr-2 text-emerald-600 group-hover:text-emerald-400" />
                  <span>Chat on WhatsApp</span>
                </a>

                {/* Spec Sheet Download */}
                <button
                  onClick={handleDownloadCatalog}
                  className="inline-flex items-center justify-center py-3.5 px-4 border border-[#D4CCB8] bg-white text-[#4A4036] hover:bg-[#EFECE6] text-xs uppercase tracking-[0.16em] font-medium transition-all cursor-pointer"
                >
                  {downloadSuccess ? (
                    <>
                      <Check className="w-4 h-4 mr-2 text-green-700" />
                      <span>Downloaded Spec</span>
                    </>
                  ) : (
                    <>
                      <FileDown className="w-4 h-4 mr-2 text-[#8C7A6B]" />
                      <span>Spec Sheet (TXT)</span>
                    </>
                  )}
                </button>
              </div>

              <div className="text-[11px] text-[#7B756C] text-center pt-2 font-mono">
                Direct quarry shipping & physical architectural sample boxes available.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          6. PRODUCT DESCRIPTION
          H2: About This Product
          Display database description with readable typography.
          ================================================== */}
      <section className="py-16 bg-white border-t border-[#E5DFD5]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="max-w-3xl">
            <span className="text-xs uppercase tracking-[0.25em] text-[#8C7A6B] font-semibold font-mono block mb-2">
              MATERIAL ESSENCE
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#2C2926] font-medium mb-6">
              About This Product
            </h2>
            <div className="text-[#4A4036] text-sm sm:text-base leading-relaxed space-y-4 font-light">
              {product.description ? (
                product.description
                  .split('\n')
                  .filter((p) => p.trim())
                  .map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))
              ) : (
                <p>{product.shortDescription}</p>
              )}
            </div>
          </div>

          {/* ==================================================
              5. PRODUCT INFORMATION (SPECIFICATION TABLE)
              H2: Product Details
              Only display non-empty fields. No fake values.
              ================================================== */}
          <div className="mt-16 pt-12 border-t border-[#EFECE6] max-w-4xl">
            <span className="text-xs uppercase tracking-[0.25em] text-[#8C7A6B] font-semibold font-mono block mb-2">
              TECHNICAL SPECIFICATIONS
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#2C2926] font-medium mb-6">
              Product Details
            </h2>

            <div className="bg-[#FBF9F5] border border-[#E5DFD5] overflow-hidden">
              <table className="w-full text-left text-xs sm:text-sm divide-y divide-[#E5DFD5]">
                <tbody className="divide-y divide-[#EFECE6]">
                  {specRows.map((row) => (
                    <tr key={row.label} className="hover:bg-white/60 transition-colors">
                      <th
                        scope="row"
                        className="py-3.5 px-5 sm:px-6 font-mono text-xs uppercase tracking-wider text-[#7B756C] w-1/3 bg-[#F5F2EB]/50"
                      >
                        {row.label}
                      </th>
                      <td className="py-3.5 px-5 sm:px-6 text-[#2C2926] font-medium">
                        {row.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ==================================================
              7. APPLICATIONS
              H2: Applications
              Only display applications stored in product database.
              ================================================== */}
          {product.applications && product.applications.length > 0 && (
            <div className="mt-16 pt-12 border-t border-[#EFECE6] max-w-4xl">
              <span className="text-xs uppercase tracking-[0.25em] text-[#8C7A6B] font-semibold font-mono block mb-2">
                ARCHITECTURAL DEPLOYMENT
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#2C2926] font-medium mb-6">
                Applications
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                {product.applications.map((app) => (
                  <div
                    key={app}
                    className="p-4 bg-[#FBF9F5] border border-[#E5DFD5] text-center hover:border-[#8C7A6B] transition-colors"
                  >
                    <span className="text-xs uppercase tracking-[0.16em] text-[#2C2926] font-medium block">
                      {app}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ==================================================
          8. REQUEST QUOTE CTA
          Headline: Interested in This Stone?
          Text: Tell us about your project and our team will help you find the right solution.
          Buttons: Request a Quote, Chat on WhatsApp
          ================================================== */}
      <section className="py-16 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="bg-[#2C2926] text-[#FBF9F5] p-8 sm:p-14 border border-[#1C1A18] shadow-xs text-center">
          <span className="text-xs uppercase tracking-[0.25em] text-[#D4CCB8] block mb-2 font-mono">
            CUSTOM CUTTING & QUARRY DIRECT LOGISTICS
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-white mb-4">
            Interested in This Stone?
          </h2>
          <p className="text-sm sm:text-base text-[#D4CCB8]/90 max-w-2xl mx-auto leading-relaxed font-light mb-8">
            Tell us about your project and our team will help you find the right solution.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() =>
                openQuoteModal(
                  {
                    id: product.id || product.slug,
                    name: product.name,
                    slug: product.slug
                  },
                  'product-section-cta'
                )
              }
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#FBF9F5] text-[#1C1A18] hover:bg-[#D4CCB8] text-xs uppercase tracking-[0.2em] font-semibold transition-all shadow-xs cursor-pointer"
            >
              <span>Request a Quote</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>

            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 border border-[#D4CCB8]/60 text-white hover:bg-white/10 text-xs uppercase tracking-[0.2em] font-semibold transition-all"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

      {/* ==================================================
          10. RELATED PROJECTS
          H2: Projects Using This Product (up to 3)
          If no matching projects: do not show empty section.
          ================================================== */}
      {featuredInProjects.length > 0 && (
        <section className="py-20 bg-white border-t border-[#E5DFD5]">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="mb-10">
              <span className="text-xs uppercase tracking-[0.25em] text-[#8C7A6B] font-semibold font-mono block">
                BUILT PORTFOLIO
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#2C2926] mt-1">
                Projects Using This Product
              </h2>
              <p className="text-xs text-[#7B756C] mt-1">
                See how {product.name} has been engineered and installed in built environments.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredInProjects.slice(0, 3).map((pr) => (
                <Link
                  key={pr.slug}
                  to={`/projects/${pr.slug}`}
                  className="group bg-[#FBF9F5] border border-[#E5DFD5] hover:border-[#8C7A6B] transition-all overflow-hidden block"
                >
                  <div className="aspect-16/10 bg-[#EFECE6] overflow-hidden relative">
                    <img
                      src={pr.coverImage}
                      alt={`${pr.name} - MOZAIK Natural Stone Project`}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 bg-[#1C1A18]/85 text-white backdrop-blur-xs">
                        {pr.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <span className="text-[10px] text-[#8C7A6B] font-mono block mb-1">
                      {pr.location}
                      {pr.country ? `, ${pr.country}` : ''} • {pr.year}
                    </span>
                    <h3 className="font-serif text-base text-[#2C2926] group-hover:text-[#4A4036] transition-colors font-medium">
                      {pr.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ==================================================
          9. RELATED PRODUCTS
          H2: You May Also Like (up to 4 products)
          ================================================== */}
      {relatedProducts.length > 0 && (
        <section className="py-20 bg-[#EFECE6] border-t border-[#E5DFD5]">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="flex items-center justify-between mb-12">
              <div>
                <span className="text-xs uppercase tracking-[0.25em] text-[#8C7A6B] font-semibold font-mono block">
                  CURATED SELECTION
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-[#2C2926] mt-1">
                  You May Also Like
                </h2>
              </div>
              <Link
                to={`/collection/${categorySlug}`}
                className="text-xs uppercase tracking-[0.16em] text-[#2C2926] font-semibold hover:text-[#8C7A6B]"
              >
                View More in {product.category}
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.slice(0, 4).map((rel) => (
                <ProductCard key={rel.id || rel.slug} product={rel} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ==================================================
          12. STICKY MOBILE CTA (Mobile only)
          Chat on WhatsApp & Get a Quote
          ================================================== */}
      <aside
        aria-label="Direct Action Bar"
        className="fixed bottom-0 inset-x-0 z-40 bg-[#1C1A18]/95 backdrop-blur-md border-t border-[#2C2926] p-2.5 flex items-center justify-between gap-2 sm:hidden shadow-2xl"
      >
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-1.5 py-3 px-3 bg-[#2C2926] border border-[#4A4036] text-white text-[11px] uppercase tracking-wider font-semibold active:bg-[#3E3A35]"
        >
          <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
          <span>Chat on WhatsApp</span>
        </a>
        <button
          onClick={() =>
            openQuoteModal(
              {
                id: product.id || product.slug,
                name: product.name,
                slug: product.slug
              },
              'product-mobile-sticky'
            )
          }
          className="flex-1 inline-flex items-center justify-center gap-1.5 py-3 px-3 bg-[#FBF9F5] text-[#1C1A18] text-[11px] uppercase tracking-wider font-semibold cursor-pointer shadow-xs active:bg-[#E5DFD5]"
        >
          <span>Get a Quote</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </aside>

      {/* ==================================================
          4. FULLSCREEN LIGHTBOX MODAL
          Previous, Next, Close, Keyboard control
          ================================================== */}
      {lightboxOpen && allImages.length > 0 && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-[#1C1A18]/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-8 animate-in fade-in duration-200"
          onClick={() => setLightboxOpen(false)}
        >
          {/* Top Bar with counter & close */}
          <div
            className="flex items-center justify-between text-white max-w-6xl mx-auto w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="font-mono text-xs tracking-widest text-[#D4CCB8]">
              <span>{lightboxIndex + 1}</span> / <span>{allImages.length}</span>
              <span className="mx-2 text-[#7B756C]">•</span>
              <span className="font-serif text-sm text-white">{product.name}</span>
            </div>

            <button
              onClick={() => setLightboxOpen(false)}
              className="p-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 transition-colors rounded-xs cursor-pointer"
              aria-label="Close Lightbox (Esc)"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Middle: Main Image with Prev / Next Controls */}
          <div
            className="relative flex-1 flex items-center justify-center max-w-6xl mx-auto w-full my-4"
            onClick={(e) => e.stopPropagation()}
          >
            {allImages.length > 1 && (
              <button
                onClick={handlePrevLightbox}
                className="absolute left-2 sm:left-4 z-10 p-3 text-white/90 hover:text-white bg-black/50 hover:bg-black/80 transition-colors cursor-pointer"
                aria-label="Previous Image"
              >
                <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
              </button>
            )}

            <div className="max-h-[75vh] max-w-[90vw] overflow-hidden flex items-center justify-center">
              <img
                src={allImages[lightboxIndex]}
                alt={`${product.name} - Fullscreen View ${lightboxIndex + 1}`}
                className="max-h-[75vh] max-w-[85vw] object-contain shadow-2xl transition-all duration-300"
              />
            </div>

            {allImages.length > 1 && (
              <button
                onClick={handleNextLightbox}
                className="absolute right-2 sm:right-4 z-10 p-3 text-white/90 hover:text-white bg-black/50 hover:bg-black/80 transition-colors cursor-pointer"
                aria-label="Next Image"
              >
                <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
              </button>
            )}
          </div>

          {/* Bottom Thumbnails bar in Lightbox */}
          {allImages.length > 1 && (
            <div
              className="flex items-center justify-center gap-2 overflow-x-auto py-2 max-w-2xl mx-auto w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {allImages.map((imgUrl, i) => (
                <button
                  key={i}
                  onClick={() => setLightboxIndex(i)}
                  className={`w-12 h-12 shrink-0 border overflow-hidden transition-all cursor-pointer ${
                    lightboxIndex === i
                      ? 'border-white ring-2 ring-white scale-105'
                      : 'border-white/30 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`Thumbnail ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
