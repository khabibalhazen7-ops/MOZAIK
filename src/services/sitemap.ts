import { getProducts, getCategories, getProjects, getSettings } from './db';
import { initialProducts, initialCategories, initialProjects, initialSettings } from './seedData';

export interface SitemapEntry {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: string;
}

export async function generateSitemapXml(customBaseUrl?: string): Promise<string> {
  let settings = null;
  try {
    settings = await getSettings();
  } catch (err) {
    settings = initialSettings;
  }

  const baseUrl = (customBaseUrl || settings?.siteUrl || 'https://mozaikstone.com').replace(/\/$/, '');
  const now = new Date().toISOString().slice(0, 10);

  let products = [];
  let categories = [];
  let projects = [];

  try {
    const [p, c, pr] = await Promise.all([
      getProducts(),
      getCategories(),
      getProjects()
    ]);
    products = p.length > 0 ? p : initialProducts;
    categories = c.length > 0 ? c : initialCategories;
    projects = pr.length > 0 ? pr : initialProjects;
  } catch (e) {
    products = initialProducts;
    categories = initialCategories;
    projects = initialProjects;
  }

  const entries: SitemapEntry[] = [
    { loc: `${baseUrl}/`, lastmod: now, changefreq: 'daily', priority: '1.0' },
    { loc: `${baseUrl}/collection`, lastmod: now, changefreq: 'daily', priority: '0.9' },
    { loc: `${baseUrl}/gallery`, lastmod: now, changefreq: 'weekly', priority: '0.8' },
    { loc: `${baseUrl}/projects`, lastmod: now, changefreq: 'weekly', priority: '0.8' },
    { loc: `${baseUrl}/about`, lastmod: now, changefreq: 'monthly', priority: '0.6' },
    { loc: `${baseUrl}/contact`, lastmod: now, changefreq: 'monthly', priority: '0.7' }
  ];

  // Dynamic Categories
  categories.forEach((cat) => {
    entries.push({
      loc: `${baseUrl}/collection/${cat.slug}`,
      lastmod: cat.updatedAt ? cat.updatedAt.slice(0, 10) : now,
      changefreq: 'weekly',
      priority: '0.8'
    });
  });

  // Dynamic Products
  products.forEach((prod) => {
    entries.push({
      loc: `${baseUrl}/products/${prod.slug}`,
      lastmod: prod.updatedAt ? prod.updatedAt.slice(0, 10) : now,
      changefreq: 'weekly',
      priority: '0.8'
    });
  });

  // Dynamic Projects
  projects.forEach((proj) => {
    entries.push({
      loc: `${baseUrl}/projects/${proj.slug}`,
      lastmod: proj.updatedAt ? proj.updatedAt.slice(0, 10) : now,
      changefreq: 'monthly',
      priority: '0.7'
    });
  });

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  entries.forEach((entry) => {
    xml += '  <url>\n';
    xml += `    <loc>${entry.loc}</loc>\n`;
    if (entry.lastmod) xml += `    <lastmod>${entry.lastmod}</lastmod>\n`;
    if (entry.changefreq) xml += `    <changefreq>${entry.changefreq}</changefreq>\n`;
    if (entry.priority) xml += `    <priority>${entry.priority}</priority>\n`;
    xml += '  </url>\n';
  });
  xml += '</urlset>';

  return xml;
}

export function generateRobotsTxt(customBaseUrl?: string): string {
  const baseUrl = (customBaseUrl || 'https://mozaikstone.com').replace(/\/$/, '');
  return `User-agent: *
Allow: /

Disallow: /admin
Disallow: /admin/*
Disallow: /login

Sitemap: ${baseUrl}/sitemap.xml
`;
}
