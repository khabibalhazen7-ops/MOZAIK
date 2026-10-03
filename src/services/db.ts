import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where
} from 'firebase/firestore';
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject
} from 'firebase/storage';
import { db, storage, handleFirestoreError, OperationType } from '../firebase';
import { Product, Category, GalleryItem, Project, Inquiry, SiteSettings } from '../types';
import {
  initialCategories,
  initialProducts,
  initialGallery,
  initialProjects,
  initialSettings,
  initialInquiries
} from './seedData';

const PRODUCTS_COL = 'products';
const CATEGORIES_COL = 'categories';
const GALLERY_COL = 'gallery';
const PROJECTS_COL = 'projects';
const INQUIRIES_COL = 'inquiries';
const SETTINGS_COL = 'settings';

let isSeedingInProgress = false;

// ---------------- PRODUCTS ----------------
export async function getProducts(): Promise<Product[]> {
  try {
    const colRef = collection(db, PRODUCTS_COL);
    const snap = await getDocs(colRef);
    if (snap.empty) {
      await seedInitialData();
      const freshSnap = await getDocs(colRef);
      return freshSnap.docs.map(d => ({ id: d.id, ...d.data() } as Product));
    }
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Product));
  } catch (err) {
    console.warn("Falling back to local cache while connecting to Firestore:", err);
    return initialProducts;
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const docRef = doc(db, PRODUCTS_COL, id);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() } as Product;
    }
    return await getProductBySlug(id);
  } catch (err) {
    console.warn("getProductById notice:", err);
    return await getProductBySlug(id);
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const colRef = collection(db, PRODUCTS_COL);
    const q = query(colRef, where('slug', '==', slug));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const docItem = snap.docs[0];
      return { id: docItem.id, ...docItem.data() } as Product;
    }
    const fallback = initialProducts.find(p => p.slug === slug);
    return fallback || null;
  } catch (err) {
    console.warn("Product slug fetch error:", err);
    return initialProducts.find(p => p.slug === slug) || null;
  }
}

export async function getProductsByCategoryId(categoryId: string, categoryName?: string): Promise<Product[]> {
  try {
    const allProds = await getProducts();
    const targetSlug = categoryId.toLowerCase();
    const targetName = categoryName?.toLowerCase() || '';

    return allProds.filter((p) => {
      const pCatId = (p.categoryId || '').toLowerCase();
      const pCatName = (p.category || '').toLowerCase();
      const pCatSlug = pCatName.replace(/\s+/g, '-');

      return (
        pCatId === targetSlug ||
        pCatSlug === targetSlug ||
        (targetName && pCatName === targetName) ||
        (targetSlug === 'pebble' && (pCatId === 'pebble-stone' || pCatSlug === 'pebble-stone' || pCatName.includes('pebble'))) ||
        (targetSlug === 'pebble-stone' && (pCatId === 'pebble' || pCatSlug === 'pebble'))
      );
    });
  } catch (err) {
    console.warn("getProductsByCategoryId error:", err);
    return [];
  }
}

export async function saveProduct(product: Omit<Product, 'id'>, id?: string): Promise<string> {
  try {
    const payload = {
      ...product,
      updatedAt: new Date().toISOString()
    };
    if (id) {
      const docRef = doc(db, PRODUCTS_COL, id);
      await updateDoc(docRef, payload);
      return id;
    } else {
      const colRef = collection(db, PRODUCTS_COL);
      const res = await addDoc(colRef, {
        ...payload,
        createdAt: new Date().toISOString()
      });
      return res.id;
    }
  } catch (err) {
    handleFirestoreError(err, id ? OperationType.UPDATE : OperationType.CREATE, PRODUCTS_COL);
  }
}

