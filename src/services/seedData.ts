import { Product, Category, GalleryItem, Project, SiteSettings, Inquiry } from '../types';

export const initialCategories: Category[] = [
  {
    name: "Mosaic Stone",
    slug: "mosaic-stone",
    description: "Artisanal hand-cut and precision-mesh mounted natural stone mosaic sheets for walls, pool linings, and accent surfaces.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    seoTitle: "Mosaic Stone | Natural Stone Mosaic Collection | MOZAIK",
    seoDescription: "Explore MOZAIK mosaic stone collection for landscape, architecture, interior and exterior applications.",
    featured: true,
    order: 1
  },
  {
    name: "Pebble",
    slug: "pebble",
    description: "Naturally tumbled river and sea pebbles curated for zen landscapes, decorative walkways, and exposed aggregate finishes.",
    image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1200&q=80",
    seoTitle: "Pebble Stone Collection | Natural Indonesian River Stones | MOZAIK",
    seoDescription: "Curated tumbled river and ocean pebbles for architectural landscape, walkways, and terrazzo aggregate.",
    featured: true,
    order: 2
  },
  {
    name: "Gravel",
    slug: "gravel",
    description: "Crushed stone aggregates in earthy palettes designed for permeable driveways, modern courtyards, and minimalist gardens.",
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=80",
    seoTitle: "Gravel & Architectural Aggregates | MOZAIK",
    seoDescription: "Crushed stone aggregates in earthy palettes designed for permeable driveways, modern courtyards, and gardens.",
    featured: true,
    order: 3
  },
  {
    name: "Natural Stone",
    slug: "natural-stone",
    description: "Authentic Indonesian and volcanic flagstones, andesite, basalt, and limestone crafted for timeless architectural durability.",
    image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
    seoTitle: "Natural Stone Collection | Volcanic Andesite & Basalt | MOZAIK",
    seoDescription: "Authentic Indonesian volcanic flagstones, andesite, and basalt crafted for architectural durability.",
    featured: true,
    order: 4
  },
  {
    name: "Decorative Stone",
    slug: "decorative-stone",
    description: "Crazy paving, travertine off-cuts, carved basalt monoliths, and sculpted natural features for statement spaces.",
    image: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1200&q=80",
    seoTitle: "Decorative Stone & Crazy Paving | MOZAIK",
    seoDescription: "Crazy paving, travertine off-cuts, carved basalt, and sculpted natural features for statement spaces.",
    featured: true,
    order: 5
  },
  {
    name: "Custom Mosaic",
    slug: "custom-mosaic",
    description: "Bespoke pattern design, tailored sizing, and custom stone compositions crafted in collaboration with architects and designers.",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80",
    seoTitle: "Custom Mosaic & Bespoke Stone Design | MOZAIK",
    seoDescription: "Bespoke pattern design, tailored sizing, and custom stone compositions crafted for architects and designers.",
    featured: true,
    order: 6
  }
];

