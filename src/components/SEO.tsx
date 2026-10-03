import React, { useEffect, useState } from 'react';
import { getSettings } from '../services/db';
import { SiteSettings } from '../types';

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface ProductSchemaData {
  name: string;
  description: string;
  image: string;
  category: string;
  material?: string;
  availability?: string;
}

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  breadcrumbs?: BreadcrumbItem[];
  productData?: ProductSchemaData;
  noIndex?: boolean;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  canonicalUrl,
  ogImage = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
  ogType = 'website',
  breadcrumbs,
  productData,
  noIndex = false
}) => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    let isMounted = true;
    getSettings().then((s) => {
      if (isMounted) setSettings(s);
    }).catch(console.warn);
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    // 1. Resolve Document Title (Branded and distinctive)
    const formattedTitle = title.includes('MOZAIK') ? title : `${title} | MOZAIK`;
    document.title = formattedTitle;

    // 2. Helper to set or create meta elements in <head>
    const setMetaTag = (attribute: string, attributeValue: string, content: string) => {
      if (!content) return;
      let element = document.querySelector(`meta[${attribute}="${attributeValue}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, attributeValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Description & Keywords
    setMetaTag('name', 'description', description);
    if (keywords) {
      setMetaTag('name', 'keywords', keywords);
    }

    // Robots: Noindex for admin/login, index/follow for public indexable pages
    if (noIndex) {
      setMetaTag('name', 'robots', 'noindex, nofollow');
    } else {
      setMetaTag('name', 'robots', 'index, follow');
    }

    // Google Site Verification (GSC Preparation - Requirement 25)
    const verificationCode = settings?.googleSiteVerification?.trim();
    if (verificationCode) {
      setMetaTag('name', 'google-site-verification', verificationCode);
    }

    // Determine Canonical Base URL (Requirement 11)
    const baseUrl = (settings?.siteUrl || (typeof window !== 'undefined' ? window.location.origin : 'https://mozaikstone.com')).replace(/\/$/, '');
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
    const resolvedCanonical = canonicalUrl
      ? (canonicalUrl.startsWith('http') ? canonicalUrl : `${baseUrl}${canonicalUrl.startsWith('/') ? '' : '/'}${canonicalUrl}`)
      : `${baseUrl}${currentPath}`;

    // Canonical link tag
    let canonicalTag = document.querySelector('link[rel="canonical"]');
    if (!canonicalTag) {
      canonicalTag = document.createElement('link');
      canonicalTag.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalTag);
    }
    canonicalTag.setAttribute('href', resolvedCanonical);

    // OpenGraph Tags (Requirement 20)
    setMetaTag('property', 'og:title', formattedTitle);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:image', ogImage);
    setMetaTag('property', 'og:url', resolvedCanonical);
    setMetaTag('property', 'og:type', ogType);
    setMetaTag('property', 'og:site_name', 'MOZAIK Natural Stone Collection');

    // Twitter Card Tags (Requirement 21)
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', formattedTitle);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', ogImage);

    // 3. Inject Structured Data (JSON-LD)
    const addJsonLd = (data: object, id: string) => {
      let script = document.getElementById(id) as HTMLScriptElement | null;
      if (!script) {
        script = document.createElement('script');
        script.id = id;
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.text = JSON.stringify(data);
    };

    // Organization Schema (Requirement 7 - using real Firestore settings)
    const orgSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": settings?.companyName || "MOZAIK Natural Stone Collection",
      "alternateName": "MOZAIK",
      "url": baseUrl,
      "logo": `${baseUrl}/logo.png`,
      "description": settings?.defaultSeoDescription || "Premium natural stone, mosaic stone, pebble, and architectural decorative stone supplier from Indonesia.",
      "telephone": settings?.whatsappNumber || settings?.whatsapp || settings?.phone || "+62-812-8888-0919",
      "email": settings?.email || "info@mozaikstone.com",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": settings?.address || "Sentra Industri Batu Alam & Arsitektur Nusantara, Jl. Sunset Road No. 88",
        "addressLocality": "Bali & Jakarta",
        "addressCountry": "ID"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": settings?.whatsappNumber || settings?.whatsapp || "+62-812-8888-0919",
        "contactType": "Sales & Architectural Support",
        "areaServed": ["ID", "Worldwide"],
        "availableLanguage": ["English", "Indonesian"]
      }
    };
    addJsonLd(orgSchema, 'jsonld-org');

    // Website Schema (Requirement 8)
    const websiteSchema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "MOZAIK",
      "url": baseUrl,
      "description": "Natural Stone, Mosaic Stone, Pebble and Decorative Stone from Indonesia",
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${baseUrl}/collection?search={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    };
    addJsonLd(websiteSchema, 'jsonld-website');

    // Breadcrumbs Schema (Requirement 9)
    if (breadcrumbs && breadcrumbs.length > 0) {
      const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumbs.map((b, idx) => ({
          "@type": "ListItem",
          "position": idx + 1,
          "name": b.name,
          "item": b.url.startsWith('http') ? b.url : `${baseUrl}${b.url.startsWith('/') ? '' : '/'}${b.url}`
        }))
      };
      addJsonLd(breadcrumbSchema, 'jsonld-breadcrumbs');
    }

    // Product Schema (Requirement 6 - strictly verified data, NO fake price, reviews, or ratings)
    if (productData) {
      const productSchema: Record<string, any> = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": productData.name,
        "image": productData.image,
        "description": productData.description,
        "category": productData.category,
        "brand": {
          "@type": "Brand",
          "name": "MOZAIK"
        }
      };

      if (productData.material) {
        productSchema.material = productData.material;
      }

      addJsonLd(productSchema, 'jsonld-product');
    }

    return () => {
      // Clean up dynamic schemas on unmount
      const bc = document.getElementById('jsonld-breadcrumbs');
      if (bc) bc.remove();
      const pr = document.getElementById('jsonld-product');
      if (pr) pr.remove();
    };
  }, [title, description, keywords, canonicalUrl, ogImage, ogType, breadcrumbs, productData, noIndex, settings]);

  return null;
};
