const mongoose = require("mongoose");
const Product = require("./Models/productModel");
require("dotenv").config();

// Sample products
const sampleProducts = [
  {
    name: "Girls Radiant Foundation",
    description: "Premium radiant foundation for flawless, glowing coverage. Perfect for all skin types.",
    price: 450,
    category: "Foundation",
    image: "/images/Girls Radiant Foundation.webp",
    stock: 50,
    brand: "Blush & Bloom",
    rating: 4.8,
    reviews: 125,
    featured: true
  },
  {
    name: "Velvet Lipstick",
    description: "Long-lasting velvet finish lipstick in stunning shades. Highly pigmented formula.",
    price: 280,
    category: "Lipstick",
    image: "/images/lipstick.jpg",
    stock: 75,
    brand: "Blush & Bloom",
    rating: 4.9,
    reviews: 200,
    featured: true
  },
  {
    name: "Eyeshadow Palette",
    description: "Professional eyeshadow palette with stunning shades for every occasion.",
    price: 500,
    category: "Eyeshadow",
    image: "/images/eyeshadow.jpg",
    stock: 40,
    brand: "Blush & Bloom",
    rating: 4.7,
    reviews: 89,
    featured: true
  },
  {
    name: "Hydrating Face Serum",
    description: "Deep hydration serum enriched with vitamins for glowing, healthy skin.",
    price: 420,
    category: "Skincare",
    image: "/images/serum.jpg",
    stock: 60,
    brand: "Blush & Bloom",
    rating: 4.9,
    reviews: 156,
    featured: true
  },
  {
    name: "Girls Long-Wear Eyeliner",
    description: "Waterproof, smudge-proof eyeliner that lasts all day and night.",
    price: 220,
    category: "Other",
    image: "/images/Girls Long-Wear Eyeliner.jpg",
    stock: 85,
    brand: "Blush & Bloom",
    rating: 4.6,
    reviews: 143,
    featured: false
  },
  {
    name: "Girls Lip Gloss",
    description: "High-shine lip gloss with moisturizing formula for luscious lips.",
    price: 240,
    category: "Lipstick",
    image: "/images/Girls Lip Gloss.jpg",
    stock: 90,
    brand: "Blush & Bloom",
    rating: 4.5,
    reviews: 167,
    featured: false
  },
  {
    name: "Boys Grooming Kit",
    description: "Complete grooming kit with essential tools for men's grooming needs.",
    price: 320,
    category: "Other",
    image: "/images/grooming kit.webp",
    stock: 30,
    brand: "Blush & Bloom",
    rating: 4.7,
    reviews: 67,
    featured: false
  },
  {
    name: "Boys Face Moisturizer",
    description: "Daily face moisturizer for men. Non-greasy formula for soft, smooth skin.",
    price: 480,
    category: "Skincare",
    image: "/images/Boys Face Moisturizer.jpg",
    stock: 70,
    brand: "Blush & Bloom",
    rating: 4.9,
    reviews: 189,
    featured: true
  },
  {
    name: "Girls Setting Powder",
    description: "Translucent setting powder for long-lasting, flawless makeup finish.",
    price: 380,
    category: "Other",
    image: "/images/Girls Setting Powder.jpg",
    stock: 45,
    brand: "Blush & Bloom",
    rating: 4.6,
    reviews: 112,
    featured: false
  },
  {
    name: "Unisex Makeup Brushes",
    description: "Professional makeup brush set with 10 premium quality brushes.",
    price: 500,
    category: "Other",
    image: "/images/Unisex Makeup Brushes.jpg",
    stock: 35,
    brand: "Blush & Bloom",
    rating: 4.8,
    reviews: 145,
    featured: true
  },
  {
    name: "Boys Beard Oil",
    description: "Premium beard oil for soft, manageable beards. Nourishing and conditioning.",
    price: 290,
    category: "Skincare",
    image: "/images/Boys Beard Oil.jpg",
    stock: 55,
    brand: "Blush & Bloom",
    rating: 4.6,
    reviews: 98,
    featured: false
  },
  {
    name: "Premium Foundation",
    description: "High-coverage foundation for a perfect, natural-looking complexion.",
    price: 520,
    category: "Foundation",
    image: "/images/foundation.jpg",
    stock: 48,
    brand: "Blush & Bloom",
    rating: 4.8,
    reviews: 134,
    featured: true
  }
];

// Connect to MongoDB and add products
async function addProducts() {
  try {
    console.log("🔄 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ Connected to MongoDB\n");

    console.log("🗑️  Clearing existing products...");
    await Product.deleteMany({});
    console.log("✅ Cleared existing products\n");

    console.log("📦 Adding sample products...");
    for (const product of sampleProducts) {
      const newProduct = await Product.create(product);
      console.log(`✓ Added: ${newProduct.name} (₹${newProduct.price})`);
    }

    console.log(`\n✅ Successfully added ${sampleProducts.length} products!`);
    console.log("\n🎉 You can now view the products on your website!");
    console.log("   Go to: http://localhost:3000/products\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

addProducts();