export const initialProducts: Product[] = [
  {
    name: "White River Pebble Mosaic",
    slug: "white-river-pebble-mosaic",
    categoryId: "mosaic-stone",
    category: "Mosaic Stone",
    shortDescription: "Seamless interlocking mesh-mounted natural white river pebble mosaic for barefoot luxury in showers and pool surrounds.",
    description: "Harvested from riverbeds and tumble-smoothed to perfection, the White River Pebble Mosaic delivers an organic tactile sensation underfoot. Each stone is individually hand-selected and adhered to a flexible fiberglass mesh backing with interlocking edges for an invisible seamless joint pattern. Ideal for resort bathrooms, outdoor showers, sauna surrounds, and pool waterlines.",
    material: "Natural River Pebble",
    color: "Warm Creamy White / Ivory",
    size: "300 x 300 mm sheet (Pebble 20-40 mm)",
    finish: "Smooth Tumbled / Matte",
    applications: ["Pool", "Wall", "Interior", "Landscape", "Bathroom"],
    minimumOrder: "20 m²",
    availability: "In Stock (Ready to Ship)",
    featured: true,
    mainImage: "https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      {
        url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80",
        alt: "White River Pebble Mosaic bathroom shower pan installation",
        order: 1
      },
      {
        url: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1200&q=80",
        alt: "Detail of tumbled white pebble texture",
        order: 2
      }
    ],
    seoTitle: "White River Pebble Mosaic | MOZAIK Natural Stone Indonesia",
    seoDescription: "Premium interlocking white pebble mosaic sheets for luxury bathrooms, pool coping, and landscape architecture. Factory direct supplier.",
    seoKeywords: "white pebble mosaic, natural stone mosaic, river pebble, bathroom mosaic stone, pool stone mosaic"
  },
  {
    name: "Bali Sukabumi Green Emerald Stone",
    slug: "bali-sukabumi-green-stone",
    categoryId: "natural-stone",
    category: "Natural Stone",
    shortDescription: "World-renowned Indonesian green quartzite stone containing natural zeolite, celebrated for crystal-clear pool waters.",
    description: "Prized across luxury tropical resorts worldwide from Bali to the Maldives, Sukabumi Green (Pedra Hijau) exhibits striking emerald and jade undertones that intensify beneath sunlight and water. Sukabumi stone contains naturally occurring zeolite minerals, known for water purification properties. Offered in calibrated honed or natural cleft finishes for slip resistance in high-moisture resort pool decks.",
    material: "Natural Quartzite / Zeolite Andesite",
    color: "Deep Jade Green to Soft Aqua",
    size: "100 x 100 mm / 200 x 100 mm / 200 x 200 mm (10-15 mm thick)",
    finish: "Honed / Sawn Cut / Natural Cleft",
    applications: ["Pool", "Exterior", "Landscape", "Commercial"],
    minimumOrder: "50 m²",
    availability: "In Stock & Custom Cut to Order",
    featured: true,
    mainImage: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      {
        url: "https://images.unsplash.com/photo-1563298723-dcfebaa392e3?auto=format&fit=crop&w=1200&q=80",
        alt: "Infinity pool lined with Bali Sukabumi Green quartzite",
        order: 1
      },
      {
        url: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1200&q=80",
        alt: "Wet Sukabumi green stone reflections",
        order: 2
      }
    ],
    seoTitle: "Bali Green Sukabumi Stone Pool Tile | MOZAIK",
    seoDescription: "Authentic Indonesian Sukabumi green stone tiles for luxury swimming pools and resort landscape projects.",
    seoKeywords: "sukabumi green stone, bali pool stone, green quartzite, natural stone supplier indonesia, pedra hijau"
  },
  {
    name: "Candi Andesite Flamed Paver",
    slug: "candi-andesite-flamed-paver",
    categoryId: "natural-stone",
    category: "Natural Stone",
    shortDescription: "Volcanic basalt-andesite paver with thermal flamed texture, providing unmatched structural strength and slip resistance.",
    description: "Sourced from the historic volcanic quarries of Central Java, Candi Andesite is one of the most durable natural architectural materials in Southeast Asia. The thermal flamed finish bursts the stone quartz crystals, producing a fine micro-rough texture that ensures exceptional grip even when wet. Resistant to heavy vehicular traffic, acidic soils, and tropical weather.",
    material: "Volcanic Andesite / Lava Stone",
    color: "Charcoal Gray with Subtle Specks",
    size: "300 x 600 mm / 600 x 600 mm (20-30 mm thick)",
    finish: "Flamed / Bush-Hammered",
    applications: ["Landscape", "Exterior", "Commercial", "Wall"],
    minimumOrder: "30 m²",
    availability: "In Stock",
    featured: true,
    mainImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      {
        url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
        alt: "Candi Andesite flamed paving in civic courtyard",
        order: 1
      }
    ],
    seoTitle: "Candi Andesite Flamed Pavers | MOZAIK",
    seoDescription: "Heavy-duty volcanic andesite flamed paving stones for high-traffic landscape architecture, commercial plazas, and driveway paving.",
    seoKeywords: "andesite stone, candi stone, volcanic paver, flamed stone tiles, natural stone paving"
  },
  {
    name: "Honed Black Basalt Monolith Tile",
    slug: "honed-black-basalt-tile",
    categoryId: "natural-stone",
    category: "Natural Stone",
    shortDescription: "Ultra-refined architectural black basalt featuring a velvety matte honed surface for monolithic walls and floors.",
    description: "A testament to minimalist modernism. Our honed black basalt stone exhibits a tight crystalline structure with a silky non-reflective sheen. It creates quiet, atmospheric surfaces that absorb and softly diffuse natural light. Widely specified by architects for luxury hotel lobbies, contemporary feature facades, and executive bathroom suites.",
    material: "Deep Volcanic Basalt",
    color: "Midnight Charcoal / Deep Graphite",
    size: "600 x 1200 mm / 600 x 600 mm (18 mm thick)",
    finish: "Smooth Honed (Matte 400 Grit)",
    applications: ["Wall", "Interior", "Commercial", "Exterior"],
    minimumOrder: "25 m²",
    availability: "In Stock",
    featured: true,
    mainImage: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      {
        url: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80",
        alt: "Black basalt feature wall in luxury residence",
        order: 1
      }
    ],
    seoTitle: "Honed Black Basalt Architectural Stone | MOZAIK",
    seoDescription: "Architectural grade honed black basalt slabs and tiles for luxury feature walls, modern facades, and commercial interiors.",
    seoKeywords: "black basalt tile, basalt stone wall, honed basalt, dark natural stone"
  },
  {
    name: "Tumbled Charcoal River Pebble",
    slug: "tumbled-charcoal-river-pebble",
    categoryId: "pebble",
    category: "Pebble",
    shortDescription: "Smooth, water-worn basalt pebbles for zen gardens, dry creek beds, perimeter mulch, and exposed aggregate flooring.",
    description: "Deep charcoal natural pebbles shaped by thousands of years of flowing river waters. When dry, they display an elegant matte ash tone; when moistened or sealed, they gleam with rich obsidian black depth. Excellent for Japanese dry landscape gardens (karesansui), tree base surrounds, bioswales, and planter accents.",
    material: "Natural River Pebble",
    color: "Matte Charcoal to Wet Obsidian Black",
    size: "10-20 mm / 20-30 mm / 30-50 mm sorted grades",
    finish: "Natural Water-Worn / Washed",
    applications: ["Garden", "Landscape", "Exterior", "Commercial"],
    minimumOrder: "500 kg (25kg bags or Bulk bags)",
    availability: "In Stock",
    featured: true,
    mainImage: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      {
        url: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=80",
        alt: "Tumbled black river pebbles in zen courtyard mulch",
        order: 1
      }
    ],
    seoTitle: "Charcoal River Pebbles Landscape Grade | MOZAIK",
    seoDescription: "Screened tumbled charcoal river stones and black pebbles for zen landscape architecture and garden design.",
    seoKeywords: "charcoal pebbles, black river stones, garden pebble stone, landscaping pebbles"
  },
  {
    name: "Cream Travertine Crazy Paving",
    slug: "cream-travertine-crazy-paving",
    categoryId: "decorative-stone",
    category: "Decorative Stone",
    shortDescription: "Artistic organic random flagstone flagger pieces with warm ivory tones and tumbled edges for timeless Mediterranean courtyards.",
    description: "Crazy paving evokes timeless coastal European villas and organic Mid-Century modernism. Each piece is randomly sized with tumbled edges that soften transitions. The gentle cream and biscuit travertine hues reflect heat effectively, staying comfortably cool under direct tropical sun around pool decks, alfresco dining patios, and garden pathways.",
    material: "Natural Sedimentary Travertine",
    color: "Warm Cream / Ivory / Light Sand",
    size: "Random Organic Shapes (approx. 150-450 mm, 20 mm calibrated)",
    finish: "Tumbled / Unfilled / Antique Matte",
    applications: ["Landscape", "Pool", "Exterior", "Garden"],
    minimumOrder: "20 m²",
    availability: "In Stock",
    featured: true,
    mainImage: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      {
        url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
        alt: "Warm travertine crazy paving terrace",
        order: 1
      }
    ],
    seoTitle: "Cream Travertine Crazy Paving Flagstones | MOZAIK",
    seoDescription: "Organic random cream travertine crazy paving for resort pool decks, garden terraces, and alfresco courtyards.",
    seoKeywords: "crazy paving, travertine flagstone, organic stone pavers, pool deck stone, decorative stone"
  },
  {
    name: "Warm Sand Terrazzo Gravel Aggregate",
    slug: "warm-sand-terrazzo-gravel",
    categoryId: "gravel",
    category: "Gravel",
    shortDescription: "Screened and washed marble gravel aggregate ideal for seamless resin bound paving, exposed terrazzo, and architectural pathways.",
    description: "Carefully crushed and triple-washed crystalline limestone and marble aggregate. Uniformly graded to ensure optimal compaction and void structure in permeable resin bound gravel systems, architectural courtyard top-dressing, and custom terrazzo cast-in-place slabs.",
    material: "Crushed Natural Marble & Limestone",
    color: "Warm Sand / Beige / Ochre Flecks",
    size: "3-6 mm / 6-9 mm graded",
    finish: "Crushed & Mechanically Screened",
    applications: ["Garden", "Landscape", "Commercial", "Interior"],
    minimumOrder: "1 Tonne",
    availability: "In Stock",
    featured: false,
    mainImage: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [],
    seoTitle: "Sand Terrazzo Gravel Aggregate | MOZAIK",
    seoDescription: "Graded natural marble gravel for architectural gravel paths, resin bound stone, and bespoke terrazzo mixes.",
    seoKeywords: "gravel aggregate, decorative gravel, crushed marble stone, architectural gravel"
  },
  {
    name: "Art Deco Bespoke Marble & Basalt Mosaic",
    slug: "bespoke-art-deco-stone-mosaic",
    categoryId: "custom-mosaic",
    category: "Custom Mosaic",
    shortDescription: "Precision waterjet-cut geometric mosaic blending Carrara marble and volcanic basalt into an architectural focal statement.",
    description: "Custom handcrafted by MOZAIK's master stonemasons. Combining precision CNC waterjet cutting with traditional hand-assembly, this geometric statement mosaic juxtaposes creamy honed marble with deep volcanic basalt. Fully customizable in proportion, stone selection, and finish to match architect specifications.",
    material: "Selected Natural Marble & Basalt",
    color: "Dual Tone (Ivory & Charcoal Black)",
    size: "Custom Modular Panels (Standard module 400 x 400 mm)",
    finish: "Satin Honed",
    applications: ["Wall", "Interior", "Commercial"],
    minimumOrder: "15 m² (Custom manufactured)",
    availability: "Made to Order (Lead time: 3-4 weeks)",
    featured: false,
    mainImage: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [],
    seoTitle: "Custom Geometric Stone Mosaic | MOZAIK Bespoke",
    seoDescription: "Custom architectural stone mosaics made from fine Indonesian and imported marble and basalt. Tailored to project specifications.",
    seoKeywords: "custom mosaic, bespoke stone mosaic, architectural stone mosaic, luxury marble mosaic"
  }
];

