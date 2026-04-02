import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { apiClient } from "./client";
import { salvarConsulta } from "./historico";
import { mockGetStatus, mockPostConsulta, USE_MOCK } from "./mock";
import type {
  ConsultaPayload,
  ConsultaResponse,
  HistoricoItem,
} from "../types";

type PostConsultaApiResponse = {
  case_id: string;
};

type StatusApiResponse = {
  status: "running" | "completed" | "error";
  error_message?: string;
};

type ResultadoApiResponse = {
  case_id: string;
  status: "running" | "completed" | "error";
  parecer_final?: string;
  lacunas?: string[];
  iteracoes?: number;
  error_message?: string;
};

type ToastedError = Error & {
  __toastShown?: boolean;
};

function buildApiErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const status = error.response?.status;

    if (status === 422) {
      return "Dados inválidos. Verifique sua pergunta e email.";
    }

    if (status === 500) {
      return "Erro interno do servidor. Tente novamente em alguns instantes.";
    }

    if (status === 405) {
      return "Método não permitido. Verifique se POST /consulta aceita JSON em vez de multipart.";
    }

    if (!error.response) {
      return "Sem conexão com o servidor. Verifique se o backend está rodando.";
    }
  }

  return "Erro ao comunicar com a API da Alexia.";
}

export function notifyApiError(error: unknown): Error {
  const message = buildApiErrorMessage(error);
  toast.error(message);
  const normalizedError: ToastedError =
    error instanceof Error ? error : new Error(message);

  normalizedError.message = message;
  normalizedError.__toastShown = true;

  return normalizedError;
}

export async function postConsulta(
  payload: ConsultaPayload,
  uid?: string,
): Promise<ConsultaResponse> {
  if (USE_MOCK) {
    const mockResponse = await mockPostConsulta(payload);

    if (uid) {
      await salvarConsulta(uid, {
        case_id: mockResponse.case_id,
        pergunta: payload.pergunta,
        status: "processing",
        criado_em: new Date().toISOString(),
      });
    }

    return {
      case_id: mockResponse.case_id,
      status: "processing",
    };
  }

  try {
    const { data } = await apiClient.post<PostConsultaApiResponse>("/consulta", {
      pergunta: payload.pergunta,
      email_destinatario: payload.email,
    });

    if (uid) {
      await salvarConsulta(uid, {
        case_id: data.case_id,
        pergunta: payload.pergunta,
        status: "processing",
        criado_em: new Date().toISOString(),
      });
    }

    return {
      case_id: data.case_id,
      status: "processing",
    };
  } catch (error) {
    throw notifyApiError(error);
  }
}

export async function getStatusPolling(
  case_id: string,
): Promise<StatusApiResponse> {
  if (USE_MOCK) {
    const mockResponse = await mockGetStatus(case_id);

    return {
      status:
        mockResponse.status === "processing" ? "running" : mockResponse.status,
      error_message: mockResponse.error_message,
    };
  }

  try {
    const { data } = await apiClient.get<StatusApiResponse>(
      `/consulta/${case_id}/status`,
    );
    return data;
  } catch (error) {
    throw notifyApiError(error);
  }
}

export async function getStatus(case_id: string): Promise<ConsultaResponse> {
  const response = await getStatusPolling(case_id);

  if (response.status === "completed") {
    return getResultado(case_id);
  }

  if (response.status === "error") {
    return {
      case_id,
      status: "error",
      error_message: response.error_message,
      message: response.error_message,
    };
  }

  return {
    case_id,
    status: "processing",
  };
}

export async function getResultado(case_id: string): Promise<ConsultaResponse> {
  if (USE_MOCK) {
    const mockResponse = await mockGetStatus(case_id);

    return {
      ...mockResponse,
      parecer_final: mockResponse.parecer_final ?? mockResponse.parecer,
      parecer: mockResponse.parecer ?? mockResponse.parecer_final,
    };
  }

  try {
    const { data } = await apiClient.get<ResultadoApiResponse>(
      `/consulta/${case_id}`,
    );

    return {
      case_id: data.case_id,
      status: data.status === "running" ? "processing" : data.status,
      parecer_final: data.parecer_final,
      parecer: data.parecer_final,
      lacunas: data.lacunas,
      iteracoes: data.iteracoes,
      error_message: data.error_message,
      message: data.error_message,
    };
  } catch (error) {
    throw notifyApiError(error);
  }
}

export async function getHistorico(email: string): Promise<HistoricoItem[]> {
  void email;
  return [];
}

export async function criarConsulta(
  payload: ConsultaPayload,
): Promise<ConsultaResponse> {
  return postConsulta(payload);
}

export async function listarHistorico(email = ""): Promise<HistoricoItem[]> {
  if (!email.trim()) {
    return [];
  }

  return getHistorico(email);
}
