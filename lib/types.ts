export type UserRole = "USER" | "ADMIN";

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: UserRole;
}

export type ApiCategory = {
  id: number;
  name: string;
  slug: string;
  image: string;
  creationAt: string;
  updatedAt: string;
};

export type ApiProduct = {
  id: number;
  title: string;
  slug: string;
  price: number;
  description: string;
  category: ApiCategory;
  images: string[];
  creationAt: string;
  updatedAt: string;
};

// ===== TAMBAHKAN INI DI BAWAHNYA UNTUK MENYEMBUHKAN ERROR COMPONENT =====
export type Product = Omit<ApiProduct, "title" | "images" | "category"> & {
  name: string;       // Menggantikan 'title' agar UI Admin tidak error
  imageUrl: string;   // Menggantikan 'images' agar Image Next.js tidak error
  category: string;   // Menggantikan category object dengan string
  // Tambahkan properti opsional jika komponen admin Anda membutuhkannya:
  stock?: number;
  rating?: number;
  reviews?: number;
  features?: string[];
  specs?: Record<string, string>;
  featured?: boolean;
  badge?: string | null;
};

export interface Order {
  id: string;
  customer: string;
  product: string;
  qty: number;
  total: number;
  status: "Delivered" | "Processing" | "Shipped" | "Pending";
  date: string;
}

export interface StoreSettings {
  storeName: string;
  currency: string;
  taxRate: string;
  defaultShipping: string;
}

export interface CartItem {
  id: number;
  name: string;
  category: string;
  price: number;
  imageUrl: string;
  qty: number;
}
