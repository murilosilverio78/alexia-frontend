export interface ConsultaPayload {
  pergunta: string;
  email: string;
}

export interface ConsultaResponse {
  case_id: string;
  status: "processing" | "completed" | "error";
  parecer?: string;
  parecer_final?: string;
  nivel_confianca?: "Alta" | "Média" | "Baixa";
  fundamentacao?: string[];
  lacunas?: string[];
  iteracoes?: number;
  email_enviado?: boolean;
  error_message?: string;
  message?: string;
}

export interface HistoricoItem {
  case_id: string;
  pergunta: string;
  status: "processing" | "completed" | "error";
  nivel_confianca?: "Alta" | "Média" | "Baixa";
  criado_em: string;
  parecer_resumo?: string;
}
