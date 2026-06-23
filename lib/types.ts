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

export type Product = Omit<ApiProduct, "title" | "images" | "category"> & {
  name: string;       // Menggantikan 'title' agar UI Admin tidak error
  imageUrl: string;   // Menggantikan 'images' agar Image Next.js tidak error
  category: string;   // Menggantikan category object dengan string
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

// Zod schema for StoreSettings validation
import { z } from "zod";

export const storeSettingsSchema = z.object({
  storeName: z.string().min(1, "Store name is required"),
  currency: z.string().min(1, "Currency is required"),
  taxRate: z.string().min(1, "Tax rate is required"),
  defaultShipping: z.string().min(1, "Default shipping is required"),
});

export const userSchema = z.object({
  email: z.string().email("Invalid email format"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["USER", "ADMIN"]).default("USER"),
});

export const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  slug: z.string().optional(),
  price: z.number().positive("Price must be positive"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  imageUrl: z.string().optional(),
  category: z.string().min(1, "Category is required"),
});

export type StoreSettingsInput = z.infer<typeof storeSettingsSchema>;
export type UserInput = z.infer<typeof userSchema>;
export type ProductInput = z.infer<typeof productSchema>;

export interface CartItem {
  id: number;
  name: string;
  category: string;
  price: number;
  imageUrl: string;
  qty: number;
}
