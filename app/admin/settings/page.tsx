import { getSettings } from "@/lib/data";
import { SettingsForm } from "@/components/admin/SettingsForm";

export const dynamic = "force-dynamic";

export default function AdminSettingsPage() {
  const settings = getSettings();

  return (
    <>
      <h1 className="mb-8 font-[family-name:var(--font-montserrat)] text-2xl font-extrabold uppercase text-[var(--black)]">
        Settings
      </h1>
      <SettingsForm initial={settings}/>
    </>
  );
}
