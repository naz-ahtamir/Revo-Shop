import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { readFileSync } from "fs";
import { join } from "path";
import type { Order } from "@/lib/types";

const ordersPath = join(process.cwd(), "data", "orders.json");

function getOrders(): Order[] {
  const data = readFileSync(ordersPath, "utf-8");
  return JSON.parse(data);
}

// GET - Get all orders for admin
export async function GET(req: NextRequest) {
  try {
    // Check authentication - orders admin endpoint requires admin role
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    let orders = getOrders();

    // Filter by status if provided
    if (status) {
      orders = orders.filter((o) => o.status === status);
    }

    // Sort by date (newest first)
    orders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