export const initialGallery: GalleryItem[] = [
  {
    title: "Infinity Edge Pool with Sukabumi Quartzite",
    slug: "infinity-pool-sukabumi-quartzite",
    category: "Pool",
    description: "Luxury cliffside private sanctuary lined with calibrated Sukabumi green tiles reflecting the Indian Ocean sky.",
    imageUrl: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=80",
    image: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=80",
    altText: "Infinity Edge Pool with Sukabumi Green Quartzite Natural Stone",
    featured: true,
    order: 1
  },
  {
    title: "Monolithic Basalt Facade & Courtyard Steps",
    slug: "monolithic-basalt-facade-courtyard",
    category: "Exterior",
    description: "Contemporary residence using flamed andesite pavers and honed dark basalt feature walls for serene spatial weight.",
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    altText: "Monolithic Basalt Facade and Flamed Andesite Steps",
    featured: true,
    order: 2
  },
  {
    title: "Minimalist Zen Courtyard with River Pebbles",
    slug: "zen-courtyard-river-pebbles",
    category: "Landscape",
    description: "Tumbled charcoal river stones framed by raw concrete borders and architectural moss accents.",
    imageUrl: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1200&q=80",
    image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1200&q=80",
    altText: "Minimalist Zen Courtyard with Tumbled Charcoal River Pebbles",
    featured: true,
    order: 3
  },
  {
    title: "Organic Crazy Paving Alfresco Terrace",
    slug: "crazy-paving-alfresco-terrace",
    category: "Garden",
    description: "Warm travertine crazy paving seamlessly bridging interior living to lush subtropical gardens.",
    imageUrl: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1200&q=80",
    image: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1200&q=80",
    altText: "Organic Crazy Paving Alfresco Terrace in Travertine",
    featured: true,
    order: 4
  },
  {
    title: "Sculptural Bathroom Retreat with Pebble Mosaic",
    slug: "sculptural-bathroom-pebble-mosaic",
    category: "Interior",
    description: "Curved shower wall and sunken bath surround adorned with seamless white river pebble mosaic.",
    imageUrl: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80",
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80",
    altText: "Sculptural Bathroom Retreat with White River Pebble Mosaic",
    featured: true,
    order: 5
  },
  {
    title: "Executive Hotel Atrium Feature Stone Wall",
    slug: "hotel-atrium-feature-stone-wall",
    category: "Commercial",
    description: "Multi-textured volcanic stone cladding creating rhythmic shadow play in high-volume hospitality lobby.",
    imageUrl: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
    image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
    altText: "Executive Hotel Atrium Feature Volcanic Stone Cladding Wall",
    featured: true,
    order: 6
  },
  {
    title: "Tropical Villa Entryway with Step Stones & Gravel",
    slug: "tropical-villa-step-stones-gravel",
    category: "Residential",
    description: "Large format basalt stepping stones suspended over washed sand gravel aggregate.",
    imageUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=80",
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=80",
    altText: "Tropical Villa Entryway with Large Basalt Steps and Washed Gravel",
    featured: false,
    order: 7
  },
  {
    title: "Artisanal Custom Mosaic Bar Front",
    slug: "custom-mosaic-bar-front",
    category: "Hospitality",
    description: "Handcrafted geometric stone mosaic creating a tactile focal center in a boutique hospitality lounge.",
    imageUrl: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80",
    altText: "Artisanal Custom Natural Stone Mosaic Bar Front",
    featured: false,
    order: 8
  }
];

