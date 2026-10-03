import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  Mountain,
  Layers,
  Sparkles,
  HeadphonesIcon,
  MessageSquare,
  MapPin
} from 'lucide-react';
import { SEO } from '../components/SEO';
import { ProductCard } from '../components/ProductCard';
import { Product, Category, GalleryItem, Project } from '../types';
import { getProducts, getCategories, getGallery, getFeaturedProjects } from '../services/db';
import { useQuoteModal } from '../context/QuoteModalContext';

export const Home: React.FC = () => {
  const { openQuoteModal } = useQuoteModal();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [prodData, catData, galData, projData] = await Promise.all([
          getProducts(),
          getCategories(),
          getGallery(),
          getFeaturedProjects(3)
        ]);
        setProducts(prodData);
        setCategories(catData);
        setGallery(galData);
        setProjects(projData);
      } catch (err) {
        console.error("Home data load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const applications = [
    {
      title: "Landscape",
      desc: "Flagstone pavers, stepping stones, and natural retaining walls.",
      image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Garden",
      desc: "River pebbles, crazy paving, zen gravel, and organic decorative mulch.",
      image: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Interior",
      desc: "Honed basalt flooring, pebble shower pans, and tactile accent walls.",
      image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Exterior",
      desc: "Weather-resilient andesite facades, entrance gates, and courtyards.",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Pool",
      desc: "Balinese Sukabumi quartzite, non-slip copings, and pebble mosaics.",
      image: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Wall",
      desc: "Volcanic stone cladding, textured reliefs, and geometric mosaics.",
      image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Commercial",
      desc: "High-traffic civic plazas, luxury resort lobbies, and urban masterplans.",
      image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80"
    }
  ];

  const whyMozaik = [
    {
      icon: ShieldCheck,
      title: "Premium Natural Stone",
      desc: "Responsibly extracted and refined from Indonesia's rich geological deposits with uncompromising density and durability."
    },
    {
      icon: Mountain,
      title: "Indonesian Materials",
      desc: "Authentic volcanic andesite, basalt, Bali Sukabumi green quartzite, and smooth river pebbles straight from primary quarries."
    },
    {
      icon: Layers,
      title: "Wide Product Collection",
      desc: "From calibrated pool tiles and interlocking pebble mosaics to heavy-duty flamed pavers and architectural gravel aggregates."
    },
    {
      icon: Sparkles,
      title: "Custom Solutions",
      desc: "Tailored dimensions, bespoke waterjet cutting, custom mosaic mesh assemblies, and architectural finish calibrations."
    },
    {
      icon: HeadphonesIcon,
      title: "Professional Support",
      desc: "Dedicated architectural consultants, complimentary physical sample boxes, technical data sheets, and project logistics coordination."
    }
  ];

  return (
    <div className="bg-[#FBF9F5]">
      {/* 12. SEO METADATA */}
      <SEO
        title="MOZAIK | Natural Stone & Mosaic Collection from Indonesia"
        description="Explore MOZAIK's natural stone, mosaic stone, pebble and decorative stone collection from Indonesia for architecture, landscape and interior projects."
        canonicalUrl="/"
        keywords="natural stone indonesia, mosaic stone, pebble stone, gravel, andesite, sukabumi green stone, crazy paving, architectural stone supplier indonesia"
      />

      {/* 1 & 2. HERO SECTION */}
      <section className="relative min-h-[88vh] flex items-center justify-center bg-[#1C1A18] overflow-hidden">
        {/* Background Image with natural daylight balance & reduced dark overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=85"
            alt="MOZAIK Natural Stone Architectural Project"
            className="w-full h-full object-cover opacity-65 scale-102 transition-opacity duration-1000"
          />
          {/* Natural neutral overlay letting stone texture remain visible */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1A18]/90 via-[#1C1A18]/40 to-black/20" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8 py-24 text-center text-white">
          {/* Eyebrow */}
          <div className="inline-flex items-center space-x-2 text-[10px] md:text-xs uppercase tracking-[0.32em] text-[#D4CCB8] mb-6 font-mono font-medium">
            <span>AUTHENTIC INDONESIAN QUARRIES • ARCHITECTURAL GRADE</span>
          </div>

          {/* Single H1 on the homepage */}
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-normal tracking-[0.04em] mb-4 text-[#FBF9F5] leading-tight max-w-4xl mx-auto">
            Natural Stone & Mosaic Collection
          </h1>

          {/* Subheading */}
          <p className="font-serif italic text-lg sm:text-2xl md:text-3xl text-[#D4CCB8] tracking-wider mb-6 font-light">
            Natural Stone. Timeless Design.
          </p>

          {/* Description */}
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-[#D4CCB8]/95 font-light leading-relaxed mb-10 tracking-wide">
            Premium natural stone, mosaic stone, pebble and decorative stone from Indonesia for architecture, landscape and interior projects.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/collection"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-[#FBF9F5] text-[#1C1A18] hover:bg-[#D4CCB8] text-xs uppercase tracking-[0.2em] font-semibold transition-all duration-300"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
            <button
              onClick={() => openQuoteModal(null, 'homepage-hero')}
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border border-[#D4CCB8]/70 text-[#FBF9F5] hover:bg-[#FBF9F5]/10 text-xs uppercase tracking-[0.2em] font-medium transition-all duration-300 cursor-pointer"
            >
              <span>Get a Quote</span>
              <ArrowUpRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      </section>

      {/* 3. INTRODUCTION SECTION */}
      <section className="py-20 bg-white border-b border-[#E5DFD5]">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-[#8C7A6B] font-semibold block mb-3 font-mono">
            MOZAIK NATURAL STONE
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#2C2926] font-normal mb-6">
            Natural Stone for Architecture & Landscape
          </h2>
          <p className="text-base sm:text-lg text-[#7B756C] font-light leading-relaxed max-w-3xl mx-auto mb-8">
            MOZAIK presents a curated collection of Indonesian natural stone and mosaic materials for residential, commercial, architectural and landscape projects.
          </p>
          <div>
            <Link
              to="/collection"
              className="inline-flex items-center text-xs uppercase tracking-[0.2em] px-8 py-3.5 bg-[#2C2926] text-white hover:bg-[#4A4036] font-semibold transition-colors"
            >
              <span>Explore Our Collection</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. PRODUCT CATEGORIES SECTION */}
      <section className="py-24 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-[#8C7A6B] font-semibold block mb-2 font-mono">
              MATERIAL ARCHITECTURE
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#2C2926]">
              Explore Our Stone Collection
            </h2>
          </div>
          <Link
            to="/collection"
            className="mt-4 md:mt-0 inline-flex items-center text-xs uppercase tracking-[0.18em] text-[#2C2926] font-semibold hover:text-[#8C7A6B] transition-colors"
          >
            <span>View All Stone Classifications</span>
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse bg-[#EFECE6] h-80 border border-[#E5DFD5]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((cat) => (
              <div
                key={cat.slug}
                className="group flex flex-col bg-white border border-[#E5DFD5] hover:border-[#8C7A6B] transition-all duration-300 shadow-xs hover:shadow-md overflow-hidden"
              >
                <Link
                  to={`/collection/${cat.slug}`}
                  className="relative aspect-16/10 overflow-hidden bg-[#EFECE6] block"
                >
                  <img
                    src={cat.image}
                    alt={`${cat.name} - MOZAIK Natural Stone`}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1C1A18]/70 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                  <div className="absolute bottom-3 left-4">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#FBF9F5] font-mono">
                      Category
                    </span>
                  </div>
                </Link>

                <div className="p-6 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="font-serif text-xl font-medium text-[#2C2926] group-hover:text-[#4A4036] transition-colors mb-2">
                      <Link to={`/collection/${cat.slug}`}>
                        {cat.name}
                      </Link>
                    </h3>
                    <p className="text-xs text-[#7B756C] line-clamp-3 leading-relaxed mb-6">
                      {cat.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#EFECE6]">
                    <Link
                      to={`/collection/${cat.slug}`}
                      className="inline-flex items-center text-xs uppercase tracking-[0.16em] text-[#2C2926] font-semibold group-hover:text-[#8C7A6B] transition-colors"
                    >
                      <span>View Collection</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1.5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 5. FEATURED PRODUCTS SECTION */}
      <section className="py-24 bg-[#EFECE6] border-y border-[#E5DFD5]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
            <div className="max-w-xl">
              <span className="text-xs uppercase tracking-[0.25em] text-[#8C7A6B] font-semibold block mb-2 font-mono">
                OUR COLLECTION
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#2C2926]">
                Featured Natural Stone Products
              </h2>
              <p className="text-sm text-[#7B756C] mt-3 leading-relaxed">
                Discover our signature natural stones, interlocking pebble mosaics, volcanic pavers, and decorative crazy paving from our active quarries.
              </p>
            </div>
            <div className="mt-6 md:mt-0">
              <Link
                to="/collection"
                className="inline-flex items-center text-xs uppercase tracking-[0.18em] text-[#2C2926] font-semibold hover:text-[#8C7A6B] transition-colors"
              >
                <span>View Full Catalog</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse bg-white h-80 border border-[#E5DFD5]" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.slice(0, 6).map((product) => (
                <ProductCard key={product.id || product.slug} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 6. APPLICATION SECTION */}
      <section className="py-24 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.25em] text-[#8C7A6B] font-semibold block mb-2 font-mono">
            VERSATILE TYPOLOGIES
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#2C2926]">
            Natural Stone for Every Space
          </h2>
          <p className="text-sm text-[#7B756C] mt-3 leading-relaxed">
            From submerged resort pool liners to high-impact exterior facades, our natural materials withstand environmental stresses with organic grace.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {applications.map((app) => (
            <Link
              key={app.title}
              to={`/gallery?filter=${app.title}`}
              className="group relative aspect-4/5 overflow-hidden bg-[#2C2926] block border border-[#D4CCB8]"
            >
              <img
                src={app.image}
                alt={`Natural stone application for ${app.title}`}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108 opacity-80 group-hover:opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C1A18] via-[#1C1A18]/40 to-transparent" />
              <div className="absolute bottom-0 inset-x-0 p-6 text-white">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#D4CCB8] block mb-1 font-mono">
                  Application
                </span>
                <h3 className="font-serif text-xl text-white font-medium group-hover:text-[#D4CCB8] transition-colors flex items-center justify-between">
                  <span>{app.title}</span>
                  <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </h3>
                <p className="text-xs text-[#EFECE6]/80 mt-2 line-clamp-2 leading-relaxed">
                  {app.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 7. GALLERY PREVIEW */}
      <section className="py-24 bg-[#F5F2EB] border-y border-[#E5DFD5]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-[#8C7A6B] font-semibold block mb-2 font-mono">
                INSPIRATION
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#2C2926]">
                Natural Stone Gallery
              </h2>
              <p className="text-sm text-[#7B756C] mt-2 max-w-xl">
                Explore natural stone applications across landscape, architecture and interior spaces.
              </p>
            </div>
            <div className="mt-6 md:mt-0">
              <Link
                to="/gallery"
                className="inline-flex items-center text-xs uppercase tracking-[0.18em] px-6 py-3 border border-[#2C2926] text-[#2C2926] hover:bg-[#2C2926] hover:text-[#FBF9F5] transition-all font-semibold"
              >
                <span>View Full Gallery</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {gallery.slice(0, 6).map((item, idx) => (
              <div
                key={item.id || idx}
                className="group relative aspect-4/3 overflow-hidden bg-[#EFECE6] border border-[#E5DFD5]"
              >
                <img
                  src={item.image}
                  alt={`${item.title} - MOZAIK Natural Stone`}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-106"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1C1A18]/90 via-[#1C1A18]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6 flex flex-col justify-end text-white">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#D4CCB8] font-mono">
                    {item.category}
                  </span>
                  <h3 className="font-serif text-base font-normal mt-1">{item.title}</h3>
                  <p className="text-xs text-[#EFECE6]/80 mt-1 line-clamp-2">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. PROJECT PREVIEW */}
      <section className="py-24 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <div className="max-w-xl">
            <span className="text-xs uppercase tracking-[0.25em] text-[#8C7A6B] font-semibold block mb-2 font-mono">
              OUR PROJECTS
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#2C2926]">
              Natural Stone Projects
            </h2>
            <p className="text-sm text-[#7B756C] mt-2 leading-relaxed">
              Selected landmark developments and private residences engineered with MOZAIK natural stone materials.
            </p>
          </div>
          <div className="mt-6 md:mt-0">
            <Link
              to="/projects"
              className="inline-flex items-center text-xs uppercase tracking-[0.18em] text-[#2C2926] font-semibold hover:text-[#8C7A6B] transition-colors"
            >
              <span>View All Projects</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {projects.slice(0, 3).map((proj) => (
            <div
              key={proj.id || proj.slug}
              className="group flex flex-col bg-[#FFFFFF] border border-[#E5DFD5] hover:border-[#8C7A6B] transition-all duration-300 shadow-xs hover:shadow-md overflow-hidden"
            >
              <div className="relative aspect-16/10 overflow-hidden bg-[#EFECE6]">
                <img
                  src={proj.coverImage}
                  alt={`${proj.name} - MOZAIK Natural Stone Project`}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3">
                  <span className="text-[10px] uppercase tracking-[0.16em] px-2.5 py-1 bg-[#1C1A18]/80 text-white backdrop-blur-xs font-medium">
                    {proj.category}
                  </span>
                </div>
              </div>

              <div className="p-6 flex flex-col flex-1 justify-between">
                <div>
                  <span className="text-[11px] text-[#8C7A6B] tracking-wider block mb-1 font-mono flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    {proj.location} • {proj.year}
                  </span>
                  <h3 className="font-serif text-xl font-medium text-[#2C2926] group-hover:text-[#4A4036] transition-colors mb-3">
                    <Link to={`/projects/${proj.slug}`}>
                      {proj.name}
                    </Link>
                  </h3>
                  <div className="text-[11px] text-[#4A4036] bg-[#FBF9F5] p-2.5 border border-[#EFECE6] mb-4">
                    <span className="font-semibold block uppercase tracking-wider text-[9px] text-[#8C7A6B]">
                      Application / Materials:
                    </span>
                    {proj.productsUsed}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#EFECE6]">
                  <Link
                    to={`/projects/${proj.slug}`}
                    className="inline-flex items-center text-xs uppercase tracking-[0.18em] text-[#2C2926] font-semibold group-hover:text-[#8C7A6B] transition-colors"
                  >
                    <span>View Project</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. WHY MOZAIK SECTION */}
      <section className="py-24 bg-[#EFECE6] border-y border-[#E5DFD5]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-[0.25em] text-[#8C7A6B] font-semibold block mb-2 font-mono">
              THE MOZAIK STANDARD
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#2C2926]">
              Why Choose MOZAIK
            </h2>
            <p className="text-sm text-[#7B756C] mt-2">
              Engineering timeless integrity between geological craft and architectural vision.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {whyMozaik.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="bg-[#FFFFFF] p-6 border border-[#E5DFD5] flex flex-col items-start hover:border-[#8C7A6B] transition-colors"
                >
                  <div className="p-3 bg-[#EFECE6] text-[#2C2926] mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif text-base font-semibold text-[#2C2926] mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#7B756C] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 10. NATURAL SEO CONTENT SECTION */}
      <section className="py-24 max-w-5xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="bg-white border border-[#E5DFD5] p-8 sm:p-12 shadow-xs">
          <span className="text-xs uppercase tracking-[0.25em] text-[#8C7A6B] font-semibold block mb-2 font-mono">
            ARCHITECTURAL KNOWLEDGE
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#2C2926] mb-6">
            Natural Stone Supplier from Indonesia
          </h2>
          <div className="text-xs sm:text-sm text-[#7B756C] leading-relaxed space-y-4 font-normal">
            <p>
              Indonesia boasts some of the world's most versatile and geologically distinct natural stone deposits, formed through millennia of volcanic activity and active river systems. As a dedicated natural stone supplier, MOZAIK curates premium Indonesian natural stone, artisanal mosaic stone, and tumbled river pebbles for sophisticated built environments.
            </p>
            <p>
              Our materials are engineered to perform across diverse architectural disciplines. In landscape applications, durable volcanic andesite pavers, textured stepping stones, and decorative gravel provide permeable, weather-resilient surfaces for gardens, courtyards, and open-air terraces. In architectural and interior applications, calibrated honed basalt slabs and organic pebble mosaics bring tactile depth to feature walls, bathroom sanctuaries, and spa wellness suites. Furthermore, our world-renowned Bali Sukabumi green quartzite has become a benchmark for luxury resort swimming pools, naturally purifying water while radiating crystal-clear jade hues.
            </p>
            <p>
              From bespoke custom mosaic patterns tailored for hospitality landmarks to high-density stone paving specified for heavy-traffic commercial plazas and public promenades, MOZAIK bridges geological craftsmanship with contemporary design standards. Every quarry extraction is rigorously tested for compressive strength, slip resistance, and dimensional uniformity to ensure lasting aesthetic and structural permanence.
            </p>
          </div>
        </div>
      </section>

      {/* 11. FINAL CTA SECTION */}
      <section className="py-24 bg-[#2C2926] text-[#FBF9F5] border-t border-[#1C1A18]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="text-xs uppercase tracking-[0.28em] text-[#D4CCB8] block mb-3 font-mono">
            PARTNER WITH MOZAIK
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-normal text-white mb-6">
            Let's Create Something Beautiful Together
          </h2>
          <p className="text-sm sm:text-base text-[#D4CCB8]/90 max-w-xl mx-auto leading-relaxed mb-10 font-light">
            Tell us about your project and discover the right natural stone solution for your space.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/contact?type=quote"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-[#FBF9F5] text-[#1C1A18] hover:bg-[#D4CCB8] text-xs uppercase tracking-[0.2em] font-semibold transition-all"
            >
              <span>Request a Quote</span>
              <ArrowUpRight className="w-4 h-4 ml-2" />
            </Link>
            <a
              href="https://wa.me/6281288880919?text=Hello%20MOZAIK%20team%2C%20I%20have%20an%20architectural%20project%20and%20would%20like%20to%20consult%20about%20natural%20stone."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border border-[#D4CCB8]/60 text-white hover:bg-white/10 text-xs uppercase tracking-[0.2em] font-medium transition-all"
            >
              <MessageSquare className="w-4 h-4 mr-2 text-[#D4CCB8]" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
