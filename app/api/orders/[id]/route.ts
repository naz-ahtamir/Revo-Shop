import { NextRequest, NextResponse } from "next/server";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import type { Order } from "@/lib/types";

const ordersPath = join(process.cwd(), "data", "orders.json");

function getOrders(): Order[] {
  const data = readFileSync(ordersPath, "utf-8");
  return JSON.parse(data);
}

function saveOrders(orders: Order[]) {
  writeFileSync(ordersPath, JSON.stringify(orders, null, 2));
}

// GET - Get order by ID
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
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}

// PUT - Update order status
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 }
      );
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
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}

// DELETE - Cancel order
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

    // Only allow cancellation if order is Pending or Processing
    if (order.status !== "Pending" && order.status !== "Processing") {
      return NextResponse.json(
        { error: "Cannot cancel order with status: " + order.status },
        { status: 400 }
      );
    }

    const filteredOrders = orders.filter((o) => o.id !== id);
    saveOrders(filteredOrders);

    return NextResponse.json({ message: "Order cancelled successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to cancel order" },
      { status: 500 }
    );
  }
}
