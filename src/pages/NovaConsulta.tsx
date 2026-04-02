import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LoaderCircle, Mail, RotateCcw, Scale, SendHorizontal } from "lucide-react";
import { postConsulta } from "../api/consultas";
import { ParecerCard } from "../components/ParecerCard";
import { StatusBadge } from "../components/StatusBadge";
import { StatusProcessando } from "../components/StatusProcessando";
import { usePolling } from "../hooks/usePolling";
import type { ConsultaResponse } from "../types";

const MAX_PERGUNTA_LENGTH = 5000;
const MIN_PERGUNTA_LENGTH = 20;
const EMAIL_STORAGE_KEY = "alexia_email";

function validarEmail(email: string) {
  const trimmed = email.trim();
  const atIndex = trimmed.indexOf("@");
  const dotIndex = trimmed.lastIndexOf(".");

  return atIndex > 0 && dotIndex > atIndex + 1 && dotIndex < trimmed.length - 1;
}

function validarPergunta(pergunta: string) {
  return pergunta.trim().length >= MIN_PERGUNTA_LENGTH;
}

export function NovaConsulta() {
  const [pergunta, setPergunta] = useState("");
  const [email, setEmail] = useState("");
  const [consultaAtiva, setConsultaAtiva] = useState<ConsultaResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resultadoErro, setResultadoErro] = useState<string | null>(null);
  const resultadoRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const persistedEmail = window.localStorage.getItem(EMAIL_STORAGE_KEY);

    if (persistedEmail) {
      setEmail(persistedEmail);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(EMAIL_STORAGE_KEY, email);
  }, [email]);

  useEffect(() => {
    if (!consultaAtiva && !resultadoErro) {
      return;
    }

    resultadoRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [consultaAtiva, resultadoErro]);

  const emailError = useMemo(() => {
    if (!email.trim()) {
      return "Informe um email para receber o parecer.";
    }

    if (!validarEmail(email)) {
      return "Digite um email válido.";
    }

    return null;
  }, [email]);

  const perguntaError = useMemo(() => {
    if (!pergunta.trim()) {
      return "Descreva sua consulta jurídica.";
    }

    if (!validarPergunta(pergunta)) {
      return "A consulta deve ter pelo menos 20 caracteres.";
    }

    return null;
  }, [pergunta]);

  const pollingCaseId =
    consultaAtiva?.status === "processing" ? consultaAtiva.case_id : undefined;

  const handlePollingComplete = useCallback(
    (response?: ConsultaResponse, error?: Error) => {
      if (response) {
        setConsultaAtiva(response);
        setResultadoErro(
          response.status === "error"
            ? response.message ?? "A consulta retornou erro no processamento."
            : null,
        );
        return;
      }

      if (error) {
        setResultadoErro(error.message);
      }
    },
    [],
  );

  const { isPolling } = usePolling(pollingCaseId, handlePollingComplete);

  const isSubmitDisabled =
    !!emailError || !!perguntaError || isSubmitting || isPolling;

  const handleSubmit = async () => {
    if (isSubmitDisabled) {
      return;
    }

    setIsSubmitting(true);
    setResultadoErro(null);

    try {
      const response = await postConsulta({
        pergunta: pergunta.trim(),
        email: email.trim(),
      });

      setConsultaAtiva(response);

      if (response.status === "error") {
        setResultadoErro(response.message ?? "A consulta retornou erro.");
      }
    } catch (error) {
      setResultadoErro(
        error instanceof Error
          ? error.message
          : "Não foi possível enviar sua consulta.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setPergunta("");
    setConsultaAtiva(null);
    setResultadoErro(null);
  };

  return (
    <div className="space-y-6">
      <section className="card-base overflow-hidden">
        <div className="border-b border-border px-6 py-6 sm:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary-700">
            Nova Consulta Jurídica
          </p>
          <h1 className="mt-3 font-serif text-[clamp(2.25rem,5vw,3.5rem)] font-semibold tracking-tight text-text">
            Nova Consulta Jurídica
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-text-muted">
            Descreva sua dúvida jurídica com o máximo de detalhes possível.
          </p>
        </div>

        <div className="grid gap-6 px-6 py-6 sm:px-8 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="space-y-6">
            <div>
              <label
                htmlFor="consulta-email"
                className="mb-2 block text-sm font-semibold text-text"
              >
                Seu email (para receber o parecer)
              </label>
              <div className="relative">
                <Mail
                  className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
                  aria-hidden="true"
                />
                <input
                  id="consulta-email"
                  aria-label="Seu email para receber o parecer"
                  type="email"
                  placeholder="seu@email.com"
                  className="field pl-11"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>
              {emailError ? (
                <p className="mt-2 text-sm text-danger-fg">{emailError}</p>
              ) : null}
            </div>

            <div>
              <label
                htmlFor="consulta-pergunta"
                className="mb-2 block text-sm font-semibold text-text"
              >
                Sua consulta jurídica
              </label>
              <div className="relative">
                <textarea
                  id="consulta-pergunta"
                  aria-label="Sua consulta jurídica"
                  rows={6}
                  maxLength={MAX_PERGUNTA_LENGTH}
                  placeholder="Ex.: Um empregado demitido sem justa causa pode exigir integração das horas extras habituais no cálculo das verbas rescisórias mesmo sem previsão expressa em acordo coletivo?"
                  className="field min-h-[176px] resize-y pb-10"
                  value={pergunta}
                  onChange={(event) => setPergunta(event.target.value)}
                />
                <span className="pointer-events-none absolute bottom-3 right-4 text-xs font-medium text-text-muted">
                  {pergunta.length} / {MAX_PERGUNTA_LENGTH}
                </span>
              </div>
              {perguntaError ? (
                <p className="mt-2 text-sm text-danger-fg">{perguntaError}</p>
              ) : null}
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-[24px] border border-border bg-surface-soft p-5">
              <div className="flex items-center gap-2 text-primary-700">
                <Scale className="h-5 w-5" aria-hidden="true" />
                <p className="text-sm font-semibold">Diretrizes da consulta</p>
              </div>
              <p className="mt-3 text-sm leading-6 text-text-muted">
                Inclua contexto factual, datas relevantes, partes envolvidas e a
                dúvida jurídica central. Quanto mais preciso o briefing, melhor o
                parecer inicial.
              </p>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitDisabled}
              className="button-primary w-full"
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle
                    className="h-4 w-4 animate-spin motion-reduce:animate-none"
                    aria-hidden="true"
                  />
                  Enviando...
                </>
              ) : (
                <>
                  <SendHorizontal className="h-4 w-4" aria-hidden="true" />
                  Enviar Consulta
                </>
              )}
            </button>

            {(consultaAtiva || resultadoErro) && (
              <button
                type="button"
                onClick={handleReset}
                className="button-secondary w-full"
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                Nova Consulta
              </button>
            )}
          </aside>
        </div>
      </section>

      <section ref={resultadoRef} className="card-base px-6 py-6 sm:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-text-muted">
              Resultado
            </p>
            <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-text">
              Andamento da consulta
            </h2>
          </div>
          {consultaAtiva ? <StatusBadge status={consultaAtiva.status} /> : null}
        </div>

        {!consultaAtiva && !resultadoErro ? (
          <div className="mt-6 rounded-3xl border border-dashed border-border px-5 py-10 text-center text-sm text-text-muted">
            Preencha os campos acima para iniciar uma análise jurídica.
          </div>
        ) : null}

        {consultaAtiva?.status === "processing" ? (
          <div className="mt-6">
            <StatusProcessando />
          </div>
        ) : null}

        {consultaAtiva?.status === "completed" ? (
          <div className="mt-6">
            <ParecerCard data={consultaAtiva} />
          </div>
        ) : null}

        {(consultaAtiva?.status === "error" || resultadoErro) && (
          <div className="mt-6 rounded-[24px] border border-danger-fg/10 bg-danger-bg px-5 py-5">
            <h3 className="font-serif text-2xl font-semibold text-danger-fg">
              Não foi possível concluir a consulta
            </h3>
            <p className="mt-3 text-sm leading-6 text-danger-fg">
              {resultadoErro ??
                consultaAtiva?.message ??
                "Tente novamente em alguns instantes."}
            </p>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitDisabled}
              className="button-primary mt-5"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Tentar novamente
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
