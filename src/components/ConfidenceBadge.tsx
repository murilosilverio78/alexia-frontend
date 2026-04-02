import type { ConsultaResponse, HistoricoItem } from "../types";

type Nivel = ConsultaResponse["nivel_confianca"] | HistoricoItem["nivel_confianca"];

const styleMap: Record<NonNullable<Nivel>, string> = {
  Alta: "text-emerald-700",
  Média: "text-amber-700",
  Baixa: "text-rose-700",
};

export function ConfidenceBadge({ nivel }: { nivel?: Nivel }) {
  if (!nivel) {
    return null;
  }

  return (
    <span className={`text-sm font-semibold ${styleMap[nivel]}`}>
      Confianca {nivel}
    </span>
  );
}