export async function deleteProduct(id: string, productData?: Product): Promise<void> {
  try {
    if (productData) {
      if (productData.mainImage && productData.mainImage.includes('firebasestorage')) {
        try {
          const mainRef = ref(storage, productData.mainImage);
          await deleteObject(mainRef);
        } catch (e) {
          // ignore
        }
      }
      if (productData.galleryImages) {
        for (const item of productData.galleryImages) {
          const url = typeof item === 'string' ? item : item.url;
          if (url && url.includes('firebasestorage')) {
            try {
              const itemRef = ref(storage, url);
              await deleteObject(itemRef);
            } catch (e) {
              // ignore
            }
          }
        }
      }
    }

    const docRef = doc(db, PRODUCTS_COL, id);
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${PRODUCTS_COL}/${id}`);
  }
}

// ---------------- FIREBASE STORAGE UPLOADERS ----------------
function validateImageFile(file: File) {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!validTypes.includes(file.type.toLowerCase())) {
    throw new Error('Invalid image format. Supported formats: JPG, JPEG, PNG, WEBP.');
  }
  const maxBytes = 10 * 1024 * 1024;
  if (file.size > maxBytes) {
    throw new Error('File size exceeds the 10 MB limit. Please select a smaller image.');
  }
}

export async function uploadProductImage(
  file: File,
  productId: string,
  type: 'main' | 'gallery' = 'main',
  onProgress?: (progress: number) => void
): Promise<string> {
  validateImageFile(file);
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
  const safeId = productId || 'temp_' + Date.now();
  const filePath = `products/${safeId}/${type}/${Date.now()}_${sanitizedName}`;

  return uploadFileToStorage(file, filePath, onProgress);
}

export async function uploadCategoryImage(
  file: File,
  categoryId: string,
  onProgress?: (progress: number) => void
): Promise<string> {
  validateImageFile(file);
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
  const safeId = categoryId || 'category_' + Date.now();
  const filePath = `categories/${safeId}/cover/${Date.now()}_${sanitizedName}`;

  return uploadFileToStorage(file, filePath, onProgress);
}

export async function uploadGalleryImage(
  file: File,
  galleryId: string,
  onProgress?: (progress: number) => void
): Promise<string> {
  validateImageFile(file);
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
  const safeId = galleryId || 'gallery_' + Date.now();
  const filePath = `gallery/${safeId}/${Date.now()}_${sanitizedName}`;

  return uploadFileToStorage(file, filePath, onProgress);
}

export async function uploadProjectCoverImage(
  file: File,
  projectId: string,
  onProgress?: (progress: number) => void
): Promise<string> {
  validateImageFile(file);
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
  const safeId = projectId || 'proj_' + Date.now();
  const filePath = `projects/${safeId}/cover/${Date.now()}_${sanitizedName}`;

  return uploadFileToStorage(file, filePath, onProgress);
}

export async function uploadProjectGalleryImage(
  file: File,
  projectId: string,
  onProgress?: (progress: number) => void
): Promise<string> {
  validateImageFile(file);
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
  const safeId = projectId || 'proj_' + Date.now();
  const filePath = `projects/${safeId}/gallery/${Date.now()}_${sanitizedName}`;

  return uploadFileToStorage(file, filePath, onProgress);
}

async function uploadFileToStorage(
  file: File,
  filePath: string,
  onProgress?: (progress: number) => void
): Promise<string> {
  try {
    const storageRef = ref(storage, filePath);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          if (onProgress) onProgress(progress);
        },
        (error) => {
          console.warn("Storage upload task error:", error);
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject(new Error('Upload failed: ' + error.message));
          reader.readAsDataURL(file);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  } catch (err: any) {
    console.warn("Firebase Storage upload exception, falling back:", err);
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}

// ---------------- CATEGORIES ----------------
export async function getCategories(): Promise<Category[]> {
  try {
    const colRef = collection(db, CATEGORIES_COL);
    const snap = await getDocs(colRef);
    if (snap.empty) {
      await seedInitialData();
      const freshSnap = await getDocs(colRef);
      return freshSnap.docs.map(d => ({ id: d.id, ...d.data() } as Category)).sort((a, b) => (a.order || 0) - (b.order || 0));
    }
    const items = snap.docs.map(d => ({ id: d.id, ...d.data() } as Category));
    
    // Ensure initial 6 categories exist without duplicates
    const existingSlugs = new Set(items.map(i => i.slug));
    let hasAddedMissing = false;
    for (const initCat of initialCategories) {
      if (!existingSlugs.has(initCat.slug) && !(initCat.slug === 'pebble' && existingSlugs.has('pebble-stone'))) {
        try {
          await setDoc(doc(db, CATEGORIES_COL, initCat.slug), {
            ...initCat,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
          items.push({ id: initCat.slug, ...initCat });
          hasAddedMissing = true;
        } catch (e) {
          // ignore
        }
      }
    }

    return items.sort((a, b) => (a.order || 0) - (b.order || 0));
  } catch (err) {
    console.warn("Categories fetch fallback:", err);
    return initialCategories;
  }
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const colRef = collection(db, CATEGORIES_COL);
    const q = query(colRef, where('slug', '==', slug));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const docItem = snap.docs[0];
      return { id: docItem.id, ...docItem.data() } as Category;
    }
    // Also check if doc id is slug
    const directDoc = await getDoc(doc(db, CATEGORIES_COL, slug));
    if (directDoc.exists()) {
      return { id: directDoc.id, ...directDoc.data() } as Category;
    }
    const fallback = initialCategories.find(c => c.slug === slug || (slug === 'pebble' && c.slug === 'pebble-stone'));
    return fallback || null;
  } catch (err) {
    return initialCategories.find(c => c.slug === slug) || null;
  }
}

export async function saveCategory(cat: Omit<Category, 'id'>, id?: string): Promise<string> {
  try {
    const payload = {
      ...cat,
      updatedAt: new Date().toISOString()
    };
    if (id) {
      const docRef = doc(db, CATEGORIES_COL, id);
      await updateDoc(docRef, payload);
      return id;
    } else {
      const colRef = collection(db, CATEGORIES_COL);
      const res = await addDoc(colRef, {
        ...payload,
        createdAt: new Date().toISOString()
      });
      return res.id;
    }
  } catch (err) {
    handleFirestoreError(err, id ? OperationType.UPDATE : OperationType.CREATE, CATEGORIES_COL);
  }
}

export async function deleteCategory(id: string, categoryData?: Category): Promise<void> {
  try {
    if (categoryData?.image && categoryData.image.includes('firebasestorage')) {
      try {
        const imgRef = ref(storage, categoryData.image);
        await deleteObject(imgRef);
      } catch (e) {
        // ignore
      }
    }
    await deleteDoc(doc(db, CATEGORIES_COL, id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${CATEGORIES_COL}/${id}`);
  }
}

