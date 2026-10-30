"use client";

import { Printer } from "lucide-react";

export function PrintButton({ label = "Print / Save as PDF" }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="btn-primary no-print !py-3 text-[12px]"
    >
      <Printer className="h-4 w-4" />
      {label}
    </button>
  );
}
