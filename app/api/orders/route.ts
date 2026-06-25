import { NextRequest, NextResponse } from "next/server";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import type { Order } from "@/lib/types";

const ordersPath = join(process.cwd(), "data", "orders.json");

function getOrders(): Order[] {
  try {
    const data = readFileSync(ordersPath, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function saveOrders(orders: Order[]) {
  try {
    writeFileSync(ordersPath, JSON.stringify(orders, null, 2));
  } catch {
    // Vercel filesystem read-only — silent fail, acceptable for demo
  }
}

export async function GET() {
  try {
    const orders = getOrders();
    return NextResponse.json(orders);
  } catch {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  try {
    // Extract order data from checkout payload
    const { customerId, items, shippingAddress, subtotal, shipping, tax, total } = body;

    if (!customerId || !items || items.length === 0 || !shippingAddress) {
      return NextResponse.json(
        { error: "Missing required fields: customerId, items, and shippingAddress are required" },
        { status: 400 }
      );
    }

    // Create order object
    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      customer: customerId,
      product: items.map((i: any) => i.name).join(", "), // Concatenate item names
      qty: items.reduce((sum: number, item: any) => sum + item.qty, 0),
      total: Number(total),
      status: "Pending",
      date: new Date().toISOString(),
    };

    const orders = getOrders();
    orders.push(newOrder);
    saveOrders(orders);

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
