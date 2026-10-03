import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, MapPin, Calendar, Plus, ArrowUpRight, MessageSquare } from 'lucide-react';
import { SEO } from '../components/SEO';
import { Project } from '../types';
import { getProjects } from '../services/db';
import { useQuoteModal } from '../context/QuoteModalContext';

export const Projects: React.FC = () => {
  const { openQuoteModal } = useQuoteModal();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const activeCategory = searchParams.get('category') || 'All';

  const categories = [
    'All',
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
    async function loadProjects() {
      try {
        const data = await getProjects();
        setProjects(data);
      } catch (err) {
        console.error("Projects load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProjects();
  }, []);

  const handleCategoryClick = (cat: string) => {
    if (cat === 'All') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: cat });
    }
  };

  const filteredProjects = projects.filter((p) => {
    if (activeCategory === 'All') return true;
    return p.category.toLowerCase() === activeCategory.toLowerCase();
  });

  return (
    <div className="bg-[#FBF9F5] min-h-screen">
      <SEO
        title="Natural Stone Projects | Architectural Portfolio | MOZAIK"
        description="Explore selected residential, commercial, landscape and architectural projects using MOZAIK natural stone materials."
        canonicalUrl="/projects"
        keywords="natural stone projects, bali villa stone, architectural stone portfolio, resort pool stone, andesite paving project"
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Projects", url: "/projects" }
        ]}
      />

      {/* Header Banner - Exactly as specified in Requirement 8 */}
      <section className="bg-[#1C1A18] text-white py-20 px-6 sm:px-8 lg:px-12 border-b border-[#2C2926]">
        <div className="max-w-7xl mx-auto">
          <nav className="text-xs uppercase tracking-[0.2em] text-[#D4CCB8] mb-4 flex items-center space-x-2 font-mono">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white">Projects</span>
          </nav>

          <span className="text-xs uppercase tracking-[0.3em] text-[#D4CCB8] font-semibold block mb-2 font-mono">
            OUR PROJECTS
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-normal text-[#FBF9F5]">
            Natural Stone Projects
          </h1>
          <p className="text-sm sm:text-base text-[#D4CCB8]/90 max-w-2xl mt-4 leading-relaxed font-light">
            Explore selected residential, commercial, landscape and architectural projects using MOZAIK natural stone materials.
          </p>
        </div>
      </section>

      {/* Category Filter Bar */}
      <section className="sticky top-20 z-30 bg-[#FBF9F5]/95 backdrop-blur-md border-b border-[#E5DFD5] py-4 px-6 sm:px-8 lg:px-12 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center overflow-x-auto gap-2 no-scrollbar">
          {categories.map((cat) => {
            const isSelected = activeCategory.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className={`text-xs uppercase tracking-[0.16em] px-4 py-2 transition-all cursor-pointer shrink-0 ${
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

      {/* Projects List Grid */}
      <section className="py-16 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-[#EFECE6] h-96 border border-[#E5DFD5]" />
            ))}
          </div>
        ) : projects.length === 0 ? (
          /* Empty State - Requirement 19 */
          <div className="py-24 text-center bg-white border border-[#E5DFD5] p-12 max-w-md mx-auto space-y-4">
            <h3 className="font-serif text-2xl text-[#2C2926]">No projects yet.</h3>
            <p className="text-xs text-[#7B756C]">
              New architectural portfolios are being added directly from verified project locations.
            </p>
            <Link
              to="/admin/projects/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#2C2926] text-white hover:bg-[#4A4036] text-xs uppercase tracking-[0.16em] font-semibold transition-all mt-2"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Your First Project</span>
            </Link>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="py-20 text-center bg-white border border-[#E5DFD5] p-12">
            <h3 className="font-serif text-xl text-[#2C2926] mb-2">No projects found in "{activeCategory}"</h3>
            <p className="text-xs text-[#7B756C] mb-6">
              Explore our other typologies or view our complete architectural stone collection.
            </p>
            <button
              onClick={() => handleCategoryClick('All')}
              className="text-xs uppercase tracking-[0.18em] px-6 py-2.5 bg-[#2C2926] text-white hover:bg-[#4A4036] cursor-pointer font-semibold"
            >
              Show All Projects
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <div
                key={project.id || project.slug}
                className="group flex flex-col bg-white border border-[#E5DFD5] hover:border-[#8C7A6B] transition-all duration-300 shadow-xs hover:shadow-md overflow-hidden"
              >
                {/* Cover Image */}
                <Link
                  to={`/projects/${project.slug}`}
                  className="relative aspect-16/10 overflow-hidden bg-[#EFECE6] block"
                >
                  <img
                    src={project.coverImage}
                    alt={`${project.name} - MOZAIK Natural Stone Project`}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] uppercase tracking-[0.16em] px-2.5 py-1 bg-[#1C1A18]/85 text-white backdrop-blur-xs font-medium">
                      {project.category}
                    </span>
                  </div>
                </Link>

                {/* Project Details */}
                <div className="p-6 flex flex-col flex-1 justify-between">
                  <div>
                    <div className="flex items-center text-[11px] text-[#8C7A6B] tracking-wider mb-2 font-mono space-x-3">
                      <span className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {project.location}
                      </span>
                      <span>•</span>
                      <span className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {project.year}
                      </span>
                    </div>

                    <h3 className="font-serif text-xl font-medium text-[#2C2926] group-hover:text-[#4A4036] transition-colors mb-2">
                      <Link to={`/projects/${project.slug}`}>
                        {project.name}
                      </Link>
                    </h3>

                    <p className="text-xs text-[#7B756C] line-clamp-3 leading-relaxed mb-4">
                      {project.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#EFECE6] flex items-center justify-between">
                    <span className="text-[11px] text-[#8C7A6B] font-mono">
                      {project.category}
                    </span>
                    <Link
                      to={`/projects/${project.slug}`}
                      className="inline-flex items-center text-xs uppercase tracking-[0.16em] text-[#2C2926] font-semibold group-hover:text-[#8C7A6B] transition-colors"
                    >
                      <span>View Project</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1.5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Project Inquiry CTA Banner - Step 6 Requirement */}
        <div className="mt-16 bg-[#2C2926] text-[#FBF9F5] p-8 sm:p-12 border border-[#1C1A18] shadow-xs flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl">
            <span className="text-xs uppercase tracking-[0.25em] text-[#D4CCB8] block mb-2 font-mono">
              COLLABORATIVE ARCHITECTURE
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-normal text-white">
              Planning a Residential Villa, Resort or Commercial Masterplan?
            </h3>
            <p className="text-xs sm:text-sm text-[#D4CCB8]/80 mt-2 font-light leading-relaxed">
              Our engineering team assists architects and landscape masters with material schedules, slip-resistance certifications, and direct quarry fabrication.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
            <button
              onClick={() => openQuoteModal(null, 'projects')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#FBF9F5] text-[#1C1A18] hover:bg-[#D4CCB8] text-xs uppercase tracking-[0.18em] font-semibold transition-all shadow-xs cursor-pointer"
            >
              <span>GET A QUOTE</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
            <a
              href="https://wa.me/6281288880919?text=Hello%20MOZAIK%2C%20I%20am%20planning%20a%20project%20and%20would%20like%20to%20consult%20on%20natural%20stone%20specifications."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-[#D4CCB8]/60 text-white hover:bg-white/10 text-xs uppercase tracking-[0.18em] font-medium transition-all"
            >
              <MessageSquare className="w-4 h-4 text-[#D4CCB8]" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
