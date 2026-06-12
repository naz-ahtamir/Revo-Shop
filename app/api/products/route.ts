import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit") || "20";

    const url = `https://api.escuelajs.co/api/v1/products?limit=${limit}`;
    const response = await fetch(url);

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
    }

    const platziProducts = await response.json() as Array<{
      id: number;
      title: string;
      description: string;
      price: number;
      images: string[];
      category: { name: string };
    }>;

    const transformed = platziProducts.map((p) => ({
      id: p.id,
      slug: `${p.title.toLowerCase().replace(/\s+/g, "-")}-${p.id}`,
      name: p.title,
      category: p.category?.name || "General",
      description: p.description,
      specs: { Category: p.category?.name, Price: `$${p.price}` },
      features: ["Quality assured", "Fast shipping", "30-day guarantee"],
      price: Math.floor(p.price * 16000),
      originalPrice: Math.floor(p.price * 16000 * 1.2),
      stock: Math.floor(Math.random() * 500) + 10,
      rating: 4 + Math.random(),
      reviews: Math.floor(Math.random() * 300) + 20,
      imageUrl: p.images?.[0] || "/images/products/placeholder.svg",
      featured: Math.random() > 0.7,
      badge: null,
    }));

    return NextResponse.json(transformed);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
