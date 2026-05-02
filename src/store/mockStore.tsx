import { createContext, useContext, useEffect, useState, ReactNode, useMemo } from "react";

export type TipoPessoa =
  | "membro"
  | "congregado"
  | "obreiro"
  | "pastor"
  | "dirigente"
  | "visitante"
  | "diacono"
  | "presbitero"
  | "missionaria"
  | "missionario"
  | "evangelista";

export type StatusPessoa = "ativo" | "inativo" | "visitante" | "pendente";

export interface Pessoa {
  id: string;
  nome_completo: string;
  cpf: string;
  telefone: string;
  email?: string;
  congregacao: string;
  cargo_funcao: string;
  tipo_pessoa: TipoPessoa;
  numero_credencial?: string;
  status: StatusPessoa;
  observacoes?: string;
  criado_em: string;
}

export type StatusReuniao = "agendada" | "em_andamento" | "finalizada";

export interface Reuniao {
  id: string;
  titulo: string;
  data: string; // YYYY-MM-DD
  horario_inicio: string; // HH:MM
  horario_fim: string;
  local: string;
  descricao?: string;
  pastor_responsavel?: string;
  status: StatusReuniao;
  criado_em: string;
}

export interface Presenca {
  id: string;
  pessoa_id: string;
  reuniao_id: string;
  horario_entrada: string; // ISO
  metodo_checkin: "manual" | "cadastro_rapido";
  operador: string;
}

interface StoreCtx {
  pessoas: Pessoa[];
  reunioes: Reuniao[];
  presencas: Presenca[];
  reuniaoAtual: Reuniao | null;
  addPessoa: (p: Omit<Pessoa, "id" | "criado_em">) => Pessoa;
  updatePessoa: (id: string, p: Partial<Pessoa>) => void;
  removePessoa: (id: string) => void;
  addReuniao: (r: Omit<Reuniao, "id" | "criado_em" | "status"> & { status?: StatusReuniao }) => Reuniao;
  updateReuniao: (id: string, r: Partial<Reuniao>) => void;
  removeReuniao: (id: string) => void;
  iniciarReuniao: (id: string) => void;
  finalizarReuniao: (id: string) => void;
  registrarCheckin: (
    pessoa_id: string,
    operador: string,
    metodo?: "manual" | "cadastro_rapido"
  ) => { ok: true; presenca: Presenca } | { ok: false; presencaExistente: Presenca };
  presencaDe: (pessoa_id: string, reuniao_id: string) => Presenca | undefined;
  presencasDaPessoa: (pessoa_id: string) => Presenca[];
}

const Ctx = createContext<StoreCtx | null>(null);
const STORAGE_KEY = "ieadmi_mock_store_v1";

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function seed(): { pessoas: Pessoa[]; reunioes: Reuniao[]; presencas: Presenca[] } {
  const now = new Date().toISOString();
  const today = new Date().toISOString().slice(0, 10);
  const pessoas: Pessoa[] = [
    ["João Pereira da Silva", "12345678901", "(11) 98888-1111", "Sede Central", "Pastor Auxiliar", "pastor", "0001"],
    ["Maria Aparecida Souza", "23456789012", "(11) 98888-2222", "Congregação Vila Nova", "Diaconisa", "obreiro", "0002"],
    ["Carlos Eduardo Lima", "34567890123", "(11) 98888-3333", "Sede Central", "Membro", "membro", "0003"],
    ["Ana Beatriz Fernandes", "45678901234", "(11) 98888-4444", "Congregação Jardim", "Secretária", "obreiro", "0004"],
    ["Pedro Henrique Alves", "56789012345", "(11) 98888-5555", "Congregação Vila Nova", "Dirigente", "dirigente", "0005"],
    ["Luana Cristina Rocha", "67890123456", "(11) 98888-6666", "Sede Central", "Membro", "membro", "0006"],
    ["Rafael Moreira Santos", "78901234567", "(11) 98888-7777", "Congregação Jardim", "Congregado", "congregado", ""],
    ["Beatriz Oliveira Dias", "89012345678", "(11) 98888-8888", "Sede Central", "Visitante", "visitante", ""],
  ].map(
    ([nome, cpf, tel, cong, cargo, tipo, cred]) =>
      ({
        id: uid(),
        nome_completo: nome,
        cpf,
        telefone: tel,
        congregacao: cong,
        cargo_funcao: cargo,
        tipo_pessoa: tipo as TipoPessoa,
        numero_credencial: cred || undefined,
        status: "ativo" as StatusPessoa,
        criado_em: now,
      }) as Pessoa
  );

  const reuniao: Reuniao = {
    id: uid(),
    titulo: "Reunião com Pastor Presidente — Maio 2026",
    data: today,
    horario_inicio: "08:00",
    horario_fim: "12:00",
    local: "Sede Regional IEADMI",
    descricao: "Reunião mensal de obreiros e dirigentes.",
    pastor_responsavel: "Pr. Presidente IEADMI",
    status: "em_andamento",
    criado_em: now,
  };

  return { pessoas, reunioes: [reuniao], presencas: [] };
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seed();
    const data = JSON.parse(raw);
    return {
      pessoas: data.pessoas ?? [],
      reunioes: data.reunioes ?? [],
      presencas: data.presencas ?? [],
    };
  } catch {
    return seed();
  }
}

