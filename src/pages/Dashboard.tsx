import { useNavigate } from "react-router-dom";
import { useMockStore } from "@/store/mockStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScanLine, Users, CheckCircle2, CalendarClock, Monitor, ArrowUpRight } from "lucide-react";
import { formatTime } from "@/lib/format";

export default function Dashboard() {
  const navigate = useNavigate();
  const { pessoas, presencas, reuniaoAtual } = useMockStore();

  const presencasReuniao = reuniaoAtual
    ? presencas.filter((p) => p.reuniao_id === reuniaoAtual.id)
    : [];

  const ultimos = presencas.slice(0, 10);
  const pessoaPorId = (id: string) => pessoas.find((p) => p.id === id);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Visão geral da reunião atual</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            size="lg"
            variant="secondary"
            className="h-12 text-base px-6 border border-primary/20 hover:bg-primary-soft/50"
            onClick={() => window.open("/painel", "_blank", "noopener,noreferrer")}
          >
            <Monitor className="mr-2 h-5 w-5" /> Abrir Painel do Telão
          </Button>
          <Button
            size="lg"
            className="h-12 text-base px-6 shadow-[0_10px_24px_rgba(34,60,135,0.18)]"
            onClick={() => navigate("/checkin")}
          >
            <ScanLine className="mr-2 h-5 w-5" /> Iniciar Check-in
          </Button>
        </div>
      </div>

      <Card className="border-primary/20" style={{ background: "var(--gradient-card)" }}>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base text-muted-foreground flex items-center gap-2">
            <CalendarClock className="h-4 w-4" /> Reunião em andamento
          </CardTitle>
          {reuniaoAtual ? (
            <Badge className="bg-success text-success-foreground hover:bg-success">Ao vivo</Badge>
          ) : (
            <Badge variant="secondary">Nenhuma ativa</Badge>
          )}
        </CardHeader>
        <CardContent>
          {reuniaoAtual ? (
            <div className="flex flex-col gap-2">
              <p className="text-xl font-semibold text-primary-deep">{reuniaoAtual.titulo}</p>
              <p className="text-sm text-muted-foreground">
                {reuniaoAtual.horario_inicio} – {reuniaoAtual.horario_fim} · {reuniaoAtual.local}
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Nenhuma reunião está em andamento. Vá em Reuniões para iniciar uma.
            </p>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Presentes na reunião</p>
                <p className="text-3xl font-bold text-primary mt-1">{presencasReuniao.length}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-success-soft flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pessoas cadastradas</p>
                <p className="text-3xl font-bold text-primary mt-1">{pessoas.length}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-primary-soft flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Últimos check-ins</CardTitle>
        </CardHeader>
        <CardContent>
          {ultimos.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">
              Nenhum check-in registrado ainda.
            </p>
          ) : (
            <ul className="divide-y">
              {ultimos.map((p) => {
                const pessoa = pessoaPorId(p.pessoa_id);
                return (
                  <li key={p.id} className="py-3 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-medium truncate">{pessoa?.nome_completo ?? "—"}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {pessoa?.congregacao} · {pessoa?.cargo_funcao}
                      </p>
                    </div>
                    <Badge variant="outline" className="shrink-0">
                      {formatTime(p.horario_entrada)}
                    </Badge>
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
