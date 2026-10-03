import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { X, ZoomIn, ArrowRight } from 'lucide-react';
import { SEO } from '../components/SEO';
import { GalleryItem } from '../types';
import { getGallery } from '../services/db';

export const Gallery: React.FC = () => {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  const activeCategory = searchParams.get('filter') || 'All';

  const filterOptions = [
    'All',
    'Landscape',
    'Garden',
    'Interior',
    'Exterior',
    'Pool',
    'Wall',
    'Commercial'
  ];

  useEffect(() => {
    async function loadGalleryData() {
      try {
        const data = await getGallery();
        setGallery(data);
      } catch (err) {
        console.error("Gallery fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadGalleryData();
  }, []);

  const handleFilterClick = (cat: string) => {
    if (cat === 'All') {
      searchParams.delete('filter');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ filter: cat });
    }
  };

  const filteredItems = useMemo(() => {
    if (activeCategory === 'All') return gallery;
    return gallery.filter(
      (item) => item.category.toLowerCase() === activeCategory.toLowerCase()
    );
  }, [gallery, activeCategory]);

  return (
    <div className="bg-[#FBF9F5] min-h-screen">
      <SEO
        title="Natural Stone Gallery | Architecture & Landscape Installations | MOZAIK"
        description="Explore our masonry visual portfolio of architectural natural stone installations across swimming pools, luxury landscapes, facades, and interiors."
        canonicalUrl="/gallery"
        keywords="natural stone gallery, pool stone installation, landscape natural stone photos, pebble mosaic gallery, architectural stone photos"
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Gallery", url: "/gallery" }
        ]}
      />

      {/* Header Banner */}
      <section className="bg-[#1C1A18] text-white py-20 px-6 sm:px-8 lg:px-12 border-b border-[#2C2926]">
        <div className="max-w-7xl mx-auto">
          <nav className="text-xs uppercase tracking-[0.2em] text-[#D4CCB8] mb-4 flex items-center space-x-2 font-mono">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white">Gallery</span>
          </nav>

          <span className="text-xs uppercase tracking-[0.3em] text-[#D4CCB8] font-semibold block mb-2">
            Visual Inspiration Archive
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-normal text-[#FBF9F5]">
            Natural Stone Gallery
          </h1>
          <p className="text-sm sm:text-base text-[#D4CCB8]/90 max-w-2xl mt-4 leading-relaxed font-light">
            A curated photographic documentation of natural stone in dialogue with light, water, vegetation, and contemporary architecture.
          </p>
        </div>
      </section>

      {/* Filter Navigation */}
      <section className="sticky top-20 z-30 bg-[#FBF9F5]/95 backdrop-blur-md border-b border-[#E5DFD5] py-4 px-6 sm:px-8 lg:px-12 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center overflow-x-auto gap-2 no-scrollbar">
          {filterOptions.map((cat) => {
            const isSelected = activeCategory.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                onClick={() => handleFilterClick(cat)}
                className={`text-xs uppercase tracking-[0.15em] px-4 py-2 transition-all cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-[#2C2926] text-white font-medium'
                    : 'bg-[#EFECE6] text-[#7B756C] hover:text-[#2C2926] hover:bg-[#E5DFD5]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </section>

      {/* Masonry-style Grid */}
      <section className="py-16 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse bg-[#EFECE6] h-72 border border-[#E5DFD5]" />
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="py-20 text-center bg-white border border-[#E5DFD5] p-12">
            <h3 className="font-serif text-xl text-[#2C2926] mb-2">No gallery items in this category</h3>
            <p className="text-sm text-[#7B756C] mb-6">
              New project photography is being uploaded from our on-site architectural installations.
            </p>
            <button
              onClick={() => handleFilterClick('All')}
              className="text-xs uppercase tracking-[0.2em] px-6 py-3 bg-[#2C2926] text-white hover:bg-[#4A4036]"
            >
              Show All Photos
            </button>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {filteredItems.map((item, idx) => (
              <div
                key={item.id || idx}
                onClick={() => setActiveItem(item)}
                className="group relative break-inside-avoid bg-white border border-[#E5DFD5] overflow-hidden cursor-pointer hover:border-[#8C7A6B] transition-all duration-300"
              >
                <div className="relative overflow-hidden bg-[#EFECE6]">
                  <img
                    src={item.image}
                    alt={`${item.title} - MOZAIK Natural Stone`}
                    loading="lazy"
                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-104"
                  />
                  <div className="absolute inset-0 bg-[#1C1A18]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="p-3 bg-white/90 text-[#2C2926] rounded-full shadow-md">
                      <ZoomIn className="w-5 h-5" />
                    </span>
                  </div>
                  <div className="absolute top-3 left-3">
                    <span className="text-[9px] uppercase tracking-[0.2em] px-2.5 py-1 bg-[#1C1A18]/85 text-white backdrop-blur-xs font-medium">
                      {item.category}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="font-serif text-base text-[#2C2926] font-medium group-hover:text-[#4A4036] transition-colors mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#7B756C] line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Lightbox Modal */}
      {activeItem && (
        <div
          className="fixed inset-0 z-50 bg-[#1C1A18]/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 lg:p-10 animate-in fade-in duration-200"
          onClick={() => setActiveItem(null)}
        >
          <div
            className="relative max-w-5xl w-full bg-[#1C1A18] border border-[#4A4036] overflow-hidden text-white flex flex-col md:flex-row shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveItem(null)}
              className="absolute top-4 right-4 z-20 p-2.5 bg-[#1C1A18]/80 text-white hover:bg-white hover:text-[#1C1A18] transition-colors cursor-pointer"
              aria-label="Close Lightbox"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Lightbox Image */}
            <div className="md:w-7/12 bg-black flex items-center justify-center max-h-[70vh] md:max-h-[80vh] overflow-hidden">
              <img
                src={activeItem.image}
                alt={activeItem.altText || activeItem.title}
                className="max-h-full max-w-full object-contain"
              />
            </div>

            {/* Lightbox Meta */}
            <div className="md:w-5/12 p-8 flex flex-col justify-between bg-[#2C2926]">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#D4CCB8] block mb-2 font-mono">
                  Category: {activeItem.category}
                </span>
                <h3 className="font-serif text-2xl text-[#FBF9F5] font-normal mb-4">
                  {activeItem.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#D4CCB8]/80 leading-relaxed">
                  {activeItem.description}
                </p>
              </div>

              <div className="pt-8 border-t border-[#4A4036] mt-8 flex flex-col space-y-3">
                <Link
                  to={`/contact?type=quote&product=${encodeURIComponent(activeItem.title)}`}
                  onClick={() => setActiveItem(null)}
                  className="w-full text-center text-xs uppercase tracking-[0.2em] py-3.5 bg-[#FBF9F5] text-[#1C1A18] hover:bg-[#D4CCB8] font-semibold transition-all"
                >
                  Inquire This Material
                </Link>
                <Link
                  to="/collection"
                  onClick={() => setActiveItem(null)}
                  className="text-center text-xs tracking-wider text-[#A89F8D] hover:text-white py-1"
                >
                  View Related Collection
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
