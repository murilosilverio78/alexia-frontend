import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { getHistorico, postConsulta } from "../api/consultas";
import type { ConsultaPayload } from "../types";

type ToastedError = Error & {
  __toastShown?: boolean;
};

export function usePostConsulta() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ConsultaPayload) => postConsulta(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["historico"] });
    },
    onError: (error) => {
      const message =
        error instanceof Error
          ? error.message
          : "Erro ao enviar consulta para a Alexia.";

      if (!(error as ToastedError)?.__toastShown) {
        toast.error(message);
      }
    },
  });
}

export function useHistorico(email: string) {
  return useQuery({
    queryKey: ["historico", email],
    queryFn: () => getHistorico(email),
    enabled: email.trim().length > 0,
    refetchInterval: 30_000,
  });
}
