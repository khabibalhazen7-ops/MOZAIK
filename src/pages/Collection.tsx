import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, ArrowRight, ArrowUpRight, MessageSquare } from 'lucide-react';
import { SEO } from '../components/SEO';
import { ProductCard } from '../components/ProductCard';
import { Product, Category } from '../types';
import { getProducts, getCategories } from '../services/db';
import { useQuoteModal } from '../context/QuoteModalContext';

export const Collection: React.FC = () => {
  const { openQuoteModal } = useQuoteModal();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const activeCategory = searchParams.get('category') || 'All';
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const [prodList, catList] = await Promise.all([
          getProducts(),
          getCategories()
        ]);
        setProducts(prodList);
        setCategories(catList);
      } catch (err) {
        console.error("Collection load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filterOptions = [
    'All',
    'Mosaic Stone',
    'Pebble',
    'Gravel',
    'Natural Stone',
    'Decorative Stone',
    'Custom Mosaic'
  ];

  const handleCategorySelect = (categoryName: string) => {
    if (categoryName === 'All') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: categoryName });
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCat =
        activeCategory === 'All' ||
        p.category.toLowerCase() === activeCategory.toLowerCase();
      const matchSearch =
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.material.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.color.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.applications?.some(a => a.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [products, activeCategory, searchQuery]);

  return (
    <div className="bg-[#FBF9F5] min-h-screen">
      <SEO
        title="Natural Stone Collection | Mosaic, Pebble & Decorative Stone | MOZAIK"
        description="Explore MOZAIK's collection of natural stone, mosaic stone, pebble, gravel and decorative stone for architecture, landscape and interior projects."
        canonicalUrl="/collection"
        keywords="natural stone collection, mosaic stone, pebbles, gravel, architectural stone indonesia, basalt, andesite, crazy paving"
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Collection", url: "/collection" }
        ]}
      />

      {/* Header Banner */}
      <section className="bg-[#1C1A18] text-white py-20 px-6 sm:px-8 lg:px-12 border-b border-[#2C2926]">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="text-xs uppercase tracking-[0.2em] text-[#D4CCB8] mb-4 flex items-center space-x-2 font-mono">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white">Collection</span>
          </nav>

          <span className="text-xs uppercase tracking-[0.3em] text-[#D4CCB8] font-semibold block mb-2">
            Architectural Catalog
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-normal text-[#FBF9F5] max-w-3xl">
            Natural Stone Collection
          </h1>
          <p className="text-sm sm:text-base text-[#D4CCB8]/90 max-w-2xl mt-4 leading-relaxed font-light">
            Explore our collection of natural stone, mosaic, pebble, and decorative materials for architecture, landscape, and interior applications.
          </p>

          {/* Quick Category Deep Links */}
          <div className="mt-8 flex flex-wrap gap-2 pt-4 border-t border-[#2C2926]">
            <span className="text-[11px] text-[#A89F8D] uppercase tracking-wider self-center mr-2">
              Browse by Page:
            </span>
            {categories.map((c) => (
              <Link
                key={c.slug}
                to={`/collection/${c.slug}`}
                className="text-xs tracking-wider px-3 py-1.5 bg-[#2C2926] text-[#D4CCB8] hover:text-white hover:bg-[#4A4036] transition-colors border border-[#4A4036]/50"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="sticky top-20 z-40 bg-[#FBF9F5]/95 backdrop-blur-md border-b border-[#E5DFD5] py-4 px-6 sm:px-8 lg:px-12 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center overflow-x-auto w-full md:w-auto pb-2 md:pb-0 gap-1.5 no-scrollbar">
            {filterOptions.map((cat) => {
              const selected = activeCategory.toLowerCase() === cat.toLowerCase();
              return (
                <button
                  key={cat}
                  onClick={() => handleCategorySelect(cat)}
                  className={`text-xs uppercase tracking-[0.14em] px-3.5 py-2 transition-all shrink-0 cursor-pointer ${
                    selected
                      ? 'bg-[#2C2926] text-white font-medium shadow-xs'
                      : 'bg-[#EFECE6] text-[#7B756C] hover:text-[#2C2926] hover:bg-[#E5DFD5]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7B756C]" />
            <input
              type="text"
              placeholder="Search material, color, size..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-[#E5DFD5] pl-10 pr-4 py-2 text-xs text-[#2C2926] placeholder-[#A89F8D] focus:outline-hidden focus:border-[#2C2926] transition-colors"
            />
          </div>
        </div>
      </section>

      {/* Product Grid Area */}
      <section className="py-16 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#EFECE6]">
          <span className="text-xs uppercase tracking-wider text-[#7B756C]">
            Showing <strong className="text-[#2C2926]">{filteredProducts.length}</strong> materials
            {activeCategory !== 'All' && <span> in {activeCategory}</span>}
          </span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-[#8C7A6B] hover:text-[#2C2926] underline"
            >
              Clear Search
            </button>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="animate-pulse bg-[#EFECE6] h-80 border border-[#E5DFD5]" />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-20 text-center bg-white border border-[#E5DFD5] p-12">
            <h3 className="font-serif text-xl text-[#2C2926] mb-2">No materials found</h3>
            <p className="text-sm text-[#7B756C] max-w-md mx-auto mb-6">
              We couldn't find any stone product matching your filter or search query. Our stonemasons can create custom compositions upon request.
            </p>
            <button
              onClick={() => {
                setSearchParams({});
                setSearchQuery('');
              }}
              className="text-xs uppercase tracking-[0.2em] px-6 py-3 bg-[#2C2926] text-white hover:bg-[#4A4036] cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id || product.slug} product={product} />
            ))}
          </div>
        )}

        {/* Collection GET A QUOTE Banner - Step 6 Requirement */}
        <div className="mt-16 bg-[#2C2926] text-[#FBF9F5] p-8 sm:p-12 border border-[#1C1A18] shadow-xs flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl">
            <span className="text-xs uppercase tracking-[0.25em] text-[#D4CCB8] block mb-2 font-mono">
              SPECIFY FOR ARCHITECTURAL TENDERS
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-normal text-white">
              Need Custom Sizing, Physical Samples or Bulk Container Pricing?
            </h3>
            <p className="text-xs sm:text-sm text-[#D4CCB8]/80 mt-2 font-light leading-relaxed">
              Our direct quarry advisors calculate square meter coverage, weight estimates, and global shipping logistics tailored to your exact bill of quantities.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
            <button
              onClick={() => openQuoteModal(null, 'collection')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#FBF9F5] text-[#1C1A18] hover:bg-[#D4CCB8] text-xs uppercase tracking-[0.18em] font-semibold transition-all shadow-xs cursor-pointer"
            >
              <span>GET A QUOTE</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
            <Link
              to="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-[#D4CCB8]/60 text-white hover:bg-white/10 text-xs uppercase tracking-[0.18em] font-medium transition-all"
            >
              <span>Contact Showroom</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Category Visual Showcase */}
      <section className="py-20 bg-[#EFECE6] border-t border-[#E5DFD5]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="mb-12">
            <span className="text-xs uppercase tracking-[0.25em] text-[#8C7A6B] font-semibold">
              Stone Classifications
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#2C2926] mt-1">
              Explore by Dedicated Category
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                to={`/collection/${cat.slug}`}
                className="group relative aspect-16/10 overflow-hidden bg-[#2C2926] border border-[#D4CCB8] block"
              >
                <img
                  src={cat.image}
                  alt={`${cat.name} - MOZAIK Natural Stone`}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-75"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1C1A18]/90 via-[#1C1A18]/40 to-transparent" />
                <div className="absolute bottom-0 inset-x-0 p-6 text-white">
                  <h3 className="font-serif text-xl font-medium group-hover:text-[#D4CCB8] transition-colors flex items-center justify-between">
                    <span>{cat.name}</span>
                    <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </h3>
                  <p className="text-xs text-[#EFECE6]/80 mt-1 line-clamp-2">
                    {cat.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
