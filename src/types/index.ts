export interface ProductGalleryImage {
  url: string;
  alt: string;
  order: number;
}

export interface Product {
  id?: string;
  name: string;
  slug: string;
  categoryId?: string;
  category: string;
  shortDescription: string;
  description: string;
  material: string;
  color: string;
  size: string;
  finish: string;
  applications: string[];
  minimumOrder: string;
  availability: string;
  featured: boolean;
  mainImage: string;
  galleryImages: (string | ProductGalleryImage)[];
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id?: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  seoTitle?: string;
  seoDescription?: string;
  featured?: boolean;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface GalleryItem {
  id?: string;
  title: string;
  slug?: string;
  category: string;
  description: string;
  imageUrl: string;
  image?: string; // fallback compatibility
  altText: string;
  featured: boolean;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProjectGalleryImage {
  url: string;
  alt: string;
  order: number;
}

export interface Project {
  id?: string;
  name: string;
  slug: string;
  location: string;
  country?: string;
  year: string;
  category: string;
  client?: string;
  architect?: string;
  description: string;
  productsUsed: string | string[];
  application?: string;
  featured: boolean;
  coverImage: string;
  galleryImages: (string | ProjectGalleryImage)[];
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type InquiryStatus = 'new' | 'contacted' | 'quoted' | 'won' | 'closed' | 'New' | 'Contacted' | 'Quoted' | 'Won' | 'Closed';

export interface Inquiry {
  id?: string;
  name: string;
  company?: string;
  email: string;
  phone: string;
  country?: string;
  projectType: string;
  productId?: string;
  productName?: string;
  productInterest?: string;
  estimatedQuantity?: string;
  projectLocation?: string;
  message: string;
  sourcePage?: string;
  status: InquiryStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface SiteSettings {
  id?: string;
  siteName?: string;
  companyName?: string;
  tagline?: string;
  subBrand?: string;
  email: string;
  whatsapp?: string;
  whatsappNumber?: string;
  phone?: string;
  address: string;
  businessHours: string;
  siteUrl?: string;
  defaultSeoTitle?: string;
  defaultSeoDescription?: string;
  defaultSeoKeywords?: string;
  googleSiteVerification?: string;
  updatedAt?: string;
}
