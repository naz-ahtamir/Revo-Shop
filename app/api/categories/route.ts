import { NextResponse } from "next/server";

const PLATZI_API = "https://api.escuelajs.co/api/v1";

interface PlatziCategory {
  id: number;
  name: string;
  image: string;
}

export async function GET() {
  try {
    const response = await fetch(`${PLATZI_API}/categories`);

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch categories" },
        { status: 500 }
      );
    }

    const categories = await response.json();

    // Transform Platzi categories
    const transformed = categories.map((cat: PlatziCategory) => ({
      id: cat.id,
      name: cat.name,
      image: cat.image || "/images/products/placeholder.svg",
    }));

    return NextResponse.json(transformed);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
