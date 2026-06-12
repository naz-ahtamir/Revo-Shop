import { NextRequest, NextResponse } from "next/server";
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
