"use client";

import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { StoreSettings } from "@/lib/types";

interface SettingsFormProps {
  initial: StoreSettings;
}

export function SettingsForm({ initial }: SettingsFormProps) {
  const { register, handleSubmit, formState: { isSubmitting, errors } } = useForm<StoreSettings>({
    defaultValues: initial
  });

  const onSubmit = async (data: StoreSettings) => {
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        toast.success("Settings saved successfully");
      } else {
        toast.error("Failed to save settings");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error saving settings");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Store Name
        </label>
        <input
          type="text"
          {...register("storeName", { required: "Store name is required" })}
          className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 focus:border-[#8141E6] outline-none"
        />
        {errors.storeName && <p className="mt-1 text-xs text-red-600">{errors.storeName.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Currency
        </label>
        <input
          type="text"
          {...register("currency", { required: "Currency is required" })}
          className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 focus:border-[#8141E6] outline-none"
        />
        {errors.currency && <p className="mt-1 text-xs text-red-600">{errors.currency.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Tax Rate (%)
        </label>
        <input
          type="text"
          {...register("taxRate", { required: "Tax rate is required" })}
          className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 focus:border-[#8141E6] outline-none"
        />
        {errors.taxRate && <p className="mt-1 text-xs text-red-600">{errors.taxRate.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Default Shipping Cost
        </label>
        <input
          type="text"
          {...register("defaultShipping", { required: "Default shipping is required" })}
          className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 focus:border-[#8141E6] outline-none"
        />
        {errors.defaultShipping && <p className="mt-1 text-xs text-red-600">{errors.defaultShipping.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded bg-[#8141E6] px-6 py-2 font-semibold text-white hover:bg-[#6b35cc] disabled:opacity-50"
      >
        {isSubmitting ? "Saving..." : "Save Settings"}
      </button>
    </form>
  );
}
