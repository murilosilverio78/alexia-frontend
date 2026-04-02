import { LoaderCircle } from "lucide-react";

export function StatusProcessando() {
  return (
    <section className="card-base p-6 sm:p-8" aria-live="polite">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-info-bg text-info-fg">
          <LoaderCircle
            className="h-6 w-6 animate-spin motion-reduce:animate-none"
            aria-hidden="true"
          />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="font-serif text-3xl font-semibold tracking-tight text-text">
            Analisando sua consulta...
          </h3>
          <p className="mt-3 text-base leading-7 text-text-muted">
            Nossos especialistas em IA estão pesquisando a legislação relevante.
            Isso pode levar até 3 minutos.
          </p>

          <div className="mt-6 overflow-hidden rounded-full bg-info-bg/80">
            <div className="progress-indeterminate h-2.5 rounded-full bg-gradient-to-r from-primary-600 via-accent-500 to-primary-500 motion-reduce:animate-none" />
          </div>
        </div>
      </div>
    </section>
  );
}
