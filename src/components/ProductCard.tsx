import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  // Build clean short specification string from available fields
  const specParts = [
    product.material,
    product.finish,
    product.size
  ].filter(Boolean);
  const shortSpec = specParts.slice(0, 2).join(' · ');

  return (
    <article className="group flex flex-col bg-white border border-[#E5DFD5] hover:border-[#8C7A6B] transition-all duration-300 shadow-xs hover:shadow-md overflow-hidden">
      {/* Product Image Container */}
      <Link
        to={`/products/${product.slug}`}
        className="relative aspect-4/3 overflow-hidden bg-[#EFECE6] block"
        aria-label={`View ${product.name}`}
      >
        <img
          src={product.mainImage}
          alt={`${product.name} - MOZAIK Natural Stone`}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        {/* Subtle Category Marker */}
        <div className="absolute top-2.5 left-2.5">
          <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] px-2 py-0.5 sm:px-2.5 sm:py-1 bg-[#1C1A18]/85 text-[#FBF9F5] backdrop-blur-xs font-medium">
            {product.category}
          </span>
        </div>
        {product.featured && (
          <div className="absolute top-2.5 right-2.5">
            <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.2em] px-2 py-0.5 bg-[#4A4036] text-[#FBF9F5] font-medium">
              Featured
            </span>
          </div>
        )}
      </Link>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
        <div>
          {/* Category / Sub-brand line */}
          <div className="text-[10px] sm:text-[11px] uppercase tracking-[0.18em] text-[#8C7A6B] font-mono mb-1 truncate">
            {product.category}
          </div>

          {/* Product Title */}
          <h3 className="font-serif text-base sm:text-lg text-[#2C2926] font-medium group-hover:text-[#4A4036] transition-colors line-clamp-1 mb-1.5">
            <Link to={`/products/${product.slug}`}>
              {product.name}
            </Link>
          </h3>

          {/* Short specification if available */}
          {shortSpec && (
            <p className="text-[11px] sm:text-xs text-[#7B756C] font-mono line-clamp-1 mb-2">
              {shortSpec}
            </p>
          )}

          {/* Short description */}
          {product.shortDescription && (
            <p className="text-[11px] sm:text-xs text-[#7B756C] line-clamp-2 leading-relaxed mb-3 hidden sm:block">
              {product.shortDescription}
            </p>
          )}
        </div>

        {/* Card Footer */}
        <div className="pt-3 border-t border-[#EFECE6] flex items-center justify-between text-xs">
          <span className="text-[10px] sm:text-[11px] text-[#4A4036] font-medium tracking-wide truncate max-w-[60%]">
            {product.availability || 'In Stock'}
          </span>
          <Link
            to={`/products/${product.slug}`}
            className="inline-flex items-center text-[10px] sm:text-xs uppercase tracking-[0.16em] text-[#2C2926] font-semibold group-hover:text-[#8C7A6B] transition-colors whitespace-nowrap"
          >
            <span>View Product</span>
            <ArrowUpRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </article>
  );
};