export const initialProjects: Project[] = [
  {
    name: "The Alila Cliffside Sanctuary",
    slug: "the-alila-cliffside-sanctuary",
    location: "Uluwatu, Bali",
    country: "Indonesia",
    year: "2024",
    category: "Hospitality",
    client: "Alila Hotels & Resorts",
    architect: "WOHA Architects",
    description: "A 48-villa luxury clifftop resort perched 100 meters above the Indian Ocean. MOZAIK was commissioned to supply over 4,500 m² of custom-cut Sukabumi green quartzite for the centerpiece cantilevered infinity pool, complemented by thermally flamed Candi Andesite paving across private villa pool decks.",
    productsUsed: "bali-sukabumi-green-stone, candi-andesite-flamed-pavers, charcoal-river-pebble",
    application: "Infinity Pool, Clifftop Decking, Outdoor Showers",
    featured: true,
    coverImage: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      {
        url: "https://images.unsplash.com/photo-1563298723-dcfebaa392e3?auto=format&fit=crop&w=1200&q=80",
        alt: "The Alila Cliffside Sanctuary - MOZAIK Natural Stone Project",
        order: 1
      },
      {
        url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
        alt: "The Alila Cliffside Sanctuary - Pool Terrace Detail",
        order: 2
      }
    ],
    seoTitle: "The Alila Cliffside Sanctuary | Natural Stone Project | MOZAIK",
    seoDescription: "Clifftop resort in Uluwatu, Bali featuring custom Sukabumi green quartzite pools and flamed andesite stone paving.",
    seoKeywords: "alila uluwatu stone, sukabumi green quartzite pool, bali luxury resort stone, flamed andesite"
  },
  {
    name: "Private Villa Bali",
    slug: "private-villa-bali",
    location: "Canggu, Bali",
    country: "Indonesia",
    year: "2024",
    category: "Residential",
    client: "Private Homeowner",
    architect: "Studio Tonkin Design",
    description: "Explore a private villa project in Bali featuring Indonesian natural stone for architectural and landscape applications. A contemporary residence blending raw basalt stone with interlocking river pebble mosaics for organic wet-area comfort and natural thermal moderation.",
    productsUsed: "white-river-pebble-mosaic, cream-travertine-crazy-paving, basalt-honed-slab",
    application: "Indoor-Outdoor Spa, Bathroom Ensuites, Garden Courtyards",
    featured: true,
    coverImage: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      {
        url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80",
        alt: "Private Villa Bali - MOZAIK Natural Stone Project",
        order: 1
      },
      {
        url: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1200&q=80",
        alt: "Private Villa Bali - Bathroom Pebble Mosaic Installation",
        order: 2
      }
    ],
    seoTitle: "Private Villa Bali | Natural Stone Project | MOZAIK",
    seoDescription: "Explore a private villa project in Bali featuring Indonesian natural stone for architectural and landscape applications.",
    seoKeywords: "private villa bali, bali stone architecture, canggu villa natural stone, pebble mosaic bathroom"
  },
  {
    name: "Botanical Plaza & Urban Promenade",
    slug: "botanical-plaza-urban-promenade",
    location: "Menteng, Jakarta",
    country: "Indonesia",
    year: "2025",
    category: "Commercial",
    client: "PT Metropolitan Urban",
    architect: "Andra Matin Studio",
    description: "A civic landscape regeneration project connecting an urban heritage botanical park with a high-end commercial galleria. Heavy-duty flamed volcanic andesite pavers were specified for vehicular and pedestrian plazas, flanked by custom water rills lined with river pebbles.",
    productsUsed: "candi-andesite-flamed-pavers, charcoal-river-pebble, washed-sand-terrazzo-gravel",
    application: "Pedestrian Esplanade, Public Water Features, Exterior Paving",
    featured: true,
    coverImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      {
        url: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=80",
        alt: "Botanical Plaza & Urban Promenade - MOZAIK Natural Stone Project",
        order: 1
      },
      {
        url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
        alt: "Botanical Plaza - Andesite Stone Paving Detail",
        order: 2
      }
    ],
    seoTitle: "Botanical Plaza & Urban Promenade | Natural Stone Project | MOZAIK",
    seoDescription: "Civic commercial promenade in Jakarta utilizing heavy-duty volcanic andesite pavers and water feature river pebbles.",
    seoKeywords: "urban promenade paving, commercial stone supplier jakarta, candi andesite flamed"
  },
  {
    name: "Aman Nusa Coastal Pavilion",
    slug: "aman-nusa-coastal-pavilion",
    location: "Nusa Dua, Bali",
    country: "Indonesia",
    year: "2023",
    category: "Landscape",
    client: "Nusa Dua Hospitality Group",
    architect: "Bensley Design Studios",
    description: "Multi-tiered tropical reflection pools and landscape retaining terraces lined with Indonesian green quartzite and hand-placed natural gravel aggregate, merging ocean views with natural stone texture.",
    productsUsed: "bali-sukabumi-green-stone, washed-sand-terrazzo-gravel",
    application: "Landscape Water Rills, Terrace Coping, Garden Paths",
    featured: false,
    coverImage: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      {
        url: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=80",
        alt: "Aman Nusa Coastal Pavilion - MOZAIK Natural Stone Project",
        order: 1
      }
    ],
    seoTitle: "Aman Nusa Coastal Pavilion | Natural Stone Project | MOZAIK",
    seoDescription: "Coastal landscape pavilions engineered with Indonesian green quartzite and terrace stone coping.",
    seoKeywords: "coastal stone pavilion, bali landscape stone, natural gravel pathways"
  }
];

