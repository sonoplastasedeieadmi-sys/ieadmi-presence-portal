import { useEffect, useMemo, useRef, useState } from "react";
import { useMockStore, Pessoa } from "@/store/mockStore";
import { useMockAuth } from "@/hooks/useMockAuth";
import { useDebounce } from "@/hooks/useDebounce";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, UserPlus, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";
import { displayCpf, onlyDigits } from "@/lib/maskCpf";
import { formatTime } from "@/lib/format";
import { CadastroRapidoModal } from "@/components/checkin/CadastroRapidoModal";
import { toast } from "sonner";

const MAX_RESULTS = 20;

export default function Checkin() {
  const { pessoas, reuniaoAtual, presencas, registrarCheckin, presencaDe, addPessoa } =
    useMockStore();
  const { user, canSeeFullCpf } = useMockAuth();
  const [query, setQuery] = useState("");
  const debounced = useDebounce(query, 300);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [cadastroRapido, setCadastroRapido] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const resultados = useMemo<Pessoa[]>(() => {
    const q = debounced.trim().toLowerCase();
    if (!q) return [];
    const qDigits = onlyDigits(debounced);
    const matched = pessoas.filter(
      (p) =>
        p.nome_completo.toLowerCase().includes(q) ||
        (qDigits && p.cpf.includes(qDigits)) ||
        (qDigits && p.numero_credencial?.includes(qDigits))
    );
    return matched.slice(0, MAX_RESULTS);
  }, [pessoas, debounced]);

  useEffect(() => {
    if (resultados.length === 1) setSelectedId(resultados[0].id);
    else if (resultados.length === 0) setSelectedId(null);
    else if (selectedId && !resultados.find((r) => r.id === selectedId)) setSelectedId(null);
  }, [resultados, selectedId]);

  const presencasDaReuniao = reuniaoAtual
    ? presencas.filter((p) => p.reuniao_id === reuniaoAtual.id).slice(0, 5)
    : [];

  const handleRegistrar = async (pessoaId?: string) => {
    const id = pessoaId ?? selectedId;
    if (!id || !reuniaoAtual || submitting) return;
    setSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 250));
      const result = registrarCheckin(id, user?.nome ?? "Operador");
      if (result.ok === true) {
        toast.success(`Check-in realizado com sucesso às ${formatTime(result.presenca.horario_entrada)}`);
        setQuery("");
        setSelectedId(null);
        inputRef.current?.focus();
      } else {
        toast.warning(
          `Entrada já registrada nesta reunião às ${formatTime(result.presencaExistente.horario_entrada)}`
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && selectedId && reuniaoAtual && !submitting) {
      e.preventDefault();
      handleRegistrar();
    }
  };

  const selecionado = pessoas.find((p) => p.id === selectedId) ?? null;
  const jaPresente =
    selecionado && reuniaoAtual ? presencaDe(selecionado.id, reuniaoAtual.id) : undefined;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-primary">Check-in da Reunião</h1>
          <p className="text-sm text-muted-foreground">
            Registre a entrada de membros, obreiros e visitantes
          </p>
        </div>
        <Button variant="outline" onClick={() => setCadastroRapido(true)}>
          <UserPlus className="mr-2 h-4 w-4" /> Novo Cadastro Rápido
        </Button>
      </div>

      {!reuniaoAtual ? (
        <Card className="border-amber-300 bg-amber-50">
          <CardContent className="py-6 flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <p className="text-sm text-amber-900">
              Nenhuma reunião está em andamento. Vá em <strong>Reuniões</strong> e inicie uma para
              poder registrar check-ins.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card style={{ background: "var(--gradient-card)" }} className="border-primary/20">
          <CardContent className="pt-6">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Reunião atual</p>
            <p className="text-lg font-semibold text-primary-deep">{reuniaoAtual.titulo}</p>
            <p className="text-sm text-muted-foreground">
              {reuniaoAtual.horario_inicio} – {reuniaoAtual.horario_fim} · {reuniaoAtual.local}
            </p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Buscar por nome, CPF ou número de credencial"
              className="pl-10 h-12 text-base shadow-sm"
              disabled={!reuniaoAtual}
              autoComplete="off"
              spellCheck={false}
            />
          </div>

          {debounced && resultados.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-6">
              Nenhuma pessoa encontrada. Use <strong>Novo Cadastro Rápido</strong> para cadastrar.
            </p>
          )}

          {resultados.length > 0 && (
            <div className="space-y-2">
              {resultados.map((p) => {
                const isSelected = p.id === selectedId;
                const presenca = reuniaoAtual ? presencaDe(p.id, reuniaoAtual.id) : undefined;
                return (
                  <button
                    type="button"
                    key={p.id}
                    onClick={() => setSelectedId(p.id)}
                    className={`w-full text-left rounded-xl border p-4 transition ${
                      isSelected
                        ? "border-primary bg-primary-soft"
                        : "border-border hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold truncate">{p.nome_completo}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {p.congregacao} · <span className="capitalize">{p.tipo_pessoa}</span>
                          {p.numero_credencial ? ` · Cred. ${p.numero_credencial}` : ""}
                        </p>
                        <p className="text-xs font-mono text-muted-foreground mt-0.5">
                          {displayCpf(p.cpf, canSeeFullCpf)}
                        </p>
                      </div>
                      {presenca ? (
                        <Badge className="bg-success text-success-foreground shrink-0">
                          Presente {formatTime(presenca.horario_entrada)}
                        </Badge>
                      ) : isSelected ? (
                        <Badge variant="outline" className="shrink-0">Selecionado</Badge>
                      ) : null}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {selecionado && (
            <div className="pt-2">
              {jaPresente ? (
                <div className="rounded-xl bg-amber-50 border border-amber-300 p-4 flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                  <p className="text-sm text-amber-900">
                    <strong>{selecionado.nome_completo}</strong> já fez check-in nesta reunião às{" "}
                    <strong>{formatTime(jaPresente.horario_entrada)}</strong>.
                  </p>
                </div>
              ) : (
                <Button
                  className="w-full h-14 text-lg bg-success hover:bg-success/90 text-success-foreground shadow-[0_12px_28px_rgba(34,197,94,0.22)]"
                  disabled={submitting || !reuniaoAtual}
                  onClick={() => handleRegistrar()}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Registrando...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 h-5 w-5" /> Registrar Entrada
                    </>
                  )}
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {presencasDaReuniao.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Últimos check-ins desta reunião</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-y">
              {presencasDaReuniao.map((p) => {
                const pessoa = pessoas.find((x) => x.id === p.pessoa_id);
                return (
                  <li key={p.id} className="py-2 flex items-center justify-between">
                    <div>
                      <p className="font-medium">{pessoa?.nome_completo ?? "—"}</p>
                      <p className="text-xs text-muted-foreground">{pessoa?.congregacao}</p>
                    </div>
                    <Badge className="bg-success text-success-foreground">
                      {formatTime(p.horario_entrada)}
                    </Badge>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>
      )}

      <CadastroRapidoModal
        open={cadastroRapido}
        onOpenChange={setCadastroRapido}
        onSave={(values) => {
          const novaPessoa = addPessoa(values);
          if (reuniaoAtual) {
            const result = registrarCheckin(novaPessoa.id, user?.nome ?? "Operador", "cadastro_rapido");
            if (result.ok) {
              toast.success(
                `Cadastro feito e check-in realizado às ${formatTime(result.presenca.horario_entrada)}`
              );
            }
          } else {
            toast.success("Pessoa cadastrada");
          }
        }}
      />
    </div>
  );
}
