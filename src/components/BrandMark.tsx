import { Scale } from "lucide-react";

export function BrandMark() {
  return (
    <div className="inline-flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-500 text-white shadow-lg shadow-brand-500/25">
        <Scale className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-brand-700">
          Sistema juridico de IA
        </p>
        <h1 className="text-xl font-extrabold tracking-tight text-slatewarm-950">
          Alexia
        </h1>
      </div>
    </div>
  );
}
