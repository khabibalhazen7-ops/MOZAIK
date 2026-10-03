import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react';
import { SEO } from '../components/SEO';
import { ProductCard } from '../components/ProductCard';
import { Product, Category } from '../types';
import { getProducts, getCategories } from '../services/db';

export const CategoryPage: React.FC = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
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
        console.error("Category page load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [categorySlug]);

  const currentCategory = categories.find(
    (c) =>
      c.slug === categorySlug ||
      (categorySlug === 'pebble-stone' && c.slug === 'pebble') ||
      (categorySlug === 'pebble' && c.slug === 'pebble-stone')
  );

  // If matched by category name or slug
  const categoryProducts = useMemo(() => {
    if (!currentCategory) return [];
    return products.filter((p) => {
      const matchCat =
        p.category.toLowerCase() === currentCategory.name.toLowerCase() ||
        p.category.toLowerCase().replace(/\s+/g, '-') === categorySlug?.toLowerCase();
      const matchSearch =
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.material.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [products, currentCategory, categorySlug, searchQuery]);

  const categoryName = currentCategory ? currentCategory.name : (categorySlug?.replace(/-/g, ' ').toUpperCase() || 'Category');

  return (
    <div className="bg-[#FBF9F5] min-h-screen">
      <SEO
        title={currentCategory?.seoTitle || `${categoryName} | Natural Stone ${categoryName} Collection | MOZAIK`}
        description={
          currentCategory?.seoDescription ||
          currentCategory?.description ||
          `Explore MOZAIK ${categoryName.toLowerCase()} collection for landscape, architecture, interior and exterior applications.`
        }
        canonicalUrl={`/collection/${categorySlug}`}
        ogImage={currentCategory?.image}
        keywords={`${categoryName}, natural stone indonesia, ${categoryName} supplier, mosaic stone, architectural stones`}
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Collection", url: "/collection" },
          { name: categoryName, url: `/collection/${categorySlug}` }
        ]}
      />

      {/* Hero Category Header */}
      <section className="relative bg-[#1C1A18] text-white py-20 px-6 sm:px-8 lg:px-12 overflow-hidden border-b border-[#2C2926]">
        {currentCategory?.image && (
          <div className="absolute inset-0 z-0">
            <img
              src={currentCategory.image}
              alt={`${categoryName} - MOZAIK Natural Stone`}
              className="w-full h-full object-cover opacity-25"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1C1A18] via-[#1C1A18]/70 to-[#1C1A18]/50" />
          </div>
        )}

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Breadcrumb Navigation */}
          <nav className="text-xs uppercase tracking-[0.2em] text-[#D4CCB8] mb-6 flex items-center space-x-2 font-mono">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link to="/collection" className="hover:text-white transition-colors">Collection</Link>
            <span>/</span>
            <span className="text-white">{categoryName}</span>
          </nav>

          <span className="text-xs uppercase tracking-[0.3em] text-[#D4CCB8] font-semibold block mb-2">
            Natural Stone Category
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-normal text-[#FBF9F5]">
            {categoryName}
          </h1>
          <p className="text-sm sm:text-base text-[#D4CCB8]/90 max-w-2xl mt-4 leading-relaxed font-light">
            {currentCategory?.description ||
              `Artisanal and high-performance ${categoryName} sourced directly from verified Indonesian quarries.`}
          </p>

          {/* Sibling Category Switcher */}
          <div className="mt-8 flex flex-wrap gap-2 pt-4 border-t border-[#2C2926]/80">
            <span className="text-[11px] text-[#A89F8D] uppercase tracking-wider self-center mr-2">
              Other Categories:
            </span>
            {categories.map((c) => (
              <Link
                key={c.slug}
                to={`/collection/${c.slug}`}
                className={`text-xs tracking-wider px-3 py-1.5 transition-colors border ${
                  c.slug === categorySlug
                    ? 'bg-[#FBF9F5] text-[#1C1A18] border-white font-semibold'
                    : 'bg-[#2C2926] text-[#D4CCB8] hover:text-white hover:bg-[#4A4036] border-[#4A4036]/60'
                }`}
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Filter & Search Bar */}
      <section className="bg-[#FBF9F5] border-b border-[#E5DFD5] py-4 px-6 sm:px-8 lg:px-12 sticky top-20 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            to="/collection"
            className="inline-flex items-center text-xs uppercase tracking-[0.16em] text-[#7B756C] hover:text-[#2C2926]"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            <span>Back to All Collections</span>
          </Link>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7B756C]" />
            <input
              type="text"
              placeholder={`Search in ${categoryName}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-[#E5DFD5] pl-10 pr-4 py-2 text-xs text-[#2C2926] placeholder-[#A89F8D] focus:outline-hidden focus:border-[#2C2926]"
            />
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="py-16 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#EFECE6]">
          <span className="text-xs uppercase tracking-wider text-[#7B756C]">
            Found <strong className="text-[#2C2926]">{categoryProducts.length}</strong> items in {categoryName}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-[#EFECE6] h-80 border border-[#E5DFD5]" />
            ))}
          </div>
        ) : categoryProducts.length === 0 ? (
          <div className="py-20 text-center bg-white border border-[#E5DFD5] p-12">
            <h3 className="font-serif text-xl text-[#2C2926] mb-2">No products currently listed</h3>
            <p className="text-sm text-[#7B756C] max-w-md mx-auto mb-6">
              Products for this category are being updated in our quarry registry. Contact our team to request custom specs or availability.
            </p>
            <Link
              to="/contact?type=quote"
              className="text-xs uppercase tracking-[0.2em] px-6 py-3 bg-[#2C2926] text-white hover:bg-[#4A4036]"
            >
              Inquire Custom Specs
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categoryProducts.map((product) => (
              <ProductCard key={product.id || product.slug} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
