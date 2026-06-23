import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import bcrypt from "bcryptjs";
import { userSchema, type User } from "@/lib/types";

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
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const users = getUsers();
    // Don't send password hashes to client
    const safeUsers = users.map(({ passwordHash: _, ...rest }) => rest);
    return NextResponse.json(safeUsers);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// POST - Create new user
export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON payload" },
      { status: 400 }
    );
  }
  
  const parsed = userSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { 
        error: "Validation failed", 
        details: parsed.error.format() 
      },
      { status: 400 }
    );
  }

  try {
    const { email, name, password, role } = parsed.data;

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

    const { passwordHash: _pw, ...safeUser } = newUser;
    return NextResponse.json(safeUser, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}

// PUT - Update user
export async function PUT(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON payload" },
      { status: 400 }
    );
  }
  
  const { id, ...updateData } = body;

  if (!id) {
    return NextResponse.json(
      { error: "User ID is required" },
      { status: 400 }
    );
  }

  // Use partial schema for updates (all fields optional)
  const updateSchema = userSchema.partial();
  const parsed = updateSchema.safeParse(updateData);
  
  if (!parsed.success) {
    return NextResponse.json(
      { 
        error: "Validation failed", 
        details: parsed.error.format() 
      },
      { status: 400 }
    );
  }

  try {
    const users = getUsers();
    const userIndex = users.findIndex((u) => u.id === id);

    if (userIndex === -1) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const validatedData = parsed.data;
    
    // Update user fields
    if (validatedData.email) users[userIndex].email = validatedData.email;
    if (validatedData.name) users[userIndex].name = validatedData.name;
    if (validatedData.role) users[userIndex].role = validatedData.role;
    if (validatedData.password) {
      users[userIndex].passwordHash = await bcrypt.hash(validatedData.password, 10);
    }

    saveUsers(users);

    const { passwordHash: _pw2, ...safeUser } = users[userIndex];
    return NextResponse.json(safeUser);
  } catch {
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

// DELETE - Delete user
export async function DELETE(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
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
  } catch {
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