export function MockStoreProvider({ children }: { children: ReactNode }) {
  const initial = useMemo(load, []);
  const [pessoas, setPessoas] = useState<Pessoa[]>(initial.pessoas);
  const [reunioes, setReunioes] = useState<Reuniao[]>(initial.reunioes);
  const [presencas, setPresencas] = useState<Presenca[]>(initial.presencas);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ pessoas, reunioes, presencas })
    );
  }, [pessoas, reunioes, presencas]);

  const reuniaoAtual = reunioes.find((r) => r.status === "em_andamento") ?? null;

  const addPessoa: StoreCtx["addPessoa"] = (p) => {
    const nova: Pessoa = { ...p, id: uid(), criado_em: new Date().toISOString() };
    setPessoas((prev) => [nova, ...prev]);
    return nova;
  };

  const updatePessoa: StoreCtx["updatePessoa"] = (id, p) => {
    setPessoas((prev) => prev.map((x) => (x.id === id ? { ...x, ...p } : x)));
  };

  const removePessoa: StoreCtx["removePessoa"] = (id) => {
    setPessoas((prev) => prev.filter((x) => x.id !== id));
    setPresencas((prev) => prev.filter((x) => x.pessoa_id !== id));
  };

  const addReuniao: StoreCtx["addReuniao"] = (r) => {
    const nova: Reuniao = {
      ...r,
      status: r.status ?? "agendada",
      id: uid(),
      criado_em: new Date().toISOString(),
    };
    setReunioes((prev) => [nova, ...prev]);
    return nova;
  };

  const updateReuniao: StoreCtx["updateReuniao"] = (id, r) => {
    setReunioes((prev) => prev.map((x) => (x.id === id ? { ...x, ...r } : x)));
  };

  const removeReuniao: StoreCtx["removeReuniao"] = (id) => {
    setReunioes((prev) => prev.filter((x) => x.id !== id));
    setPresencas((prev) => prev.filter((x) => x.reuniao_id !== id));
  };

  const iniciarReuniao: StoreCtx["iniciarReuniao"] = (id) => {
    setReunioes((prev) =>
      prev.map((x) =>
        x.id === id
          ? { ...x, status: "em_andamento" }
          : x.status === "em_andamento"
          ? { ...x, status: "finalizada" }
          : x
      )
    );
  };

  const finalizarReuniao: StoreCtx["finalizarReuniao"] = (id) => {
    setReunioes((prev) =>
      prev.map((x) => (x.id === id ? { ...x, status: "finalizada" } : x))
    );
  };

  const presencaDe: StoreCtx["presencaDe"] = (pessoa_id, reuniao_id) =>
    presencas.find((p) => p.pessoa_id === pessoa_id && p.reuniao_id === reuniao_id);

  const presencasDaPessoa: StoreCtx["presencasDaPessoa"] = (pessoa_id) =>
    presencas
      .filter((p) => p.pessoa_id === pessoa_id)
      .sort((a, b) => b.horario_entrada.localeCompare(a.horario_entrada));

  const registrarCheckin: StoreCtx["registrarCheckin"] = (pessoa_id, operador, metodo = "manual") => {
    if (!reuniaoAtual) {
      throw new Error("Nenhuma reunião em andamento.");
    }
    const existente = presencaDe(pessoa_id, reuniaoAtual.id);
    if (existente) return { ok: false, presencaExistente: existente };
    const nova: Presenca = {
      id: uid(),
      pessoa_id,
      reuniao_id: reuniaoAtual.id,
      horario_entrada: new Date().toISOString(),
      metodo_checkin: metodo,
      operador,
    };
    setPresencas((prev) => [nova, ...prev]);
    return { ok: true, presenca: nova };
  };

  return (
    <Ctx.Provider
      value={{
        pessoas,
        reunioes,
        presencas,
        reuniaoAtual,
        addPessoa,
        updatePessoa,
        removePessoa,
        addReuniao,
        updateReuniao,
        removeReuniao,
        iniciarReuniao,
        finalizarReuniao,
        registrarCheckin,
        presencaDe,
        presencasDaPessoa,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useMockStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useMockStore deve ser usado dentro de MockStoreProvider");
  return ctx;
}
