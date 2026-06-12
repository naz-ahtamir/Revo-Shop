import { fetchProducts } from "@/lib/data";
import { ProductAdminClient } from "@/components/admin/ProductAdminClient";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await fetchProducts();
  
  // Transform ApiProduct to Product format for admin
  const transformedProducts = products.map((p) => ({
    id: p.id,
    name: p.title,
    slug: p.slug || p.title.toLowerCase().replace(/\s+/g, "-"),
    price: p.price,
    description: p.description,
    imageUrl: p.images[0] || "https://placehold.co/600x400",
    category: p.category.name, // Extract name from category object
    creationAt: p.creationAt,
    updatedAt: p.updatedAt,
    // Add required Product properties with defaults
    stock: 100, // Default stock since API doesn't provide
    rating: 4.5,
    reviews: 0,
    features: [], // Empty features array
    specs: {}, // Empty specs object
    featured: false,
    badge: null,
  }));
  
  return <ProductAdminClient initialProducts={transformedProducts} />;
}