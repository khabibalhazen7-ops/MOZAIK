import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { SEO } from '../components/SEO';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-6 py-24 text-center bg-[#FBF9F5]">
      <SEO
        title="Page Not Found | MOZAIK"
        description="The page you're looking for could not be found."
        noIndex={true}
      />
      <div className="max-w-lg bg-white border border-[#E5DFD5] p-10 sm:p-12 shadow-xs space-y-6">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-[#8C7A6B] font-mono font-semibold block mb-2">
            ERROR 404
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#2C2926]">
            Page Not Found
          </h1>
          <p className="text-xs sm:text-sm text-[#7B756C] leading-relaxed mt-3 max-w-sm mx-auto font-light">
            The page you're looking for could not be found. It may have been moved, renamed, or is temporarily unavailable.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#2C2926] hover:bg-[#4A4036] text-white text-xs uppercase tracking-[0.16em] font-semibold transition-all shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          <Link
            to="/collection"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 border border-[#E5DFD5] text-[#2C2926] hover:bg-[#FBF9F5] text-xs uppercase tracking-[0.16em] font-semibold transition-all"
          >
            <span>Explore Collection</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