export const initialSettings: SiteSettings = {
  siteName: "MOZAIK",
  companyName: "MOZAIK Natural Stone Collection",
  tagline: "Natural Stone. Timeless Design.",
  subBrand: "NATURAL STONE COLLECTION",
  email: "info@mozaikstone.com",
  whatsapp: "+62 812-8888-0919",
  whatsappNumber: "+62 812-8888-0919",
  phone: "+62 21 5560 8820",
  address: "Sentra Industri Batu Alam & Arsitektur Nusantara, Jl. Sunset Road No. 88, Bali & Jakarta, Indonesia",
  businessHours: "Monday - Friday: 08:30 - 17:30 WIB | Saturday: 09:00 - 15:00 WIB",
  siteUrl: "https://mozaikstone.com",
  defaultSeoTitle: "MOZAIK | Natural Stone & Mosaic Collection from Indonesia",
  defaultSeoDescription: "Explore MOZAIK's natural stone, mosaic stone, pebble and decorative stone collection from Indonesia for architecture, landscape and interior projects.",
  defaultSeoKeywords: "natural stone indonesia, mosaic stone, pebble stone, gravel, andesite, sukabumi green stone, architectural stone supplier indonesia",
  googleSiteVerification: ""
};

export const initialInquiries: Inquiry[] = [
  {
    name: "Ahmad Dahlan",
    company: "Dahlan Studio & Partners",
    email: "ahmad@dahlanstudio.id",
    phone: "+6281234567890",
    country: "Indonesia",
    projectType: "Hospitality",
    productId: "bali-sukabumi-green-stone",
    productName: "Bali Sukabumi Green Stone",
    productInterest: "Bali Sukabumi Green Stone",
    estimatedQuantity: "450 m²",
    projectLocation: "Canggu, Bali",
    message: "We are designing a boutique resort in Canggu and need calibrated 10x10cm Sukabumi green tiles for two infinity pools and lagoon features. Please provide FOB Surabaya quotation and physical sample kit.",
    sourcePage: "product",
    status: "new",
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 4).toISOString()
  },
  {
    name: "Marcus Vance",
    company: "Vance Architecture Sydney",
    email: "m.vance@vancearch.com.au",
    phone: "+61412345678",
    country: "Australia",
    projectType: "Residential",
    productId: "white-pebble-mosaic",
    productName: "White Pebble Mosaic",
    productInterest: "White Pebble Mosaic",
    estimatedQuantity: "180 m²",
    projectLocation: "Byron Bay, NSW",
    message: "Seeking interlocking standing white pebble sheets for luxury bathroom ensuites and outdoor shower pathways. Please provide export container availability and lead times.",
    sourcePage: "collection",
    status: "contacted",
    createdAt: new Date(Date.now() - 86400000 * 1.5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    name: "Clara Tan",
    company: "Oasis Landscape Architects",
    email: "clara.tan@oasisdesign.sg",
    phone: "+6598765432",
    country: "Singapore",
    projectType: "Commercial",
    productId: "volcanic-andesite-paver",
    productName: "Volcanic Andesite Paver",
    productInterest: "Volcanic Andesite Paver",
    estimatedQuantity: "600 m²",
    projectLocation: "Sentosa, Singapore",
    message: "Tender specification for hotel promenade and water features using flamed volcanic andesite stone pavers in 30x60x3cm dimensions. Please provide compressive strength test report and pricing.",
    sourcePage: "homepage",
    status: "quoted",
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString()
  }
];
