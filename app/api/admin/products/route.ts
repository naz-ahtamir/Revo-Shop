import { requireAdmin } from "@/lib/auth";
import { fetchProducts } from "@/lib/data";
import { productSchema } from "@/lib/types";
import { NextResponse } from "next/server";

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

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  // Convert price to number if it's a string
  if (body.price) {
    body.price = Number(body.price);
  }

  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { 
        error: "Validation failed", 
        details: parsed.error.format() 
      },
      { status: 400 }
    );
  }

  try {
    const validatedData = parsed.data;
    
    // FAKE CREATE - just return success with fake ID
    // In reality, Platzi API doesn't persist this
    const fakeProduct = {
      id: Date.now(), // Fake ID
      name: validatedData.name,
      slug: validatedData.slug || validatedData.name.toLowerCase().replace(/\s+/g, "-"),
      price: validatedData.price,
      description: validatedData.description,
      imageUrl: validatedData.imageUrl || "https://placehold.co/600x400",
      category: validatedData.category,
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

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  // Convert price to number if it's a string
  if (body.price) {
    body.price = Number(body.price);
  }

  // Use partial schema for updates (all fields optional except id)
  const { id, ...updateData } = body;
  
  if (!id) {
    return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
  }

  const updateSchema = productSchema.partial();
  const parsed = updateSchema.safeParse(updateData);
  
  if (!parsed.success) {
    return NextResponse.json(
      { 
        error: "Validation failed", 
        details: parsed.error.format() 
      },
      { status: 400 }
    );
  }

  try {
    // FAKE UPDATE - just return success
    const updated = {
      id,
      ...parsed.data,
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