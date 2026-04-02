import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AlertCircle, LoaderCircle, RefreshCw, Scale } from "lucide-react";
import { buscarHistorico } from "../api/historico";
import { getStatus } from "../api/consultas";
import { ConfiancaBadge } from "../components/ConfiancaBadge";
import { ParecerCard } from "../components/ParecerCard";
import { useAuth } from "../contexts/AuthContext";
import type { ConsultaResponse, HistoricoItem } from "../types";

function formatarData(valor: string) {
  const data = new Date(valor);

  if (Number.isNaN(data.getTime())) {
    return valor;
  }

  return format(data, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
}

function resumirPergunta(pergunta: string) {
  return pergunta.length > 120 ? `${pergunta.slice(0, 120)}...` : pergunta;
}

function HistoryStatusBadge({ status }: { status: HistoricoItem["status"] }) {
  if (status === "processing") {
    return (
      <span className="inline-flex min-h-9 items-center gap-2 rounded-full bg-info-bg px-3 py-1.5 text-xs font-semibold text-info-fg ring-1 ring-inset ring-info-fg/10">
        <span className="h-2 w-2 rounded-full bg-info-fg animate-pulse motion-reduce:animate-none" />
        Processando
      </span>
    );
  }

  if (status === "completed") {
    return (
      <span className="inline-flex min-h-9 items-center rounded-full bg-success-bg px-3 py-1.5 text-xs font-semibold text-success-fg ring-1 ring-inset ring-success-fg/10">
        Concluído
      </span>
    );
  }

  return (
    <span className="inline-flex min-h-9 items-center rounded-full bg-danger-bg px-3 py-1.5 text-xs font-semibold text-danger-fg ring-1 ring-inset ring-danger-fg/10">
      Erro
    </span>
  );
}

export function Historico() {
  const { user } = useAuth();
  const email = user?.email ?? "";
  const [consultaSelecionada, setConsultaSelecionada] =
    useState<ConsultaResponse | null>(null);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [isLoadingParecer, setIsLoadingParecer] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["historico-firestore", user?.uid],
    queryFn: () => buscarHistorico(user!.uid),
    enabled: !!user?.uid,
    refetchInterval: 30_000,
  });

  const historicoOrdenado = useMemo(() => {
    const items = [...(data ?? [])];

    return items.sort((a, b) => {
      if (a.status === "processing" && b.status !== "processing") {
        return -1;
      }

      if (a.status !== "processing" && b.status === "processing") {
        return 1;
      }

      return (
        new Date(b.criado_em).getTime() - new Date(a.criado_em).getTime()
      );
    });
  }, [data]);

  const handleToggleParecer = async (caseId: string) => {
    if (selectedCaseId === caseId) {
      setSelectedCaseId(null);
      setConsultaSelecionada(null);
      setDetailError(null);
      return;
    }

    setSelectedCaseId(caseId);
    setIsLoadingParecer(true);
    setDetailError(null);

    try {
      const response = await getStatus(caseId);
      setConsultaSelecionada(response);
    } catch (error) {
      setConsultaSelecionada(null);
      setDetailError(
        error instanceof Error
          ? error.message
          : "Não foi possível carregar o parecer completo.",
      );
    } finally {
      setIsLoadingParecer(false);
    }
  };

  return (
    <section className="card-base px-6 py-6 sm:px-8">
      <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary-700">
            Histórico
          </p>
          <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-text">
            Histórico de consultas de {email}
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-text-muted">
            Visualize consultas anteriores, acompanhe processamentos ativos e
            abra o parecer completo quando já estiver concluído.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="mt-6 grid gap-4" aria-busy="true" aria-live="polite">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="animate-pulse rounded-3xl border border-border bg-surface-soft p-5 motion-reduce:animate-none"
            >
              <div className="h-4 w-24 rounded bg-border" />
              <div className="mt-4 h-5 w-4/5 rounded bg-border" />
              <div className="mt-3 h-4 w-3/5 rounded bg-border" />
            </div>
          ))}
        </div>
      ) : null}

      {isError ? (
        <div className="mt-6 rounded-[24px] border border-danger-fg/10 bg-danger-bg px-5 py-5">
          <h2 className="font-serif text-2xl font-semibold text-danger-fg">
            Não foi possível carregar o histórico.
          </h2>
          <button
            type="button"
            onClick={() => void refetch()}
            className="button-primary mt-5"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Tentar novamente
          </button>
        </div>
      ) : null}

      {!isLoading && !isError && historicoOrdenado.length === 0 ? (
        <div className="mt-6 rounded-[24px] border border-dashed border-border px-5 py-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-soft text-primary-700">
            <Scale className="h-7 w-7" aria-hidden="true" />
          </div>
          <p className="mt-4 text-base font-semibold text-text">
            Nenhuma consulta encontrada para este email.
          </p>
        </div>
      ) : null}

      {!isLoading && !isError && historicoOrdenado.length > 0 ? (
        <div className="mt-6 grid gap-4">
          {historicoOrdenado.map((item) => {
            const isSelected = selectedCaseId === item.case_id;
            const canOpenParecer = item.status === "completed";

            return (
              <article
                key={item.case_id}
                className="rounded-3xl border border-border bg-surface p-5 shadow-soft transition duration-200 hover:shadow-elevated motion-reduce:transition-none"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <HistoryStatusBadge status={item.status} />
                      {item.status === "completed" ? (
                        <ConfiancaBadge nivel={item.nivel_confianca} />
                      ) : null}
                    </div>

                    <p className="mt-4 text-sm font-medium text-text-muted">
                      {formatarData(item.criado_em)}
                    </p>
                    <h2 className="mt-2 font-serif text-2xl font-semibold tracking-tight text-text">
                      {resumirPergunta(item.pergunta)}
                    </h2>
                    <p className="mt-2 break-all text-xs uppercase tracking-[0.24em] text-text-muted/80">
                      {item.case_id}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-3">
                    {canOpenParecer ? (
                      <button
                        type="button"
                        onClick={() => void handleToggleParecer(item.case_id)}
                        className="button-secondary"
                      >
                        {isSelected ? "Fechar" : "Ver parecer completo"}
                      </button>
                    ) : null}
                  </div>
                </div>

                {isSelected ? (
                  <div className="mt-5 border-t border-border pt-5">
                    {isLoadingParecer ? (
                      <div
                        className="rounded-3xl border border-border bg-surface-soft p-5 animate-pulse motion-reduce:animate-none"
                        aria-busy="true"
                      >
                        <div className="h-5 w-28 rounded bg-border" />
                        <div className="mt-4 h-4 w-full rounded bg-border" />
                        <div className="mt-3 h-4 w-5/6 rounded bg-border" />
                        <div className="mt-3 h-4 w-4/6 rounded bg-border" />
                      </div>
                    ) : null}

                    {!isLoadingParecer && detailError ? (
                      <div className="rounded-3xl border border-danger-fg/10 bg-danger-bg px-5 py-5">
                        <div className="flex items-start gap-3 text-danger-fg">
                          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                          <p className="text-sm leading-6">{detailError}</p>
                        </div>
                      </div>
                    ) : null}

                    {!isLoadingParecer &&
                    !detailError &&
                    consultaSelecionada &&
                    consultaSelecionada.case_id === item.case_id ? (
                      <ParecerCard data={consultaSelecionada} />
                    ) : null}
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      ) : null}

      {isFetching && !isLoading ? (
        <div className="mt-6 flex items-center gap-2 text-sm text-text-muted">
          <LoaderCircle
            className="h-4 w-4 animate-spin motion-reduce:animate-none"
            aria-hidden="true"
          />
          Atualizando histórico...
        </div>
      ) : null}
    </section>
  );
}
