import { useHistorico as useHistoricoQuery } from "./useConsulta";

export function useHistorico(email = "") {
  return useHistoricoQuery(email);
}
