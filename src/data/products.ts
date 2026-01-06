import productLamp from "@/assets/product-lamp.jpg";
import productLamp2 from "@/assets/product-lamp-2.jpg";
import productLamp3 from "@/assets/product-lamp-3.jpg";
import productOrganizer from "@/assets/product-organizer.jpg";
import productCandle from "@/assets/product-candle.jpg";
import productFidget from "@/assets/product-fidget.jpg";

export interface ProductVariant {
  id: string;
  name: string;
  color?: string;
  inStock: boolean;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  content: string;
  verified: boolean;
  helpful: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  price: number;
  originalPrice?: number;
  images: string[];
  rating: number;
  reviewCount: number;
  tag?: string;
  category: string;
  variants: ProductVariant[];
  features: string[];
  reviews: Review[];
}

export const products: Product[] = [
  {
    id: "1",
    name: "Glow Orb Lamp",
    description: "Ambient warmth for late nights",
    longDescription: "Transform your space into a cozy sanctuary with our signature Glow Orb Lamp. Featuring adjustable warm-to-cool lighting, touch-sensitive controls, and a whisper-quiet design perfect for focus sessions or winding down. The soft silicone exterior is both durable and soothing to touch.",
    price: 48,
    originalPrice: 65,
    images: [productLamp, productLamp2, productLamp3],
    rating: 4.9,
    reviewCount: 234,
    tag: "Best Seller",
    category: "Lighting",
    variants: [
      { id: "cream", name: "Warm Cream", color: "#F5F0E8", inStock: true },
      { id: "blush", name: "Soft Blush", color: "#E8B4B8", inStock: true },
      { id: "lavender", name: "Dreamy Lavender", color: "#C4B7D4", inStock: true },
      { id: "sage", name: "Sage Mist", color: "#B8C4B8", inStock: false },
    ],
    features: [
      "Touch-sensitive brightness control",
      "3 color temperature modes",
      "USB-C rechargeable (8hr battery)",
      "Soft silicone exterior",
      "Auto-off timer option",
    ],
    reviews: [
      {
        id: "r1",
        author: "Luna M.",
        rating: 5,
        date: "2 weeks ago",
        title: "Literally changed my desk game",
        content: "I've been using this every night for studying and it's SO much better than harsh overhead lighting. The blush color is gorgeous and the touch controls are super intuitive. Obsessed!",
        verified: true,
        helpful: 47,
      },
      {
        id: "r2",
        author: "Sage K.",
        rating: 5,
        date: "1 month ago",
        title: "The perfect cozy companion",
        content: "This lamp gives off the most calming glow. I use it during my night skincare routine and it just makes everything feel so peaceful. Battery life is amazing too.",
        verified: true,
        helpful: 32,
      },
      {
        id: "r3",
        author: "Willow R.",
        rating: 4,
        date: "1 month ago",
        title: "Beautiful but wish it was brighter",
        content: "The aesthetic is 10/10 and it looks stunning on my desk. Only reason for 4 stars is I wish the brightest setting was a bit brighter for reading. Still love it though!",
        verified: true,
        helpful: 18,
      },
    ],
  },
  {
    id: "2",
    name: "Pastel Desk Set",
    description: "Organize with gentle vibes",
    longDescription: "Keep your sanctuary tidy with this adorable 6-piece desk organizer set. Featuring rounded edges, matte pastel finishes, and modular pieces that can be arranged your way. Perfect for pens, sticky notes, clips, and all your little desk treasures.",
    price: 36,
    images: [productOrganizer],
    rating: 4.8,
    reviewCount: 189,
    tag: "New",
    category: "Organization",
    variants: [
      { id: "pastel-mix", name: "Pastel Mix", color: "#E8D4D4", inStock: true },
      { id: "all-cream", name: "All Cream", color: "#F5F0E8", inStock: true },
      { id: "mint-blush", name: "Mint & Blush", color: "#C4D4C4", inStock: true },
    ],
    features: [
      "6 modular pieces included",
      "Matte finish, no fingerprints",
      "Rounded safety edges",
      "Stackable design",
      "Weighted base for stability",
    ],
    reviews: [
      {
        id: "r1",
        author: "Ivy T.",
        rating: 5,
        date: "3 weeks ago",
        title: "So cute I bought two!",
        content: "One for my desk, one for my vanity. The colors are even prettier in person and they hold so much more than expected.",
        verified: true,
        helpful: 28,
      },
    ],
  },
  {
    id: "3",
    name: "Lavender Dreams Candle",
    description: "Calm in every flicker",
    longDescription: "Unwind with our signature scent blend of French lavender, vanilla bean, and a whisper of chamomile. Hand-poured with natural soy wax and a wooden wick that crackles softly as it burns. 45+ hour burn time.",
    price: 28,
    images: [productCandle],
    rating: 4.9,
    reviewCount: 312,
    tag: "Reorder Fave",
    category: "Scents",
    variants: [
      { id: "lavender", name: "Lavender Dreams", color: "#C4B7D4", inStock: true },
      { id: "vanilla", name: "Vanilla Cloud", color: "#F5E6D3", inStock: true },
      { id: "cotton", name: "Cotton Candy", color: "#F5C6D0", inStock: true },
      { id: "midnight", name: "Midnight Jasmine", color: "#2D2D4D", inStock: true },
    ],
    features: [
      "100% natural soy wax",
      "Wooden wick with soft crackle",
      "45+ hour burn time",
      "Reusable glass jar",
      "Hand-poured in small batches",
    ],
    reviews: [
      {
        id: "r1",
        author: "Aurora B.",
        rating: 5,
        date: "1 week ago",
        title: "My 4th reorder!!",
        content: "I literally cannot have a desk session without this candle burning. The lavender is calming but not overpowering, and the wooden wick sound is ASMR for my soul.",
        verified: true,
        helpful: 89,
      },
    ],
  },
  {
    id: "4",
    name: "Calm Touch Fidget Set",
    description: "Soothe your busy mind",
    longDescription: "A curated set of 5 tactile comfort objects designed to help regulate anxiety and improve focus. Featuring silicone poppers, smooth worry stones, and satisfying click buttons. Desk-friendly and whisper-quiet.",
    price: 24,
    images: [productFidget],
    rating: 4.7,
    reviewCount: 156,
    category: "Comfort",
    variants: [
      { id: "pink", name: "Blush Pink", color: "#E8B4B8", inStock: true },
      { id: "lavender", name: "Lavender", color: "#C4B7D4", inStock: true },
      { id: "mint", name: "Mint", color: "#B8D4C4", inStock: true },
    ],
    features: [
      "5 unique tactile pieces",
      "Whisper-quiet design",
      "Food-grade silicone",
      "Travel pouch included",
      "Designed with therapists",
    ],
    reviews: [
      {
        id: "r1",
        author: "Clover J.",
        rating: 5,
        date: "2 weeks ago",
        title: "Actually helps me focus",
        content: "I have ADHD and these are so much better than the cheap fidgets I've tried before. They're quiet enough for meetings and actually really cute on my desk.",
        verified: true,
        helpful: 64,
      },
    ],
  },
];

export const getProductById = (id: string): Product | undefined => {
  return products.find((p) => p.id === id);
};

export const getRelatedProducts = (currentId: string, limit = 3): Product[] => {
  return products.filter((p) => p.id !== currentId).slice(0, limit);
};
