import { useState } from "react";
import type { FormEvent } from "react";
import toast from "react-hot-toast";
import { Clock3, Mail, SendHorizontal } from "lucide-react";
import { ParecerCard } from "../components/ParecerCard";
import { StatusProcessando } from "../components/StatusProcessando";
import { useCriarConsulta } from "../hooks/useCriarConsulta";
import { StatusBadge } from "../components/StatusBadge";

const initialForm = {
  pergunta: "",
  email: "",
};

export function NovaConsultaPage() {
  const [form, setForm] = useState(initialForm);
  const mutation = useCriarConsulta();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.pergunta.trim() || !form.email.trim()) {
      toast.error("Preencha a pergunta e o email.");
      return;
    }

    try {
      const response = await mutation.mutateAsync(form);
      toast.success(
        response.status === "error"
          ? "Consulta enviada com retorno de erro."
          : "Consulta enviada com sucesso.",
      );
    } catch {
      toast.error("Nao foi possivel enviar a consulta.");
    }
  };

  const response = mutation.data;

  return (
    <div className="space-y-6">
      <section className="card-base overflow-hidden">
        <div className="border-b border-border px-6 py-6 sm:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary-700">
            Nova consulta
          </p>
          <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="max-w-2xl font-serif text-[clamp(2.25rem,5vw,3.5rem)] font-semibold tracking-tight text-text">
                Estruture uma duvida juridica e acompanhe a resposta da IA.
              </h2>
              <p className="mt-3 max-w-2xl text-base leading-7 text-text-muted">
                Esta base envia a consulta para a API da Alexia e exibe o
                retorno inicial, incluindo status, parecer, fundamentacao e
                lacunas quando disponiveis.
              </p>
            </div>

            <div className="flex min-h-11 items-center gap-2 rounded-2xl border border-info-fg/10 bg-info-bg px-4 py-3 text-sm text-info-fg">
              <Clock3 className="h-4 w-4" />
              Timeout configurado para 5 minutos
            </div>
          </div>
        </div>

        <form className="grid gap-6 px-6 py-6 sm:px-8" onSubmit={handleSubmit}>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-text">
                Pergunta
              </span>
              <textarea
                className="field min-h-[220px] resize-y"
                placeholder="Ex.: A Omni pode enviar informacoes do SCR ao comprador da carteira de financiamento?"
                value={form.pergunta}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    pergunta: event.target.value,
                  }))
                }
              />
            </label>

            <div className="space-y-5">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-text">
                  Email para envio do parecer
                </span>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                  <input
                    className="field pl-11"
                    type="email"
                    placeholder="juridico@empresa.com"
                    value={form.email}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        email: event.target.value,
                      }))
                    }
                  />
                </div>
              </label>

              <div className="rounded-3xl border border-border bg-surface-soft p-4">
                <p className="text-sm font-semibold text-text">
                  Fora do escopo deste scaffold
                </p>
                <p className="mt-2 text-sm leading-6 text-text-muted">
                  Autenticacao, testes, i18n e streaming ficaram reservados para
                  os proximos incrementos.
                </p>
              </div>

              <button
                className="button-primary w-full"
                type="submit"
                disabled={mutation.isPending}
              >
                <SendHorizontal className="h-4 w-4" />
                {mutation.isPending ? "Enviando consulta..." : "Enviar consulta"}
              </button>
            </div>
          </div>
        </form>
      </section>

      <section className="card-base px-6 py-6 sm:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-text-muted">
              Retorno da API
            </p>
            <h3 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-text">
              Estado atual da consulta
            </h3>
          </div>
          {response ? <StatusBadge status={response.status} /> : null}
        </div>

        {!response ? (
          <div className="mt-6 rounded-3xl border border-dashed border-border px-5 py-10 text-center text-sm text-text-muted">
            Envie uma consulta para visualizar o retorno tipado da API.
          </div>
        ) : response.status === "processing" ? (
          <div className="mt-6">
            <StatusProcessando />
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            <ParecerCard data={response} />
            {response.message ? (
              <p className="text-sm leading-6 text-text-muted">{response.message}</p>
            ) : null}
          </div>
        )}
      </section>
    </div>
  );
}
