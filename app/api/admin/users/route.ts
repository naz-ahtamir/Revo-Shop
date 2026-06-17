import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import bcrypt from "bcryptjs";
import type { User } from "@/lib/types";

const usersPath = join(process.cwd(), "data", "users.json");

function getUsers(): User[] {
  const data = readFileSync(usersPath, "utf-8");
  return JSON.parse(data);
}

function saveUsers(users: User[]) {
  writeFileSync(usersPath, JSON.stringify(users, null, 2));
}

// GET - Get all users
export async function GET() {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const users = getUsers();
    // Don't send password hashes to client
    const safeUsers = users.map(({ passwordHash, ...rest }) => rest);
    return NextResponse.json(safeUsers);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// POST - Create new user
export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { email, name, password, role = "USER" } = body;

    if (!email || !name || !password) {
      return NextResponse.json(
        { error: "Email, name, and password are required" },
        { status: 400 }
      );
    }

    const users = getUsers();

    // Check if user already exists
    if (users.some((u) => u.email === email)) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      name,
      passwordHash,
      role,
    };

    users.push(newUser);
    saveUsers(users);

    const { passwordHash: _, ...safeUser } = newUser;
    return NextResponse.json(safeUser, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}

// PUT - Update user
export async function PUT(req: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, email, name, password, role } = body;

    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const users = getUsers();
    const userIndex = users.findIndex((u) => u.id === id);

    if (userIndex === -1) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update user fields
    if (email) users[userIndex].email = email;
    if (name) users[userIndex].name = name;
    if (role) users[userIndex].role = role;
    if (password) {
      users[userIndex].passwordHash = await bcrypt.hash(password, 10);
    }

    saveUsers(users);

    const { passwordHash: _, ...safeUser } = users[userIndex];
    return NextResponse.json(safeUser);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

// DELETE - Delete user
export async function DELETE(req: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const users = getUsers();
    const filteredUsers = users.filter((u) => u.id !== id);

    if (filteredUsers.length === users.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    saveUsers(filteredUsers);
    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
