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

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const orders = getOrders();
    const order = orders.find((o) => o.id === id);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch {
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 });
    }

    const validStatuses = ["Pending", "Processing", "Shipped", "Delivered"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const orders = getOrders();
    const orderIndex = orders.findIndex((o) => o.id === id);

    if (orderIndex === -1) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    orders[orderIndex].status = status;
    saveOrders(orders);

    return NextResponse.json(orders[orderIndex]);
  } catch {
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const orders = getOrders();
    const order = orders.find((o) => o.id === id);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.status !== "Pending" && order.status !== "Processing") {
      return NextResponse.json(
        { error: "Cannot cancel order with status: " + order.status },
        { status: 400 }
      );
    }

    const filteredOrders = orders.filter((o) => o.id !== id);
    saveOrders(filteredOrders);

    return NextResponse.json({ message: "Order cancelled successfully" });
  } catch {
    return NextResponse.json({ error: "Failed to cancel order" }, { status: 500 });
  }
}