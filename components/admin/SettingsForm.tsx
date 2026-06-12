"use client";

import { useState } from "react";
import type { StoreSettings } from "@/lib/types";
import { toast } from "sonner";

export function SettingsForm({ initial }: { initial: StoreSettings }) {
  const [settings, setSettings] = useState(initial);
  const [loading, setLoading] = useState(false);

  const save = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setLoading(false);
    if (!res.ok) {
      toast.error("Gagal menyimpan");
      return;
    }
    toast.success("Settings saved!");
  };

  return (
    <div className="max-w-lg rounded-2xl border border-[var(--gray-200)] bg-white p-6">
      <h2 className="mb-4 font-bold text-[var(--black)]">Store Settings</h2>
      <div className="space-y-4">
        {(
          [
            ["storeName", "Store Name"],
            ["currency", "Currency"],
            ["taxRate", "Tax Rate"],
            ["defaultShipping", "Default Shipping"],
          ] as const
        ).map(([key, label]) => (
          <div key={key}>
            <label className="mb-1 block text-sm text-[var(--black)]">{label}</label>
            <input
              value={settings[key]}
              onChange={(e) => setSettings({ ...settings, [key]: e.target.value })}
              className="w-full rounded-lg border px-3 py-2 text-sm text-[var(--black)]"
            />
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={save}
        disabled={loading}
        className="btn btn-primary btn-sm mt-6"
      >
        {loading ? "Saving..." : "Save Settings"}
      </button>
    </div>
  );
}
