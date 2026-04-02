import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  atualizarStatusHistorico,
  getResultado,
  getStatusPolling,
} from "../api/consultas";
import type { ConsultaResponse } from "../types";

type PollingCallback = (response?: ConsultaResponse, error?: Error) => void;

const POLLING_INTERVAL_MS = 5_000;
const POLLING_TIMEOUT_MS = 600_000;

export function usePolling(case_id?: string, onComplete?: PollingCallback) {
  const [data, setData] = useState<ConsultaResponse | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const startedAtRef = useRef<number | null>(null);

  useEffect(() => {
    if (!case_id) {
      setIsPolling(false);
      setData(null);
      setError(null);
      startedAtRef.current = null;
      return;
    }

    let cancelled = false;
    let intervalId: number | undefined;

    const complete = (response?: ConsultaResponse, completionError?: Error) => {
      if (cancelled) {
        return;
      }

      if (response) {
        setData(response);
      }

      if (completionError) {
        setError(completionError);
      }

      setIsPolling(false);
      onComplete?.(response, completionError);
    };

    const poll = async () => {
      if (!startedAtRef.current) {
        startedAtRef.current = Date.now();
      }

      if (Date.now() - startedAtRef.current >= POLLING_TIMEOUT_MS) {
        window.clearInterval(intervalId);
        const timeoutError = new Error(
          "Timeout de 10 minutos ao consultar status.",
        );
        toast.error(timeoutError.message);
        complete(undefined, timeoutError);
        return;
      }

      try {
        const response = await getStatusPolling(case_id);

        if (cancelled) {
          return;
        }

        setData({
          case_id,
          status: response.status === "running" ? "processing" : response.status,
          error_message: response.error_message,
          message: response.error_message,
        });
        setError(null);

        if (response.status === "completed") {
          window.clearInterval(intervalId);
          const resultado = await getResultado(case_id);

          if (cancelled) {
            return;
          }

          atualizarStatusHistorico(
            case_id,
            "completed",
            resultado.nivel_confianca,
          );
          complete(resultado);
          return;
        }

        if (response.status === "error") {
          const pollingError = new Error(
            response.error_message ?? "A consulta retornou erro no processamento.",
          );
          window.clearInterval(intervalId);
          atualizarStatusHistorico(case_id, "error");
          complete(undefined, pollingError);
        }
      } catch (pollingError) {
        if (cancelled) {
          return;
        }

        window.clearInterval(intervalId);
        complete(
          undefined,
          pollingError instanceof Error
            ? pollingError
            : new Error("Falha ao consultar status."),
        );
      }
    };

    setIsPolling(true);
    startedAtRef.current = Date.now();
    void poll();
    intervalId = window.setInterval(() => {
      void poll();
    }, POLLING_INTERVAL_MS);

    return () => {
      cancelled = true;
      setIsPolling(false);
      window.clearInterval(intervalId);
    };
  }, [case_id, onComplete]);

  return {
    data,
    error,
    isPolling,
  };
}