// ---------------- GALLERY ----------------
export async function getGallery(onlyFeatured = false): Promise<GalleryItem[]> {
  try {
    const colRef = collection(db, GALLERY_COL);
    const snap = await getDocs(colRef);
    if (snap.empty) {
      await seedInitialData();
      const freshSnap = await getDocs(colRef);
      let items = freshSnap.docs.map(d => {
        const data = d.data();
        return {
          id: d.id,
          ...data,
          imageUrl: data.imageUrl || data.image || ''
        } as GalleryItem;
      });
      if (onlyFeatured) {
        items = items.filter(i => i.featured);
      }
      return items.sort((a, b) => (a.order || 0) - (b.order || 0));
    }
    let items = snap.docs.map(d => {
      const data = d.data();
      return {
        id: d.id,
        ...data,
        imageUrl: data.imageUrl || data.image || ''
      } as GalleryItem;
    });

    if (onlyFeatured) {
      const featuredItems = items.filter(i => i.featured);
      // If fewer than 6 featured exist, fill with regular items so layout never breaks
      if (featuredItems.length >= 6) {
        return featuredItems.slice(0, 6);
      }
      return items.slice(0, 6);
    }

    return items.sort((a, b) => (a.order || 0) - (b.order || 0));
  } catch (err) {
    console.warn("Gallery fetch fallback:", err);
    if (onlyFeatured) {
      return initialGallery.filter(i => i.featured).slice(0, 6);
    }
    return initialGallery;
  }
}

export async function saveGalleryItem(item: Omit<GalleryItem, 'id'>, id?: string): Promise<string> {
  try {
    const autoAlt = item.altText?.trim() || `${item.title} - MOZAIK Natural Stone`;
    const autoSlug = item.slug || item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    const imgUrl = item.imageUrl || item.image || '';

    const payload = {
      ...item,
      title: item.title,
      slug: autoSlug,
      category: item.category,
      description: item.description,
      imageUrl: imgUrl,
      image: imgUrl,
      altText: autoAlt,
      featured: Boolean(item.featured),
      order: Number(item.order || 1),
      updatedAt: new Date().toISOString()
    };

    if (id) {
      const docRef = doc(db, GALLERY_COL, id);
      await updateDoc(docRef, payload);
      return id;
    } else {
      const res = await addDoc(collection(db, GALLERY_COL), {
        ...payload,
        createdAt: new Date().toISOString()
      });
      return res.id;
    }
  } catch (err) {
    handleFirestoreError(err, id ? OperationType.UPDATE : OperationType.CREATE, GALLERY_COL);
  }
}

