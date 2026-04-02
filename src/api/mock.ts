import type {
  ConsultaPayload,
  ConsultaResponse,
  HistoricoItem,
} from "../types";

export const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

function wait(ms: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

const mockHistorico: HistoricoItem[] = [
  {
    case_id: "mock-case-001",
    pergunta:
      "Empregado dispensado sem justa causa tem direito à integração das horas extras habituais nas verbas rescisórias?",
    status: "completed",
    nivel_confianca: "Alta",
    criado_em: new Date(Date.now() - 1000 * 60 * 34).toISOString(),
    parecer_resumo:
      "Entendimento favorável à integração quando comprovada habitualidade das horas extraordinárias.",
  },
  {
    case_id: "mock-case-002",
    pergunta:
      "Empresa pode alterar unilateralmente o regime de trabalho presencial para híbrido sem aditivo contratual?",
    status: "processing",
    criado_em: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    parecer_resumo: "Consulta em processamento para atualização automática da tela.",
  },
  {
    case_id: "mock-case-003",
    pergunta:
      "Cláusula de não concorrência após rescisão contratual exige indenização compensatória ao empregado?",
    status: "completed",
    nivel_confianca: "Alta",
    criado_em: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    parecer_resumo:
      "A validade depende de limitação temporal, territorial e compensação financeira razoável.",
  },
  {
    case_id: "mock-case-004",
    pergunta:
      "Advertência disciplinar aplicada sem assinatura do colaborador invalida eventual justa causa futura?",
    status: "error",
    criado_em: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
    parecer_resumo: "Fluxo de erro para validação da experiência da interface.",
  },
  {
    case_id: "mock-case-005",
    pergunta:
      "Empregada gestante contratada por prazo determinado possui estabilidade provisória até cinco meses após o parto?",
    status: "completed",
    nivel_confianca: "Alta",
    criado_em: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
    parecer_resumo:
      "A jurisprudência consolidada reconhece a estabilidade independentemente da modalidade contratual.",
  },
];

const mockConsultaCompleted: ConsultaResponse = {
  case_id: "mock-case-parecer",
  status: "completed",
  parecer:
    "A análise indica que, no contexto do direito do trabalho, a habitualidade das horas extras tende a repercutir no cálculo das verbas rescisórias quando houver prova consistente da prestação continuada acima da jornada contratual.\n\nTambém é relevante verificar a existência de controles de ponto, recibos e eventuais normas coletivas aplicáveis, pois esses elementos reforçam a demonstração da habitualidade e ajudam a delimitar os reflexos econômicos devidos.\n\nEm termos práticos, a orientação inicial é reunir a documentação contratual e os registros de jornada para avaliar a extensão dos reflexos em aviso-prévio, férias, décimo terceiro salário, FGTS e multa rescisória, com atenção à jurisprudência consolidada do TST.",
  nivel_confianca: "Alta",
  fundamentacao: [
    "Art. 7º, XVI, da Constituição Federal.",
    "Art. 59 da Consolidação das Leis do Trabalho.",
    "Súmulas e precedentes consolidados do Tribunal Superior do Trabalho sobre habitualidade e reflexos salariais.",
  ],
  email_enviado: true,
};

export async function mockPostConsulta(
  _payload: ConsultaPayload,
): Promise<ConsultaResponse> {
  await wait(3_000);

  return {
    ...mockConsultaCompleted,
    case_id: `mock-case-${Date.now()}`,
  };
}

export async function mockGetStatus(case_id: string): Promise<ConsultaResponse> {
  await wait(600);

  return {
    ...mockConsultaCompleted,
    case_id,
  };
}

export async function mockGetHistorico(_email: string): Promise<HistoricoItem[]> {
  await wait(700);
  return mockHistorico;
}
