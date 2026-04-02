import type { ErrorInfo, ReactNode } from "react";
import { Component } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  public constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  public static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Alexia UI boundary captured an error", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-app-shell px-4 py-10">
          <div className="mx-auto max-w-2xl">
            <div className="card-base p-8 text-center sm:p-10">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-danger-bg text-danger-fg">
                <AlertTriangle className="h-7 w-7" aria-hidden="true" />
              </div>
              <h1 className="mt-6 font-serif text-4xl font-semibold tracking-tight text-text">
                Algo saiu do esperado
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-text-muted">
                Ocorreu um erro inesperado na interface da Alexia. Recarregue a
                página para tentar novamente.
              </p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="button-primary mx-auto mt-8"
              >
                <RefreshCcw className="h-4 w-4" aria-hidden="true" />
                Recarregar
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
