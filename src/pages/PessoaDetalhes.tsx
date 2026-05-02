import { Link, useParams, useNavigate } from "react-router-dom";
import { useMockStore } from "@/store/mockStore";
import { useMockAuth } from "@/hooks/useMockAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { displayCpf } from "@/lib/maskCpf";
import { formatPhone, formatDateTime } from "@/lib/format";

export default function PessoaDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { pessoas, reunioes, presencasDaPessoa } = useMockStore();
  const { canSeeFullCpf } = useMockAuth();
  const pessoa = pessoas.find((p) => p.id === id);

  if (!pessoa) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>
        <p className="text-muted-foreground">Pessoa não encontrada.</p>
      </div>
    );
  }

  const historico = presencasDaPessoa(pessoa.id);
  const reuniaoPorId = (rid: string) => reunioes.find((r) => r.id === rid);

  return (
    <div className="space-y-6">
      <Button variant="ghost" asChild className="-ml-2">
        <Link to="/pessoas"><ArrowLeft className="mr-2 h-4 w-4" /> Pessoas</Link>
      </Button>

      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle className="text-xl">{pessoa.nome_completo}</CardTitle>
            <p className="text-sm text-muted-foreground capitalize mt-1">
              {pessoa.tipo_pessoa} · {pessoa.cargo_funcao}
            </p>
          </div>
          <Badge variant="secondary" className="capitalize">{pessoa.status}</Badge>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <Field label="CPF" value={displayCpf(pessoa.cpf, canSeeFullCpf)} mono />
            <Field label="Telefone" value={formatPhone(pessoa.telefone) || "—"} />
            <Field label="E-mail" value={pessoa.email || "—"} />
            <Field label="Congregação" value={pessoa.congregacao} />
            <Field label="Credencial" value={pessoa.numero_credencial || "—"} />
            <Field label="Cadastrado em" value={new Date(pessoa.criado_em).toLocaleString("pt-BR")} />
            {pessoa.observacoes && (
              <div className="sm:col-span-2">
                <p className="text-xs text-muted-foreground">Observações</p>
                <p className="mt-1">{pessoa.observacoes}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Histórico de presença</CardTitle>
        </CardHeader>
        <CardContent>
          {historico.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">
              Nenhuma presença registrada.
            </p>
          ) : (
            <ul className="divide-y">
              {historico.map((p) => {
                const r = reuniaoPorId(p.reuniao_id);
                return (
                  <li key={p.id} className="py-3 flex items-center justify-between gap-4">
                    <div>
                      <p className="font-medium">{r?.titulo ?? "Reunião removida"}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDateTime(p.horario_entrada)}
                      </p>
                    </div>
                    <Badge className="bg-success text-success-foreground">Presente</Badge>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`mt-0.5 ${mono ? "font-mono" : ""}`}>{value}</p>
    </div>
  );
}