export async function deleteGalleryItem(id: string, itemData?: GalleryItem): Promise<void> {
  try {
    const url = itemData?.imageUrl || itemData?.image;
    if (url && url.includes('firebasestorage')) {
      try {
        const imgRef = ref(storage, url);
        await deleteObject(imgRef);
      } catch (e) {
        // ignore
      }
    }
    await deleteDoc(doc(db, GALLERY_COL, id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${GALLERY_COL}/${id}`);
  }
}

// ---------------- PROJECTS ----------------
function normalizeProject(docId: string, data: any): Project {
  const rawGallery = Array.isArray(data.galleryImages) ? data.galleryImages : [];
  const normalizedGallery = rawGallery.map((img: any, idx: number) => {
    if (typeof img === 'string') {
      return {
        url: img,
        alt: `${data.name || 'Project'} - MOZAIK Natural Stone Project`,
        order: idx + 1
      };
    }
    return {
      url: img.url || '',
      alt: img.alt || `${data.name || 'Project'} - MOZAIK Natural Stone Project`,
      order: img.order || idx + 1
    };
  });

  return {
    id: docId,
    name: data.name || '',
    slug: data.slug || '',
    location: data.location || '',
    country: data.country || 'Indonesia',
    year: data.year || new Date().getFullYear().toString(),
    category: data.category || 'Architecture',
    client: data.client || '',
    architect: data.architect || '',
    description: data.description || '',
    productsUsed: data.productsUsed || '',
    application: data.application || '',
    featured: Boolean(data.featured),
    coverImage: data.coverImage || '',
    galleryImages: normalizedGallery,
    seoTitle: data.seoTitle || `${data.name} | Natural Stone Project | MOZAIK`,
    seoDescription: data.seoDescription || data.description || '',
    seoKeywords: data.seoKeywords || '',
    createdAt: data.createdAt,
    updatedAt: data.updatedAt
  };
}

export async function getProjects(): Promise<Project[]> {
  try {
    const colRef = collection(db, PROJECTS_COL);
    const snap = await getDocs(colRef);
    if (snap.empty) {
      await seedInitialData();
      const freshSnap = await getDocs(colRef);
      return freshSnap.docs.map(d => normalizeProject(d.id, d.data()));
    }
    return snap.docs.map(d => normalizeProject(d.id, d.data()));
  } catch (err) {
    console.warn("Projects fetch fallback:", err);
    return initialProjects.map((p, idx) => normalizeProject('seed_' + idx, p));
  }
}

export async function getProjectById(id: string): Promise<Project | null> {
  try {
    const docRef = doc(db, PROJECTS_COL, id);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return normalizeProject(snap.id, snap.data());
    }
    return await getProjectBySlug(id);
  } catch (err) {
    return await getProjectBySlug(id);
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const colRef = collection(db, PROJECTS_COL);
    const q = query(colRef, where('slug', '==', slug));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const docItem = snap.docs[0];
      return normalizeProject(docItem.id, docItem.data());
    }
    const fallback = initialProjects.find(p => p.slug === slug);
    return fallback ? normalizeProject('seed_' + slug, fallback) : null;
  } catch (err) {
    const fallback = initialProjects.find(p => p.slug === slug);
    return fallback ? normalizeProject('seed_' + slug, fallback) : null;
  }
}

export async function getFeaturedProjects(limitCount = 3): Promise<Project[]> {
  try {
    const all = await getProjects();
    const featured = all.filter(p => p.featured);
    if (featured.length > 0) {
      return featured.slice(0, limitCount);
    }
    return all.slice(0, limitCount);
  } catch (err) {
    return initialProjects.slice(0, limitCount);
  }
}

export async function saveProject(project: Omit<Project, 'id'>, id?: string): Promise<string> {
  try {
    const rawGallery = Array.isArray(project.galleryImages) ? project.galleryImages : [];
    const formattedGallery = rawGallery.map((img: any, idx: number) => {
      const url = typeof img === 'string' ? img : img.url;
      const alt = (typeof img === 'string' ? '' : img.alt) || `${project.name} - MOZAIK Natural Stone Project`;
      const order = (typeof img === 'string' ? idx + 1 : img.order) || (idx + 1);
      return { url, alt, order };
    });

    const payload = {
      name: project.name,
      slug: project.slug,
      location: project.location,
      country: project.country || 'Indonesia',
      year: project.year,
      category: project.category,
      client: project.client || '',
      architect: project.architect || '',
      description: project.description,
      productsUsed: project.productsUsed,
      application: project.application || '',
      featured: Boolean(project.featured),
      coverImage: project.coverImage,
      galleryImages: formattedGallery,
      seoTitle: project.seoTitle || `${project.name} | Natural Stone Project | MOZAIK`,
      seoDescription: project.seoDescription || project.description || '',
      seoKeywords: project.seoKeywords || '',
      updatedAt: new Date().toISOString()
    };

    if (id) {
      const docRef = doc(db, PROJECTS_COL, id);
      await updateDoc(docRef, payload);
      return id;
    } else {
      const res = await addDoc(collection(db, PROJECTS_COL), {
        ...payload,
        createdAt: new Date().toISOString()
      });
      return res.id;
    }
  } catch (err) {
    handleFirestoreError(err, id ? OperationType.UPDATE : OperationType.CREATE, PROJECTS_COL);
  }
}

export async function deleteProject(id: string, projectData?: Project): Promise<void> {
  try {
    if (projectData) {
      // 1. Delete cover image from Firebase Storage if hosted there
      if (projectData.coverImage && projectData.coverImage.includes('firebasestorage')) {
        try {
          const coverRef = ref(storage, projectData.coverImage);
          await deleteObject(coverRef);
        } catch (e) {
          console.warn("Storage cover delete notice:", e);
        }
      }
      // 2. Delete gallery images from Firebase Storage if hosted there
      if (projectData.galleryImages) {
        for (const item of projectData.galleryImages) {
          const url = typeof item === 'string' ? item : item.url;
          if (url && url.includes('firebasestorage')) {
            try {
              const imgRef = ref(storage, url);
              await deleteObject(imgRef);
            } catch (e) {
              console.warn("Storage gallery item delete notice:", e);
            }
          }
        }
      }
    }

    // 3. Delete Firestore document
    await deleteDoc(doc(db, PROJECTS_COL, id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${PROJECTS_COL}/${id}`);
  }
}

// ---------------- INQUIRIES ----------------
export async function submitInquiry(
  inquiry: Omit<Inquiry, 'id' | 'createdAt' | 'status' | 'updatedAt'>
): Promise<string> {
  try {
    const colRef = collection(db, INQUIRIES_COL);
    const now = new Date().toISOString();
    const payload = {
      name: inquiry.name.trim(),
      company: inquiry.company?.trim() || '',
      email: inquiry.email.trim(),
      phone: inquiry.phone.trim(),
      country: inquiry.country?.trim() || '',
      projectType: inquiry.projectType || 'Residential',
      productId: inquiry.productId || '',
      productName: inquiry.productName || '',
      productInterest: inquiry.productName || inquiry.productInterest || '',
      estimatedQuantity: inquiry.estimatedQuantity?.trim() || '',
      projectLocation: inquiry.projectLocation?.trim() || '',
      message: inquiry.message.trim(),
      sourcePage: inquiry.sourcePage || 'contact',
      status: 'new',
      createdAt: now,
      updatedAt: now
    };
    const res = await addDoc(colRef, payload);
    return res.id;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, INQUIRIES_COL);
  }
}

