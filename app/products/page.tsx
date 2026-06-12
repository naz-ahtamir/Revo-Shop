import { ProductsListing } from "@/components/ProductsListing";
import { fetchProducts } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = await fetchProducts();

  return <ProductsListing initialProducts={products} />;
}