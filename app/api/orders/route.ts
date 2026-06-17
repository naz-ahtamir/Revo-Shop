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
  try {
    const body = await req.json();
    const { customer, product, qty, total } = body;

    if (!customer || !product || !qty || !total) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const orders = getOrders();
    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      customer,
      product,
      qty: Number(qty),
      total: Number(total),
      status: "Pending",
      date: new Date().toISOString(),
    };

    orders.push(newOrder);
    saveOrders(orders);

    return NextResponse.json(newOrder, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}