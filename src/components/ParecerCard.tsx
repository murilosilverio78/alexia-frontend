import { CheckCircle2, Scale, TriangleAlert } from "lucide-react";
import { ConfiancaBadge } from "./ConfiancaBadge";
import type { ConsultaResponse } from "../types";

function renderParecer(texto: string) {
  return texto.split("\n\n").map((paragrafo, paragraphIndex) => {
    const linhas = paragrafo.split("\n");

    return (
      <p key={`${paragraphIndex}-${paragrafo.slice(0, 24)}`} className="mb-4">
        {linhas.map((linha, lineIndex) => (
          <span key={`${paragraphIndex}-${lineIndex}`}>
            {lineIndex > 0 ? <br /> : null}
            {linha}
          </span>
        ))}
      </p>
    );
  });
}

export function ParecerCard({ data }: { data: ConsultaResponse }) {
  return (
    <article className="card-base space-y-6 p-6 sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-700">
            Parecer jurídico
          </p>
          <h3 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-text">
            Resultado da análise
          </h3>
          <p className="mt-3 text-sm leading-6 text-text-muted">
            Case ID: <span className="font-medium text-text">{data.case_id}</span>
          </p>
        </div>
        <ConfiancaBadge nivel={data.nivel_confianca} />
      </div>

      {data.email_enviado ? (
        <div className="flex items-center gap-3 rounded-2xl border border-success-fg/10 bg-success-bg px-4 py-3 text-sm font-medium text-success-fg">
          <CheckCircle2 className="h-5 w-5 shrink-0" aria-hidden="true" />
          <span>✓ Parecer enviado para seu email</span>
        </div>
      ) : null}

      {data.parecer ? (
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-text">
            <Scale className="h-5 w-5 text-primary-700" aria-hidden="true" />
            <h4 className="font-serif text-2xl font-semibold">Parecer</h4>
          </div>
          <div className="prose prose-slate max-w-none prose-headings:font-serif prose-headings:text-text prose-p:text-text-muted prose-li:text-text-muted prose-strong:text-text">
            {renderParecer(data.parecer)}
          </div>
        </section>
      ) : null}

      {data.fundamentacao?.length ? (
        <section className="space-y-3 rounded-3xl border border-border bg-surface-soft/80 p-5">
          <h4 className="font-serif text-2xl font-semibold text-text">
            Fundamentação Legal
          </h4>
          <ul className="space-y-3 text-sm leading-6 text-text-muted">
            {data.fundamentacao.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary-600" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {data.lacunas?.length ? (
        <section className="space-y-3 rounded-3xl border border-warning-fg/15 bg-warning-bg/70 p-5">
          <div className="flex items-center gap-2 text-warning-fg">
            <TriangleAlert className="h-5 w-5" aria-hidden="true" />
            <h4 className="font-serif text-2xl font-semibold">
              Lacunas Identificadas
            </h4>
          </div>
          <ul className="space-y-3 text-sm leading-6 text-warning-fg">
            {data.lacunas.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-warning-fg" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  );
}