export async function getInquiries(): Promise<Inquiry[]> {
  try {
    const colRef = collection(db, INQUIRIES_COL);
    const snap = await getDocs(colRef);
    if (snap.empty) {
      // Seed sample inquiries so the admin has test data
      for (const inq of initialInquiries) {
        await addDoc(colRef, inq);
      }
      return [...initialInquiries];
    }
    const list = snap.docs.map(d => {
      const data = d.data();
      return {
        id: d.id,
        ...data,
        status: (data.status || 'new').toLowerCase() as Inquiry['status']
      } as Inquiry;
    });
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (err) {
    console.error("Get inquiries error:", err);
    return [...initialInquiries];
  }
}

export async function getInquiryById(id: string): Promise<Inquiry | null> {
  try {
    const docRef = doc(db, INQUIRIES_COL, id);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      return {
        id: snap.id,
        ...data,
        status: (data.status || 'new').toLowerCase() as Inquiry['status']
      } as Inquiry;
    }
    return null;
  } catch (err) {
    console.error("Get inquiry by id error:", err);
    return null;
  }
}

export async function updateInquiryStatus(id: string, status: Inquiry['status']): Promise<void> {
  try {
    await updateDoc(doc(db, INQUIRIES_COL, id), {
      status: status.toLowerCase(),
      updatedAt: new Date().toISOString()
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `${INQUIRIES_COL}/${id}`);
  }
}

export async function deleteInquiry(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, INQUIRIES_COL, id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${INQUIRIES_COL}/${id}`);
  }
}

// ---------------- SETTINGS ----------------
export async function getSettings(): Promise<SiteSettings> {
  try {
    // Check settings/contact first
    const contactRef = doc(db, SETTINGS_COL, 'contact');
    const contactSnap = await getDoc(contactRef);
    if (contactSnap.exists()) {
      const data = contactSnap.data();
      const num = data.whatsappNumber || data.whatsapp || initialSettings.whatsapp;
      return {
        id: contactSnap.id,
        ...initialSettings,
        ...data,
        whatsapp: num,
        whatsappNumber: num
      } as SiteSettings;
    }

    // Check settings/general
    const generalRef = doc(db, SETTINGS_COL, 'general');
    const generalSnap = await getDoc(generalRef);
    if (generalSnap.exists()) {
      const data = generalSnap.data();
      const num = data.whatsappNumber || data.whatsapp || initialSettings.whatsapp;
      return {
        id: generalSnap.id,
        ...initialSettings,
        ...data,
        whatsapp: num,
        whatsappNumber: num
      } as SiteSettings;
    }

    // Initialize both
    await setDoc(contactRef, initialSettings);
    await setDoc(generalRef, initialSettings);
    return initialSettings;
  } catch (err) {
    return initialSettings;
  }
}

export async function updateSettings(settings: Partial<SiteSettings>): Promise<void> {
  try {
    const rawNumber = settings.whatsappNumber || settings.whatsapp || initialSettings.whatsapp;
    const payload = {
      ...settings,
      whatsapp: rawNumber,
      whatsappNumber: rawNumber,
      updatedAt: new Date().toISOString()
    };
    await setDoc(doc(db, SETTINGS_COL, 'contact'), payload, { merge: true });
    await setDoc(doc(db, SETTINGS_COL, 'general'), payload, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${SETTINGS_COL}/contact`);
  }
}

