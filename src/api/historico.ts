import {
  Timestamp,
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import type { HistoricoItem } from "../types";

function limparUndefined(obj: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v !== undefined),
  );
}

export async function salvarConsulta(
  uid: string,
  item: HistoricoItem,
): Promise<void> {
  await setDoc(
    doc(db, "consultas", uid, "items", item.case_id),
    limparUndefined({
      ...item,
      criado_em: Timestamp.fromDate(new Date(item.criado_em)),
    }),
    { merge: true },
  );
}

export async function atualizarConsulta(
  uid: string,
  case_id: string,
  dados: Partial<HistoricoItem>,
): Promise<void> {
  await updateDoc(
    doc(db, "consultas", uid, "items", case_id),
    limparUndefined({
      ...dados,
      ...(dados.criado_em
        ? { criado_em: Timestamp.fromDate(new Date(dados.criado_em)) }
        : {}),
    }),
  );
}

export async function buscarHistorico(uid: string): Promise<HistoricoItem[]> {
  const historicoQuery = query(
    collection(db, "consultas", uid, "items"),
    orderBy("criado_em", "desc"),
    limit(50),
  );
  const snapshot = await getDocs(historicoQuery);

  return snapshot.docs.map((itemDoc) => {
    const data = itemDoc.data() as Omit<HistoricoItem, "criado_em"> & {
      criado_em: Timestamp;
    };

    return {
      ...data,
      criado_em: data.criado_em.toDate().toISOString(),
    };
  });
}
