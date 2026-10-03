import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  MapPin,
  Calendar,
  Layers,
  MessageSquare,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  ExternalLink,
  ShieldCheck,
  Building,
  User
} from 'lucide-react';
import { SEO } from '../components/SEO';
import { Project, Product } from '../types';
import { getProjectBySlug, getProjects, getProducts } from '../services/db';

export const ProjectDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [otherProjects, setOtherProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Lightbox State
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    async function loadProjectData() {
      if (!slug) return;
      setLoading(true);
      try {
        const [proj, allProj, prods] = await Promise.all([
          getProjectBySlug(slug),
          getProjects(),
          getProducts()
        ]);
        setProject(proj);
        setAllProducts(prods);
        setOtherProjects(allProj.filter((p) => p.slug !== slug).slice(0, 3));
      } catch (err) {
        console.error("Project load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProjectData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  // Gallery items normalization
  const galleryItems = React.useMemo(() => {
    if (!project) return [];
    const list: { url: string; alt: string; order: number }[] = [];

    // Always include cover as first item if desirable, or only gallery
    if (Array.isArray(project.galleryImages) && project.galleryImages.length > 0) {
      project.galleryImages.forEach((img, idx) => {
        if (typeof img === 'string') {
          list.push({
            url: img,
            alt: `${project.name} - MOZAIK Natural Stone Project`,
            order: idx + 1
          });
        } else if (img && img.url) {
          list.push({
            url: img.url,
            alt: img.alt || `${project.name} - MOZAIK Natural Stone Project`,
            order: img.order || idx + 1
          });
        }
      });
    }

    return list.sort((a, b) => a.order - b.order);
  }, [project]);

  // Lightbox keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeLightboxIndex === null) return;
      if (e.key === 'Escape') setActiveLightboxIndex(null);
      if (e.key === 'ArrowRight') {
        setActiveLightboxIndex((prev) =>
          prev !== null ? (prev + 1) % galleryItems.length : null
        );
      }
      if (e.key === 'ArrowLeft') {
        setActiveLightboxIndex((prev) =>
          prev !== null ? (prev - 1 + galleryItems.length) % galleryItems.length : null
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeLightboxIndex, galleryItems.length]);

  // Matched products used
  const matchedProducts = React.useMemo(() => {
    if (!project || !project.productsUsed) return [];
    const raw = project.productsUsed;
    const slugsOrNames: string[] = Array.isArray(raw)
      ? raw
      : raw.split(',').map((s) => s.trim().toLowerCase());

    return allProducts.filter((p) => {
      return (
        slugsOrNames.includes(p.slug.toLowerCase()) ||
        slugsOrNames.includes(p.name.toLowerCase()) ||
        slugsOrNames.some((query) => p.name.toLowerCase().includes(query))
      );
    });
  }, [project, allProducts]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBF9F5] flex items-center justify-center py-24">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-[#2C2926] border-t-transparent animate-spin rounded-full mx-auto mb-4" />
          <span className="text-xs uppercase tracking-[0.25em] text-[#7B756C] font-mono">
            Loading Project Folio...
          </span>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#FBF9F5] py-24 px-6 text-center">
        <div className="max-w-md mx-auto bg-white p-12 border border-[#E5DFD5]">
          <h2 className="font-serif text-2xl text-[#2C2926] mb-3">Project Not Found</h2>
          <p className="text-sm text-[#7B756C] mb-6">
            The project you are looking for does not exist or has been updated.
          </p>
          <Link
            to="/projects"
            className="inline-flex items-center text-xs uppercase tracking-[0.2em] px-6 py-3 bg-[#2C2926] text-white hover:bg-[#4A4036]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span>Return to Projects</span>
          </Link>
        </div>
      </div>
    );
  }

  const seoPageTitle =
    project.seoTitle || `${project.name} | Natural Stone Project | MOZAIK`;
  const seoPageDescription =
    project.seoDescription ||
    project.description.slice(0, 160) ||
    `Explore ${project.name} featuring Indonesian natural stone by MOZAIK.`;

  return (
    <div className="bg-[#FBF9F5] min-h-screen">
      {/* Dynamic SEO Tags & Structured Data */}
      <SEO
        title={seoPageTitle}
        description={seoPageDescription}
        keywords={
          project.seoKeywords ||
          `${project.name}, natural stone project, ${project.category}, bali stone`
        }
        ogImage={project.coverImage}
        canonicalUrl={`/projects/${project.slug}`}
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Projects", url: "/projects" },
          { name: project.name, url: `/projects/${project.slug}` }
        ]}
      />

      {/* Breadcrumb Navigation - Requirement 9 */}
      <section className="bg-white border-b border-[#E5DFD5] py-3.5 px-6 sm:px-8 lg:px-12 sticky top-20 z-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <nav className="text-xs uppercase tracking-[0.18em] text-[#7B756C] flex items-center space-x-2 font-mono overflow-x-auto">
            <Link to="/" className="hover:text-[#2C2926]">Home</Link>
            <span>/</span>
            <Link to="/projects" className="hover:text-[#2C2926]">Projects</Link>
            <span>/</span>
            <span className="text-[#2C2926] font-semibold truncate max-w-xs">{project.name}</span>
          </nav>

          <Link
            to="/projects"
            className="hidden sm:inline-flex items-center text-xs text-[#7B756C] hover:text-[#2C2926] uppercase tracking-wider"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            <span>All Projects</span>
          </Link>
        </div>
      </section>

      {/* Large Cover Image - Requirement 9 */}
      <section className="relative aspect-21/9 min-h-[440px] bg-[#1C1A18] overflow-hidden">
        <img
          src={project.coverImage}
          alt={`${project.name} - MOZAIK Natural Stone Project`}
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C1A18] via-[#1C1A18]/40 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 p-8 sm:p-12 lg:p-16 max-w-7xl mx-auto text-white">
          <div className="inline-flex items-center space-x-3 text-xs uppercase tracking-[0.25em] text-[#D4CCB8] mb-3 font-mono">
            <span className="px-2.5 py-1 bg-white/20 backdrop-blur-xs font-semibold">
              {project.category}
            </span>
            <span>•</span>
            <span>{project.location}{project.country ? `, ${project.country}` : ''}</span>
            <span>•</span>
            <span>{project.year}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-normal text-white max-w-4xl">
            {project.name}
          </h1>
        </div>
      </section>

      {/* Content & Specifications Grid */}
      <section className="py-16 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Main Narrative & Gallery (8 cols) */}
          <div className="lg:col-span-8 space-y-12">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-[#8C7A6B] font-semibold block mb-2 font-mono">
                ARCHITECTURAL BRIEF
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#2C2926] mb-4">
                Design Concept & Materiality
              </h2>
              <div className="text-sm sm:text-base text-[#7B756C] leading-relaxed whitespace-pre-line space-y-4 font-light">
                {project.description}
              </div>
            </div>

            {/* Application Scope */}
            {project.application && (
              <div className="p-6 bg-[#FFFFFF] border border-[#E5DFD5]">
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#8C7A6B] block mb-2">
                  Spatial Application Scope
                </span>
                <p className="text-xs text-[#2C2926] font-medium leading-relaxed">
                  {project.application}
                </p>
              </div>
            )}

            {/* Project Gallery - Requirement 10 (Premium Masonry / Grid with Lightbox) */}
            {galleryItems.length > 0 && (
              <div className="pt-8 border-t border-[#E5DFD5] space-y-6">
                <div>
                  <span className="text-xs uppercase tracking-[0.25em] text-[#8C7A6B] font-semibold block mb-1 font-mono">
                    PHOTOGRAPHIC DOCUMENTATION
                  </span>
                  <h3 className="font-serif text-2xl text-[#2C2926]">
                    Project Gallery ({galleryItems.length})
                  </h3>
                  <p className="text-xs text-[#7B756C] mt-1 font-light">
                    Click any image to view in high-resolution lightbox with complete architectural details.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {galleryItems.map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => setActiveLightboxIndex(idx)}
                      className="group relative aspect-4/3 bg-[#EFECE6] border border-[#E5DFD5] overflow-hidden cursor-pointer"
                    >
                      <img
                        src={img.url}
                        alt={img.alt || `${project.name} - MOZAIK Natural Stone Project`}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-106"
                      />
                      <div className="absolute inset-0 bg-[#1C1A18]/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="p-2.5 bg-white/90 text-[#2C2926] shadow-sm">
                          <Maximize2 className="w-4 h-4" />
                        </span>
                      </div>
                      <div className="absolute bottom-2 left-2 right-2 bg-[#1C1A18]/80 text-white p-2 text-[10px] font-mono truncate opacity-0 group-hover:opacity-100 transition-opacity">
                        {img.alt}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Related Products Used - Requirement 11 (Links to /products/:slug) */}
            <div className="pt-8 border-t border-[#E5DFD5] space-y-6">
              <div>
                <span className="text-xs uppercase tracking-[0.25em] text-[#8C7A6B] font-semibold block mb-1 font-mono">
                  SUPPLIED STONE MATERIALS
                </span>
                <h3 className="font-serif text-2xl text-[#2C2926]">
                  Products Used in This Project
                </h3>
                <p className="text-xs text-[#7B756C] mt-1 font-light">
                  Architectural grade stone materials cut and finished to specification for {project.name}.
                </p>
              </div>

              {matchedProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {matchedProducts.map((p) => (
                    <Link
                      key={p.slug}
                      to={`/products/${p.slug}`}
                      className="flex items-center gap-4 p-4 bg-white border border-[#E5DFD5] hover:border-[#8C7A6B] transition-colors group"
                    >
                      <div className="w-16 h-16 bg-[#EFECE6] border border-[#E5DFD5] overflow-hidden shrink-0">
                        <img
                          src={p.mainImage}
                          alt={p.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] uppercase font-mono tracking-wider text-[#8C7A6B] block">
                          {p.category}
                        </span>
                        <h4 className="font-serif text-base font-medium text-[#2C2926] group-hover:text-[#4A4036] truncate">
                          {p.name}
                        </h4>
                        <span className="text-[11px] text-[#2C2926] font-semibold inline-flex items-center gap-1 mt-1">
                          <span>View Product Specs</span>
                          <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-white border border-[#E5DFD5] text-xs text-[#2C2926] font-mono">
                  {typeof project.productsUsed === 'string'
                    ? project.productsUsed
                    : Array.isArray(project.productsUsed)
                    ? project.productsUsed.join(', ')
                    : 'Natural Stone Specifications'}
                </div>
              )}
            </div>
          </div>

          {/* Right Meta Column (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-8 border border-[#E5DFD5] space-y-6 shadow-xs">
              <h3 className="font-serif text-xl text-[#2C2926] pb-4 border-b border-[#EFECE6]">
                Project Folio Summary
              </h3>

              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-[#8C7A6B] uppercase tracking-wider font-mono block mb-1">
                    Location & Country
                  </span>
                  <span className="text-[#2C2926] font-medium text-sm flex items-center">
                    <MapPin className="w-3.5 h-3.5 mr-1.5 text-[#8C7A6B]" />
                    {project.location}{project.country ? `, ${project.country}` : ''}
                  </span>
                </div>

                <div>
                  <span className="text-[#8C7A6B] uppercase tracking-wider font-mono block mb-1">
                    Completion Year
                  </span>
                  <span className="text-[#2C2926] font-medium text-sm flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-1.5 text-[#8C7A6B]" />
                    {project.year}
                  </span>
                </div>

                <div>
                  <span className="text-[#8C7A6B] uppercase tracking-wider font-mono block mb-1">
                    Architectural Typology
                  </span>
                  <span className="text-[#2C2926] font-medium text-sm">
                    {project.category}
                  </span>
                </div>

                {project.client && (
                  <div>
                    <span className="text-[#8C7A6B] uppercase tracking-wider font-mono block mb-1">
                      Client / Owner
                    </span>
                    <span className="text-[#2C2926] font-medium text-sm flex items-center">
                      <User className="w-3.5 h-3.5 mr-1.5 text-[#8C7A6B]" />
                      {project.client}
                    </span>
                  </div>
                )}

                {project.architect && (
                  <div>
                    <span className="text-[#8C7A6B] uppercase tracking-wider font-mono block mb-1">
                      Architect / Designer
                    </span>
                    <span className="text-[#2C2926] font-medium text-sm flex items-center">
                      <Building className="w-3.5 h-3.5 mr-1.5 text-[#8C7A6B]" />
                      {project.architect}
                    </span>
                  </div>
                )}
              </div>

              {/* Inquiry Action */}
              <div className="pt-4 border-t border-[#EFECE6] space-y-3">
                <Link
                  to={`/contact?type=quote&project=${encodeURIComponent(project.name)}`}
                  className="w-full inline-flex items-center justify-center py-3.5 px-4 bg-[#2C2926] text-white hover:bg-[#4A4036] text-xs uppercase tracking-[0.18em] font-semibold transition-all shadow-xs"
                >
                  <span>Request Similar Materials</span>
                  <ArrowUpRight className="w-4 h-4 ml-1.5" />
                </Link>

                <a
                  href={`https://wa.me/6281288880919?text=Hello%20MOZAIK%2C%20I%20am%20inquiring%20about%20materials%20used%20in%20project%3A%20${encodeURIComponent(project.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center py-3 px-4 border border-[#D4CCB8] text-[#2C2926] hover:bg-[#EFECE6] text-xs uppercase tracking-[0.16em] font-medium transition-all"
                >
                  <MessageSquare className="w-4 h-4 mr-2 text-[#8C7A6B]" />
                  <span>WhatsApp Quarry Team</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox Modal - Requirement 10 (Previous, Next, Close, Responsive) */}
      {activeLightboxIndex !== null && galleryItems[activeLightboxIndex] && (
        <div className="fixed inset-0 z-50 bg-[#1C1A18]/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8">
          {/* Close Button */}
          <button
            onClick={() => setActiveLightboxIndex(null)}
            className="absolute top-6 right-6 text-white/80 hover:text-white p-2 cursor-pointer z-50"
            title="Close Lightbox (Esc)"
          >
            <X className="w-7 h-7" />
          </button>

          {/* Navigation Controls */}
          {galleryItems.length > 1 && (
            <>
              <button
                onClick={() =>
                  setActiveLightboxIndex(
                    (prev) =>
                      (prev! - 1 + galleryItems.length) % galleryItems.length
                  )
                }
                className="absolute left-4 sm:left-8 text-white/80 hover:text-white p-3 bg-white/10 hover:bg-white/20 backdrop-blur-xs cursor-pointer z-50 transition-colors"
                title="Previous Image (Left Arrow)"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={() =>
                  setActiveLightboxIndex(
                    (prev) => (prev! + 1) % galleryItems.length
                  )
                }
                className="absolute right-4 sm:right-8 text-white/80 hover:text-white p-3 bg-white/10 hover:bg-white/20 backdrop-blur-xs cursor-pointer z-50 transition-colors"
                title="Next Image (Right Arrow)"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Main Lightbox Content */}
          <div className="max-w-5xl max-h-[85vh] flex flex-col items-center">
            <img
              src={galleryItems[activeLightboxIndex].url}
              alt={galleryItems[activeLightboxIndex].alt}
              className="max-h-[75vh] w-auto max-w-full object-contain shadow-2xl"
            />
            <div className="mt-4 text-center text-white/90">
              <p className="text-xs sm:text-sm font-medium">
                {galleryItems[activeLightboxIndex].alt}
              </p>
              <span className="text-[11px] font-mono text-[#D4CCB8] mt-1 block">
                Photo {activeLightboxIndex + 1} of {galleryItems.length}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Sibling Featured Projects */}
      {otherProjects.length > 0 && (
        <section className="py-20 bg-white border-t border-[#E5DFD5] px-6 sm:px-8 lg:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-10 pb-4 border-b border-[#EFECE6]">
              <div>
                <span className="text-xs uppercase tracking-[0.25em] text-[#8C7A6B] font-semibold block mb-1 font-mono">
                  EXPLORE MORE ARCHITECTURE
                </span>
                <h3 className="font-serif text-2xl text-[#2C2926]">
                  Related Architectural Projects
                </h3>
              </div>
              <Link
                to="/projects"
                className="text-xs uppercase tracking-[0.16em] text-[#2C2926] font-semibold hover:text-[#8C7A6B] inline-flex items-center"
              >
                <span>View All Projects</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {otherProjects.map((p) => (
                <Link
                  key={p.slug}
                  to={`/projects/${p.slug}`}
                  className="group flex flex-col bg-[#FBF9F5] border border-[#E5DFD5] hover:border-[#8C7A6B] transition-colors"
                >
                  <div className="aspect-16/10 overflow-hidden bg-[#EFECE6]">
                    <img
                      src={p.coverImage}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-mono tracking-wider text-[#8C7A6B] block mb-1">
                        {p.category} • {p.location}
                      </span>
                      <h4 className="font-serif text-lg font-medium text-[#2C2926] group-hover:text-[#4A4036] transition-colors">
                        {p.name}
                      </h4>
                    </div>
                    <span className="text-xs uppercase tracking-wider font-semibold text-[#2C2926] inline-flex items-center gap-1 mt-4">
                      <span>View Folio</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
