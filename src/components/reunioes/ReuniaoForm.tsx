import { useState } from "react";
import { Reuniao, StatusReuniao } from "@/store/mockStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type ReuniaoFormValues = Omit<Reuniao, "id" | "criado_em">;

interface Props {
  initial?: Partial<Reuniao>;
  onSubmit: (values: ReuniaoFormValues) => void;
  onCancel?: () => void;
  submitLabel?: string;
}

const STATUSES: { value: StatusReuniao; label: string }[] = [
  { value: "agendada", label: "Agendada" },
  { value: "em_andamento", label: "Em andamento" },
  { value: "finalizada", label: "Finalizada" },
];

export function ReuniaoForm({ initial, onSubmit, onCancel, submitLabel = "Salvar" }: Props) {
  const [v, setV] = useState<ReuniaoFormValues>({
    titulo: initial?.titulo ?? "",
    data: initial?.data ?? new Date().toISOString().slice(0, 10),
    horario_inicio: initial?.horario_inicio ?? "08:00",
    horario_fim: initial?.horario_fim ?? "12:00",
    local: initial?.local ?? "Sede Regional IEADMI",
    descricao: initial?.descricao ?? "",
    pastor_responsavel: initial?.pastor_responsavel ?? "",
    status: (initial?.status as StatusReuniao) ?? "agendada",
  });

  const set = <K extends keyof ReuniaoFormValues>(k: K, val: ReuniaoFormValues[K]) =>
    setV((prev) => ({ ...prev, [k]: val }));

  const handle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!v.titulo.trim()) return;
    onSubmit(v);
  };

  return (
    <form onSubmit={handle} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <Label>Título *</Label>
          <Input required value={v.titulo} onChange={(e) => set("titulo", e.target.value)} />
        </div>
        <div>
          <Label>Data</Label>
          <Input type="date" value={v.data} onChange={(e) => set("data", e.target.value)} />
        </div>
        <div>
          <Label>Status</Label>
          <Select value={v.status} onValueChange={(val) => set("status", val as StatusReuniao)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {STATUSES.map((s) => (
                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Início</Label>
          <Input type="time" value={v.horario_inicio} onChange={(e) => set("horario_inicio", e.target.value)} />
        </div>
        <div>
          <Label>Término</Label>
          <Input type="time" value={v.horario_fim} onChange={(e) => set("horario_fim", e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <Label>Local</Label>
          <Input value={v.local} onChange={(e) => set("local", e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <Label>Pastor responsável</Label>
          <Input
            value={v.pastor_responsavel ?? ""}
            onChange={(e) => set("pastor_responsavel", e.target.value)}
          />
        </div>
        <div className="sm:col-span-2">
          <Label>Descrição</Label>
          <Textarea
            value={v.descricao ?? ""}
            onChange={(e) => set("descricao", e.target.value)}
            rows={3}
          />
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}
