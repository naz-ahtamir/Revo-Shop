import { auth } from "@/auth";
import { fetchProducts } from "@/lib/data";
import { NextResponse } from "next/server";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return null;
  }
  return session;
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const products = await fetchProducts();
    
    // Transform to Product format
    const transformed = products.map((p) => ({
      id: p.id,
      name: p.title,
      slug: p.slug || p.title.toLowerCase().replace(/\s+/g, "-"),
      price: p.price,
      description: p.description,
      imageUrl: p.images[0] || "https://placehold.co/600x400",
      category: p.category.name, // Extract name from category object
      creationAt: p.creationAt,
      updatedAt: p.updatedAt,
    }));
    
    return NextResponse.json(transformed);
  } catch {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    
    // FAKE CREATE - just return success with fake ID
    // In reality, Platzi API doesn't persist this
    const fakeProduct = {
      id: Date.now(), // Fake ID
      name: body.name ?? "",
      slug: (body.name ?? "").toLowerCase().replace(/\s+/g, "-"),
      price: Number(body.price) || 0,
      description: body.description ?? "",
      imageUrl: body.imageUrl ?? "https://placehold.co/600x400",
      category: body.category ?? "Other", // String category
      creationAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    return NextResponse.json(fakeProduct);
  } catch {
    return NextResponse.json({ error: "Failed to save product" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    
    // FAKE UPDATE - just return success
    const updated = {
      ...body,
      updatedAt: new Date().toISOString(),
    };
    
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = Number(searchParams.get("id"));
  if (!id) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  // FAKE DELETE - just return success
  return NextResponse.json({ success: true });
}