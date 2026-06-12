"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Product } from "@/lib/types";
import { fmtUsd } from "@/lib/format";
import { toast } from "sonner";

interface ProductAdminClientProps {
  initialProducts: Product[];
}

const emptyProduct = (): Partial<Product> & { isNew: boolean } => ({
  isNew: true,
  slug: "",
  name: "",
  category: "Safety Helmet",
  description: "",
  specs: {},
  features: [],
  price: 0,
  stock: 0,
  rating: 4.5,
  reviews: 0,
  imageUrl: "/images/products/placeholder.svg",
  featured: false,
  badge: null,
});

export function ProductAdminClient({ initialProducts }: ProductAdminClientProps) {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts);
  const [editing, setEditing] = useState<(Partial<Product> & { isNew?: boolean }) | null>(null);
  const [specsText, setSpecsText] = useState("");
  const [featuresText, setFeaturesText] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [prevImagePreview, setPrevImagePreview] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (prevImagePreview) {
        URL.revokeObjectURL(prevImagePreview);
      }
    };
  }, [prevImagePreview]);

  const openEdit = (p: Product) => {
    setEditing({ ...p, isNew: false });
    setSpecsText(JSON.stringify(p.specs || {}, null, 2));
    setFeaturesText((p.features || []).join("\n"));
  };

  const openNew = () => {
    setEditing(emptyProduct());
    setSpecsText("{}");
    setFeaturesText("");
    setImageFile(null);
  };

  const cancel = () => {
    if (prevImagePreview) {
      URL.revokeObjectURL(prevImagePreview);
      setPrevImagePreview(null);
    }
    setEditing(null);
    setImageFile(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Invalid file type. Only JPEG, PNG, GIF, and WebP allowed");
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("File size exceeds 5MB limit");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    if (prevImagePreview) {
      URL.revokeObjectURL(prevImagePreview);
    }
    setPrevImagePreview(previewUrl);

    setImageFile(file);
    setEditing((prev) => ({ ...prev, imageUrl: previewUrl }));
  };

  const save = async () => {
    if (!editing) return;
    let specs: Record<string, string> = {};
    try {
      specs = JSON.parse(specsText || "{}");
    } catch {
      toast.error("Specs harus JSON valid");
      return;
    }

    let imageUrl = editing.imageUrl || "/images/products/placeholder.svg";
    if (imageFile) {
      const formData = new FormData();
      formData.append("file", imageFile);
      const res = await fetch("/api/admin/upload-image", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const error = await res.json();
        toast.error(error.error || "Failed to upload image");
        return;
      }
      const data = await res.json();
      imageUrl = data.url;
    }

    const body = {
      ...editing,
      specs,
      features: featuresText.split("\n").filter(Boolean),
      price: Number(editing.price),
      stock: Number(editing.stock),
      rating: Number(editing.rating),
      reviews: Number(editing.reviews),
      imageUrl,
    };
    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      toast.error("Gagal menyimpan produk");
      return;
    }
    toast.success("Produk disimpan");
    setEditing(null);
    setImageFile(null);
    router.refresh();
    const updated = await fetch("/api/admin/products").then((r) => r.json());
    setProducts(updated);
  };

  const remove = async (id: number) => {
    if (!confirm("Hapus produk ini?")) return;
    const res = await fetch(`/api/admin/products?id=${id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("Gagal menghapus");
      return;
    }
    toast.success("Produk dihapus");
    setProducts((prev) => prev.filter((p) => p.id !== id));
    router.refresh();
  };

  return (
    <>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-[family-name:var(--font-montserrat)] text-2xl font-extrabold uppercase text-[var(--black)]">
          Products
        </h1>
        <button type="button" onClick={openNew} className="btn btn-primary btn-sm">
          + Add Product
        </button>
      </div>

      {editing && (
        <div className="mb-8 rounded-2xl border border-[var(--orange)] bg-white p-6">
          <h2 className="mb-4 font-bold text-[var(--black)]">
            {editing.isNew ? "New Product" : `Edit: ${editing.name}`}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              placeholder="Name"
              value={editing.name ?? ""}
              onChange={(e) => setEditing({ ...editing, name: e.target.value })}
              className="rounded border px-3 py-2 text-sm"
            />
            <input
              placeholder="Slug"
              value={editing.slug ?? ""}
              onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
              className="rounded border px-3 py-2 text-sm"
            />
            <input
              placeholder="Category"
              value={editing.category ?? ""}
              onChange={(e) => setEditing({ ...editing, category: e.target.value })}
              className="rounded border px-3 py-2 text-sm"
            />
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-medium text-[var(--black)]">Product Image</label>
              {editing.imageUrl && !imageFile && (
                <div className="mb-3 flex items-center gap-3">
                  <div className="relative h-20 w-20 overflow-hidden rounded-lg border border-[var(--gray-200)]">
                    <Image src={editing.imageUrl} alt="Current" fill className="object-contain" />
                  </div>
                  <span className="text-sm text-[var(--gray-600)]">{editing.imageUrl}</span>
                </div>
              )}
              {imageFile && (
                <div className="mb-3 flex items-center gap-3">
                  <div className="relative h-20 w-20 overflow-hidden rounded-lg border border-[var(--gray-200)]">
                    <Image src={URL.createObjectURL(imageFile)} alt="Preview" className="object-contain" />
                  </div>
                  <span className="text-sm text-[var(--gray-600)]">{imageFile.name}</span>
                </div>
              )}
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={handleImageUpload}
                  className="block w-full text-sm text-[var(--gray-600)] file:mr-4 file:rounded-lg file:border-0 file:bg-[var(--orange)] file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-[var(--orange-dark)] cursor-pointer"
                />
                <span className="text-xs text-[var(--gray-500)]">Max 5MB (JPG, PNG, GIF, WEBP)</span>
              </div>
            </div>
            <input
              type="number"
              placeholder="Price"
              value={editing.price ?? 0}
              onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })}
              className="rounded border px-3 py-2 text-sm"
            />
            <input
              type="number"
              placeholder="Stock"
              value={editing.stock ?? 0}
              onChange={(e) => setEditing({ ...editing, stock: Number(e.target.value) })}
              className="rounded border px-3 py-2 text-sm"
            />
            <textarea
              placeholder="Description"
              value={editing.description ?? ""}
              onChange={(e) => setEditing({ ...editing, description: e.target.value })}
              className="rounded border px-3 py-2 text-sm sm:col-span-2"
              rows={3}
            />
            <textarea
              placeholder="Specs (JSON)"
              value={specsText}
              onChange={(e) => setSpecsText(e.target.value)}
              className="rounded border px-3 py-2 font-mono text-xs sm:col-span-2"
              rows={4}
            />
            <textarea
              placeholder="Features (one per line)"
              value={featuresText}
              onChange={(e) => setFeaturesText(e.target.value)}
              className="rounded border px-3 py-2 text-sm sm:col-span-2"
              rows={3}
            />
            <label className="flex items-center gap-2 text-sm text-[var(--black)]">
              <input
                type="checkbox"
                checked={editing.featured ?? false}
                onChange={(e) => setEditing({ ...editing, featured: e.target.checked })}
              />
              Featured
            </label>
          </div>
          <div className="mt-4 flex gap-2">
            <button type="button" onClick={save} className="btn btn-primary btn-sm">
              Save
            </button>
            <button type="button" onClick={cancel} className="btn btn-secondary btn-sm">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-[var(--gray-200)] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--gray-50)] text-left text-xs uppercase text-[var(--black)]">
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-t border-[var(--gray-100)]">
                  <td className="px-4 py-3">
                    <div className="relative h-11 w-11 overflow-hidden rounded bg-[var(--gray-50)]">
                      {p.imageUrl && p.imageUrl.trim() !== "" ? (
                        <Image src={p.imageUrl} alt="" fill className="object-contain" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                          No Image
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="max-w-[200px] px-4 py-3 font-semibold text-[var(--black)]">{p.name}</td>
                  <td className="px-4 py-3">
                    <span className="badge badge-gray">{p.category}</span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-[var(--black)]">{fmtUsd(p.price)}</td>
                  <td className={`px-4 py-3 ${(p.stock ?? 0) < 100 ? "text-[var(--orange)] font-semibold" : "text-[var(--black)]"}`}>
                    {p.stock ?? 0}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(p)}
                        className="text-sm text-[var(--orange)] hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(p.id)}
                        className="text-sm text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
