import { useEffect, useRef } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AlertCircle, RefreshCw } from "lucide-react";
import { atualizarConsulta } from "../api/historico";
import { getResultado, getStatusPolling } from "../api/consultas";
import { ConfiancaBadge } from "../components/ConfiancaBadge";
import { StatusBadge } from "../components/StatusBadge";
import { useAuth } from "../contexts/AuthContext";
import { useHistorico } from "../hooks/useHistorico";

function formatarData(valor: string) {
  const data = new Date(valor);

  if (Number.isNaN(data.getTime())) {
    return valor;
  }

  return format(data, "dd/MM/yyyy 'as' HH:mm", { locale: ptBR });
}

export function HistoricoPage() {
  const { user } = useAuth();
  const { data, isLoading, isError, refetch, isFetching } =
    useHistorico(user?.email ?? "");
  const dataRef = useRef(data);
  const uidRef = useRef(user?.uid);
  const refetchRef = useRef(refetch);

  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  useEffect(() => {
    uidRef.current = user?.uid;
  }, [user?.uid]);

  useEffect(() => {
    refetchRef.current = refetch;
  }, [refetch]);

  const verificarEAtualizar = async (
    currentData: typeof data,
    uid?: string,
  ) => {
    const processando =
      currentData?.filter((item) => item.status === "processing") ?? [];

    if (!processando.length || !uid) {
      return;
    }

    let houveMudanca = false;

    await Promise.all(
      processando.map(async (item) => {
        const status = await getStatusPolling(item.case_id);

        if (status.status === "completed") {
          const resultado = await getResultado(item.case_id);

          await atualizarConsulta(uid, item.case_id, {
            status: "completed",
            nivel_confianca: resultado.nivel_confianca,
            parecer_resumo: resultado.parecer_final?.slice(0, 300),
          });
          houveMudanca = true;
          return;
        }

        if (status.status === "error") {
          await atualizarConsulta(uid, item.case_id, { status: "error" });
          houveMudanca = true;
        }
      }),
    );

    if (houveMudanca) {
      await refetchRef.current();
    }
  };

  useEffect(() => {
    let cancelled = false;

    const executar = async () => {
      if (cancelled) {
        return;
      }

      await verificarEAtualizar(dataRef.current, uidRef.current);
    };

    void executar();

    const intervalId = window.setInterval(() => {
      void executar();
    }, 10_000);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <section className="card-base px-6 py-6 sm:px-8">
      <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary-700">
            Historico
          </p>
          <h2 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-text">
            Consultas recentes da Alexia
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-7 text-text-muted">
            Estrutura inicial para listar consultas, status de processamento e
            resumo do parecer.
          </p>
        </div>

        <button
          className="button-secondary"
          type="button"
          onClick={() => void refetch()}
          disabled={isFetching}
        >
          <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
          Atualizar
        </button>
      </div>

      {isLoading ? (
        <div className="mt-6 grid gap-4">
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
        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-danger-fg/10 bg-danger-bg px-5 py-4 text-sm text-danger-fg">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <p>
            Nao foi possivel carregar o historico. Ajuste a rota backend em
            `src/api/consultas.ts` se o endpoint final for diferente de
            `/historico`.
          </p>
        </div>
      ) : null}

      {!isLoading && !isError && data?.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-border px-5 py-10 text-center text-sm text-text-muted">
          Nenhuma consulta encontrada.
        </div>
      ) : null}

      {!isLoading && !isError && data?.length ? (
        <div className="mt-6 grid gap-4">
          {data.map((item) => (
            <article
              key={item.case_id}
              className="rounded-3xl border border-border bg-surface p-5 shadow-soft transition duration-200 hover:shadow-elevated motion-reduce:transition-none"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <StatusBadge status={item.status} />
                    <ConfiancaBadge nivel={item.nivel_confianca} />
                  </div>

                  <h3 className="mt-4 font-serif text-2xl font-semibold tracking-tight text-text">
                    {item.pergunta}
                  </h3>
                  <p className="mt-2 break-all text-xs uppercase tracking-[0.24em] text-text-muted/80">
                    {item.case_id}
                  </p>
                </div>

                <p className="text-sm font-medium text-text-muted">
                  {formatarData(item.criado_em)}
                </p>
              </div>

              {item.parecer_resumo ? (
                <p className="mt-4 text-sm leading-6 text-text-muted">
                  {item.parecer_resumo}
                </p>
              ) : null}
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}
