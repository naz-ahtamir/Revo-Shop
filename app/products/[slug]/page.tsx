import { notFound } from "next/navigation";
import { fetchProductBySlug, fetchProducts } from "@/lib/data";
import { ProductDetail } from "@/components/ProductDetail";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug);
  if (!product) notFound();

  const allProducts = await fetchProducts();
  const related = allProducts
    .filter((p) => p.category.name === product.category.name && p.id !== product.id)
    .slice(0, 4);

  return <ProductDetail product={product} related={related} />;
}