// ---------------- DASHBOARD METRICS ----------------
export async function getDashboardStatistics() {
  try {
    const [prods, projs, gal, inqs] = await Promise.all([
      getProducts(),
      getProjects(),
      getGallery(),
      getInquiries()
    ]);

    const newCount = inqs.filter(i => (i.status || '').toLowerCase() === 'new').length;
    const contactedCount = inqs.filter(i => (i.status || '').toLowerCase() === 'contacted').length;
    const quotedCount = inqs.filter(i => (i.status || '').toLowerCase() === 'quoted').length;
    const wonCount = inqs.filter(i => (i.status || '').toLowerCase() === 'won').length;

    return {
      totalProducts: prods.length,
      featuredProducts: prods.filter(p => p.featured).length,
      totalProjects: projs.length,
      featuredProjects: projs.filter(p => p.featured).length,
      totalGallery: gal.length,
      totalInquiries: inqs.length,
      newInquiries: newCount,
      contacted: contactedCount,
      quoted: quotedCount,
      won: wonCount
    };
  } catch (err) {
    console.error("Dashboard statistics error:", err);
    return {
      totalProducts: 0,
      featuredProducts: 0,
      totalProjects: 0,
      featuredProjects: 0,
      totalGallery: 0,
      totalInquiries: 0,
      newInquiries: 0,
      contacted: 0,
      quoted: 0,
      won: 0
    };
  }
}

export async function uploadImageFile(file: File, folder = 'products'): Promise<string> {
  return uploadProductImage(file, folder, 'main');
}

// ---------------- SEED INITIAL DATA ----------------
export async function seedInitialData(): Promise<void> {
  if (isSeedingInProgress) return;
  isSeedingInProgress = true;
  try {
    for (const cat of initialCategories) {
      await setDoc(doc(db, CATEGORIES_COL, cat.slug), {
        ...cat,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    for (const prod of initialProducts) {
      await setDoc(doc(db, PRODUCTS_COL, prod.slug), {
        ...prod,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    for (let i = 0; i < initialGallery.length; i++) {
      const item = initialGallery[i];
      await setDoc(doc(db, GALLERY_COL, `gallery-${i + 1}`), {
        ...item,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    for (const proj of initialProjects) {
      await setDoc(doc(db, PROJECTS_COL, proj.slug), {
        ...proj,
        createdAt: new Date().toISOString()
      });
    }
    await setDoc(doc(db, SETTINGS_COL, 'general'), initialSettings);
  } catch (err) {
    console.warn("Initial data seeding notice:", err);
  } finally {
    isSeedingInProgress = false;
  }
}
