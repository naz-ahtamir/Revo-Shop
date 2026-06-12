import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createUser, getUserByEmail } from "@/lib/data";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name } = body as {
      email?: string;
      password?: string;
      name?: string;
    };

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Semua field wajib diisi" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password minimal 6 karakter" },
        { status: 400 }
      );
    }

    if (getUserByEmail(email)) {
      return NextResponse.json({ error: "Email sudah terdaftar" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    createUser({
      email: email.toLowerCase().trim(),
      passwordHash,
      name: name.trim(),
      role: "USER",
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Registrasi gagal" }, { status: 500 });
  }
}
