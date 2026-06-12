"use client";

import { useState } from "react";
import { faqs } from "@/lib/constants";

export function FaqClient() {
  const tabs = Object.keys(faqs);
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const items = faqs[activeTab] ?? [];

  return (
    <div className="container-page py-10">
      <div className="mb-10 text-center">
        <p className="subheading">Help Center</p>
        <h1 className="display-md mt-2 text-[var(--black)]">Frequently Asked Questions</h1>
      </div>
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {tabs.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => {
              setActiveTab(t);
              setOpenIndex(null);
            }}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
              activeTab === t
                ? "bg-[var(--orange)] text-white"
                : "bg-[var(--gray-100)] text-[var(--black)] hover:bg-[var(--orange-pale)]"
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="mx-auto max-w-2xl">
        {items.map((item, i) => (
          <div
            key={item.q}
            className="mb-3 overflow-hidden rounded-xl border border-[var(--gray-200)] bg-white"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="flex w-full items-center justify-between px-5 py-4 text-left font-semibold text-[var(--black)]"
            >
              {item.q}
              <span className="text-xl text-[var(--orange)]">{openIndex === i ? "−" : "+"}</span>
            </button>
            {openIndex === i && (
              <div className="border-t border-[var(--gray-100)] px-5 py-4 text-sm text-[var(--black)]">
                {item.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
