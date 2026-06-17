"use client";

import { useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import { toast } from "sonner";

type UserRole = "USER" | "ADMIN";

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

const fetcher = (url: string) => fetch(url).then((res) => {
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
});

export function UsersAdminClient() {
  const { mutate } = useSWRConfig();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    role: "USER" as UserRole,
    password: "",
  });

  const { data: users, error, isLoading } = useSWR<User[]>("/api/admin/users", fetcher, {
    revalidateOnFocus: false,
  });

  function handleEdit(user: User) {
    setEditingId(user.id);
    setFormData({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      password: "",
    });
  }

  function handleCancelEdit() {
    setEditingId(null);
    setFormData({
      id: "",
      name: "",
      email: "",
      role: "USER",
      password: "",
    });
  }

  async function handleSave() {
    if (!formData.name || !formData.email) {
      toast.error("Name and email are required");
      return;
    }

    try {
      const res = await fetch("/api/admin/users", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to save user");
      }

      toast.success(editingId ? "User updated" : "User created");
      handleCancelEdit();
      mutate("/api/admin/users");
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to save user");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const res = await fetch(`/api/admin/users?id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete user");

      toast.success("User deleted");
      mutate("/api/admin/users");
    } catch (error) {
      toast.error("Failed to delete user");
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">Loading users...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center text-red-600">Failed to load users</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--black)]">Users Management</h1>
        <button
          type="button"
          onClick={() => {
            setEditingId("new");
            setFormData({
              id: "",
              name: "",
              email: "",
              role: "USER",
              password: "",
            });
          }}
          className="btn btn-primary"
        >
          Add New User
        </button>
      </div>

      {/* Form */}
      {editingId && (
        <div className="rounded-2xl border border-[var(--gray-200)] bg-white p-6">
          <h2 className="mb-4 text-lg font-bold text-[var(--black)]">
            {editingId === "new" ? "Create New User" : "Edit User"}
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-[var(--black)]">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full rounded-lg border border-[var(--gray-200)] px-4 py-2"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-[var(--black)]">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full rounded-lg border border-[var(--gray-200)] px-4 py-2"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-[var(--black)]">
                Role
              </label>
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    role: e.target.value as UserRole,
                  })
                }
                className="w-full rounded-lg border border-[var(--gray-200)] px-4 py-2"
              >
                <option value="USER">User</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-[var(--black)]">
                Password {editingId !== "new" && "(leave blank to keep current)"}
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full rounded-lg border border-[var(--gray-200)] px-4 py-2"
                placeholder={editingId !== "new" ? "••••••••" : ""}
              />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={handleSave}
              className="btn btn-primary"
            >
              Save
            </button>
            <button
              type="button"
              onClick={handleCancelEdit}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="rounded-2xl border border-[var(--gray-200)] bg-white overflow-hidden">
        <table className="w-full">
          <thead className="bg-[var(--gray-50)]">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-[var(--black)]">
                Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-[var(--black)]">
                Email
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-[var(--black)]">
                Role
              </th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-[var(--black)]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--gray-200)]">
            {users?.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 text-sm text-[var(--black)]">
                  {user.name}
                </td>
                <td className="px-6 py-4 text-sm text-[var(--black)]">
                  {user.email}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                      user.role === "ADMIN"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-right text-sm">
                  <button
                    type="button"
                    onClick={() => handleEdit(user)}
                    className="text-[var(--orange)] hover:underline mr-4"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(user.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users?.length === 0 && (
          <div className="py-12 text-center text-[var(--gray-500)]">
            No users found
          </div>
        )}
      </div>
    </div>
  );
}