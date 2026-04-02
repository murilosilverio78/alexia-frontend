import type { ConsultaResponse, HistoricoItem } from "../types";

type Status = ConsultaResponse["status"] | HistoricoItem["status"];

const statusMap: Record<
  Status,
  { label: string; className: string }
> = {
  processing: {
    label: "Processando",
    className: "bg-info-bg text-info-fg ring-info-fg/10",
  },
  completed: {
    label: "Concluida",
    className: "bg-success-bg text-success-fg ring-success-fg/10",
  },
  error: {
    label: "Erro",
    className: "bg-danger-bg text-danger-fg ring-danger-fg/10",
  },
};

export function StatusBadge({ status }: { status: Status }) {
  const config = statusMap[status];

  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset",
        config.className,
      ].join(" ")}
    >
      {config.label}
    </span>
  );
}
