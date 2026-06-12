import { auth } from "@/auth";
import { getSettings, saveSettings } from "@/lib/data";
import type { StoreSettings } from "@/lib/types";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(getSettings());
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as StoreSettings;
  saveSettings(body);
  return NextResponse.json(body);
}
