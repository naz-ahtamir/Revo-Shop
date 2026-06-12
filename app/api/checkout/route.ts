import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import type { Order } from "@/lib/types";

const DATA_DIR = join(process.cwd(), "data");

interface CheckoutItem {
  id: number;
  name: string;
  price: number;
  qty: number;
}

interface CheckoutRequest {
  customerId: string;
  items: CheckoutItem[];
  shippingAddress: {
    fullName: string;
  };
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

function readOrders(): Order[] {
  const raw = readFileSync(join(DATA_DIR, "orders.json"), "utf-8");
  return JSON.parse(raw) as Order[];
}

function writeOrders(orders: Order[]): void {
  writeFileSync(join(DATA_DIR, "orders.json"), JSON.stringify(orders, null, 2), "utf-8");
}

export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = (await request.json()) as CheckoutRequest;

    // Validate order data
    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { error: "Invalid order items" },
        { status: 400 }
      );
    }

    if (!body.shippingAddress) {
      return NextResponse.json(
        { error: "Shipping address required" },
        { status: 400 }
      );
    }

    // Create order
    const orders = readOrders();
    const orderId = `ORD-${Date.now()}`;
    
    const newOrder: Order = {
      id: orderId,
      customer: body.shippingAddress.fullName || "Unknown",
      product: body.items.map((i: CheckoutItem) => i.name).join(", "),
      qty: body.items.reduce((sum: number, i: CheckoutItem) => sum + i.qty, 0),
      total: body.total || 0,
      status: "Pending",
      date: new Date().toISOString().split("T")[0],
    };

    orders.push(newOrder);
    writeOrders(orders);

    return NextResponse.json(
      {
        id: orderId,
        status: "success",
        message: "Order placed successfully",
        order: newOrder,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
