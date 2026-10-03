import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ShieldCheck, Mountain, Compass, Sparkles } from 'lucide-react';
import { SEO } from '../components/SEO';

export const About: React.FC = () => {
  return (
    <div className="bg-[#FBF9F5] min-h-screen">
      <SEO
        title="About MOZAIK | Natural Stone Collection"
        description="MOZAIK curates and refines premium Indonesian natural stone, pebble mosaics, and architectural pavers for architects, landscape masters, and timeless residential sanctuaries."
        canonicalUrl="/about"
        keywords="about mozaik stone, natural stone brand indonesia, volcanic stone supplier, pebble mosaic artisans"
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "About", url: "/about" }
        ]}
      />

      {/* Hero Banner */}
      <section className="bg-[#1C1A18] text-white py-24 px-6 sm:px-8 lg:px-12 border-b border-[#2C2926]">
        <div className="max-w-7xl mx-auto">
          <nav className="text-xs uppercase tracking-[0.2em] text-[#D4CCB8] mb-4 flex items-center space-x-2 font-mono">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white">About</span>
          </nav>

          <span className="text-xs uppercase tracking-[0.3em] text-[#D4CCB8] font-semibold block mb-2">
            The Philosophy of Stone
          </span>
          <h1 className="font-serif text-3xl sm:text-6xl font-normal text-[#FBF9F5] max-w-4xl">
            About MOZAIK
          </h1>
          <p className="text-base sm:text-xl text-[#D4CCB8] max-w-3xl mt-4 font-light leading-relaxed">
            MOZAIK was founded on a singular conviction: that natural stone carries an elemental truth and tactile permanence that synthetic surfaces can never replicate.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-24 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs uppercase tracking-[0.25em] text-[#8C7A6B] font-semibold block">
              Section 01 • Genesis
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#2C2926]">
              Our Story
            </h2>
            <p className="text-sm sm:text-base text-[#7B756C] leading-relaxed">
              Formed across millennia by volcanic forces, glacial river currents, and sedimented minerals, the archipelago of Indonesia holds some of the world's most expressive and structurally robust stone deposits.
            </p>
            <p className="text-sm sm:text-base text-[#7B756C] leading-relaxed">
              MOZAIK was established to bridge these ancient geology reserves directly with the international architecture community. Rather than treating stone as a commodity, we collaborate closely with master stonemasons, calibrating thicknesses, hand-sorting color nuances, and pioneering precision-mesh mosaics that streamline on-site installation.
            </p>
            <div className="pt-4 grid grid-cols-3 gap-6 border-t border-[#E5DFD5]">
              <div>
                <span className="font-serif text-3xl font-medium text-[#2C2926] block">15+</span>
                <span className="text-[11px] text-[#8C7A6B] uppercase tracking-wider font-mono">Quarry Sources</span>
              </div>
              <div>
                <span className="font-serif text-3xl font-medium text-[#2C2926] block">120k+</span>
                <span className="text-[11px] text-[#8C7A6B] uppercase tracking-wider font-mono">m² Supplied</span>
              </div>
              <div>
                <span className="font-serif text-3xl font-medium text-[#2C2926] block">100%</span>
                <span className="text-[11px] text-[#8C7A6B] uppercase tracking-wider font-mono">Natural Material</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative aspect-4/3 bg-[#EFECE6] border border-[#E5DFD5] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
                alt="MOZAIK Quarry Craftsmanship"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Materials */}
      <section className="py-24 bg-[#EFECE6] border-y border-[#E5DFD5]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-[0.25em] text-[#8C7A6B] font-semibold">
              Section 02 • Geology
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#2C2926] mt-2">
              Our Materials
            </h2>
            <p className="text-sm text-[#7B756C] mt-2">
              Each stone line is chosen for specific geological, structural, and aesthetic criteria.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 border border-[#D4CCB8]">
              <Mountain className="w-6 h-6 text-[#2C2926] mb-4" />
              <h3 className="font-serif text-xl text-[#2C2926] mb-2">Volcanic Andesite & Basalt</h3>
              <p className="text-xs text-[#7B756C] leading-relaxed">
                Extracted from Java's volcanic belts, our andesite and basalt feature remarkable compressive density, low porosity, and thermal shock resistance suitable for heavy paving and severe weathering.
              </p>
            </div>

            <div className="bg-white p-8 border border-[#D4CCB8]">
              <Sparkles className="w-6 h-6 text-[#2C2926] mb-4" />
              <h3 className="font-serif text-xl text-[#2C2926] mb-2">Sukabumi Green Quartzite</h3>
              <p className="text-xs text-[#7B756C] leading-relaxed">
                A gemstone-like pool tile mineral known worldwide for natural zeolite content that purifies pool water while radiating deep jade and turquoise reflections under sunlight.
              </p>
            </div>

            <div className="bg-white p-8 border border-[#D4CCB8]">
              <Compass className="w-6 h-6 text-[#2C2926] mb-4" />
              <h3 className="font-serif text-xl text-[#2C2926] mb-2">River & Marine Pebbles</h3>
              <p className="text-xs text-[#7B756C] leading-relaxed">
                Tumbled by nature to gentle rounded forms. We sort by millimeter-precise grades to create tactile barefoot pebble mosaics and permeable Japanese zen landscape beds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Quality */}
      <section className="py-24 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className="relative aspect-4/3 bg-[#EFECE6] border border-[#E5DFD5] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1200&q=80"
                alt="Precision Stone Quality"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="lg:col-span-6 order-1 lg:order-2 space-y-6">
            <span className="text-xs uppercase tracking-[0.25em] text-[#8C7A6B] font-semibold block">
              Section 03 • Standards
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#2C2926]">
              Our Quality
            </h2>
            <p className="text-sm sm:text-base text-[#7B756C] leading-relaxed">
              In architectural natural stone, precision in calibration and color sorting determines the difference between an ordinary job and a flawless monument.
            </p>
            <ul className="space-y-4 text-xs sm:text-sm text-[#7B756C]">
              <li className="flex items-start">
                <ShieldCheck className="w-5 h-5 text-[#2C2926] shrink-0 mr-3 mt-0.5" />
                <span><strong>Calibrated Tolerances:</strong> Strict thickness standards (±1mm) to minimize adhesive bedding discrepancies and prevent lippage.</span>
              </li>
              <li className="flex items-start">
                <ShieldCheck className="w-5 h-5 text-[#2C2926] shrink-0 mr-3 mt-0.5" />
                <span><strong>Color Harmonization:</strong> Pre-sorting into shade batches so large facade expanses transition with natural aesthetic coherence.</span>
              </li>
              <li className="flex items-start">
                <ShieldCheck className="w-5 h-5 text-[#2C2926] shrink-0 mr-3 mt-0.5" />
                <span><strong>Reinforced Mesh Mounting:</strong> Alkaline-resistant fiberglass mesh backing engineered for wet-area bond strength.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Our Applications */}
      <section className="py-24 bg-[#1C1A18] text-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
          <span className="text-xs uppercase tracking-[0.28em] text-[#D4CCB8] block mb-2 font-mono">
            Section 04 • Versatility
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-white mb-6">
            Our Applications
          </h2>
          <p className="text-sm sm:text-base text-[#D4CCB8]/80 max-w-2xl mx-auto leading-relaxed mb-12">
            Tailored specifications engineered for landscape architecture, luxury swimming pools, interior wellness sanctuaries, exterior facades, and public civic plazas.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/collection"
              className="inline-flex items-center text-xs uppercase tracking-[0.2em] px-8 py-4 bg-[#FBF9F5] text-[#1C1A18] hover:bg-[#D4CCB8] font-semibold transition-all"
            >
              <span>Explore Materials</span>
              <ArrowUpRight className="w-4 h-4 ml-2" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center text-xs uppercase tracking-[0.2em] px-8 py-4 border border-[#4A4036] text-white hover:bg-white/10 font-medium transition-all"
            >
              <span>Contact Architectural Team</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
