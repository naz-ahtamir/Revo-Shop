import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import type { Order, StoreSettings, User, ApiProduct, Product } from "./types";

const DATA_DIR = join(process.cwd(), "data");
const API_BASE = "https://api.escuelajs.co/api/v1";

// ===== PLATZI API =====
export async function fetchProducts(): Promise<ApiProduct[]> {
  const res = await fetch(`${API_BASE}/products`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export async function fetchProductBySlug(slug: string): Promise<ApiProduct | undefined> {
  const products = await fetchProducts();
  return products.find((p) => p.slug === slug);
}

// ===== LOCAL JSON =====
function readJson<T>(filename: string): T {
  const raw = readFileSync(join(DATA_DIR, filename), "utf-8");
  return JSON.parse(raw) as T;
}

function writeJson<T>(filename: string, data: T): void {
  writeFileSync(join(DATA_DIR, filename), JSON.stringify(data, null, 2), "utf-8");
}

// ===== ADMIN PRODUCTS (LOCAL) =====
export function getProducts(): Product[] {
  return readJson<Product[]>("products.json");
}

export function saveProducts(products: Product[]): void {
  writeJson("products.json", products);
}

export function getUsers(): User[] {
  return readJson<User[]>("users.json");
}

export function getUserByEmail(email: string): User | undefined {
  return getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function saveUsers(users: User[]): void {
  writeJson("users.json", users);
}

export function createUser(user: Omit<User, "id"> & { id?: string }): User {
  const users = getUsers();
  const id = user.id ?? String(Math.max(0, ...users.map((u) => parseInt(u.id, 10) || 0)) + 1);
  const newUser: User = { ...user, id } as User;
  users.push(newUser);
  saveUsers(users);
  return newUser;
}

export function getOrders(): Order[] {
  return readJson<Order[]>("orders.json");
}

export function getSettings(): StoreSettings {
  return readJson<StoreSettings>("settings.json");
}

export function saveSettings(settings: StoreSettings): void {
  writeJson("settings.json", settings);
}

export { categories, testimonials, faqs } from "./constants";