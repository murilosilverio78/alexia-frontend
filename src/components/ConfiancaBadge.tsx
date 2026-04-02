type Nivel = "Alta" | "Média" | "Baixa" | undefined;

const styles: Record<Exclude<Nivel, undefined>, string> = {
  Alta: "bg-success-bg text-success-fg ring-success-fg/10",
  Média: "bg-warning-bg text-warning-fg ring-warning-fg/10",
  Baixa: "bg-danger-bg text-danger-fg ring-danger-fg/10",
};

const dots: Record<Exclude<Nivel, undefined>, string> = {
  Alta: "bg-success-fg",
  Média: "bg-warning-fg",
  Baixa: "bg-danger-fg",
};

export function ConfiancaBadge({ nivel }: { nivel: Nivel }) {
  if (!nivel) {
    return null;
  }

  return (
    <span
      className={[
        "inline-flex min-h-10 items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold ring-1 ring-inset",
        styles[nivel],
      ].join(" ")}
    >
      <span className={["h-2.5 w-2.5 rounded-full", dots[nivel]].join(" ")} />
      {nivel} confiança
    </span>
  );
}
