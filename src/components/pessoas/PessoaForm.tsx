import { useState } from "react";
import { Pessoa, StatusPessoa, TipoPessoa } from "@/store/mockStore";
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
import { formatCpf, onlyDigits } from "@/lib/maskCpf";
import { formatPhone } from "@/lib/format";

export type PessoaFormValues = Omit<Pessoa, "id" | "criado_em">;

interface Props {
  initial?: Partial<Pessoa>;
  onSubmit: (values: PessoaFormValues) => void;
  onCancel?: () => void;
  submitLabel?: string;
  compact?: boolean;
}

const TIPOS: TipoPessoa[] = [
  "membro", "congregado", "obreiro", "pastor", "dirigente", "visitante",
  "diacono", "presbitero", "missionaria", "missionario", "evangelista"
];
const STATUSES: StatusPessoa[] = ["ativo", "inativo", "visitante", "pendente"];

export function PessoaForm({ initial, onSubmit, onCancel, submitLabel = "Salvar", compact }: Props) {
  const [v, setV] = useState<PessoaFormValues>({
    nome_completo: initial?.nome_completo ?? "",
    cpf: initial?.cpf ?? "",
    telefone: initial?.telefone ?? "",
    email: initial?.email ?? "",
    congregacao: initial?.congregacao ?? "",
    cargo_funcao: initial?.cargo_funcao ?? "",
    tipo_pessoa: (initial?.tipo_pessoa as TipoPessoa) ?? "membro",
    numero_credencial: initial?.numero_credencial ?? "",
    status: (initial?.status as StatusPessoa) ?? "ativo",
    observacoes: initial?.observacoes ?? "",
  });

  const set = <K extends keyof PessoaFormValues>(k: K, val: PessoaFormValues[K]) =>
    setV((prev) => ({ ...prev, [k]: val }));

  const handle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!v.nome_completo.trim()) return;
    onSubmit({ ...v, cpf: onlyDigits(v.cpf), telefone: onlyDigits(v.telefone) });
  };

  return (
    <form onSubmit={handle} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <Label>Nome completo *</Label>
          <Input
            required
            value={v.nome_completo}
            onChange={(e) => set("nome_completo", e.target.value)}
            placeholder="Nome completo"
          />
        </div>
        <div>
          <Label>CPF</Label>
          <Input
            value={formatCpf(v.cpf)}
            onChange={(e) => set("cpf", e.target.value)}
            placeholder="000.000.000-00"
            inputMode="numeric"
          />
        </div>
        <div>
          <Label>Telefone</Label>
          <Input
            value={formatPhone(v.telefone)}
            onChange={(e) => set("telefone", e.target.value)}
            placeholder="(11) 90000-0000"
            inputMode="tel"
          />
        </div>
        <div>
          <Label>Congregação *</Label>
          <Input
            required
            value={v.congregacao}
            onChange={(e) => set("congregacao", e.target.value)}
          />
        </div>
        <div>
          <Label>Cargo / Função</Label>
          <Input value={v.cargo_funcao} onChange={(e) => set("cargo_funcao", e.target.value)} />
        </div>
        <div>
          <Label>Tipo</Label>
          <Select value={v.tipo_pessoa} onValueChange={(val) => set("tipo_pessoa", val as TipoPessoa)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {TIPOS.map((t) => (
                <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Credencial</Label>
          <Input value={v.numero_credencial ?? ""} onChange={(e) => set("numero_credencial", e.target.value)} />
        </div>
        {!compact && (
          <>
            <div>
              <Label>Status</Label>
              <Select value={v.status} onValueChange={(val) => set("status", val as StatusPessoa)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => (
                    <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="sm:col-span-2">
              <Label>E-mail</Label>
              <Input type="email" value={v.email ?? ""} onChange={(e) => set("email", e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <Label>Observações</Label>
              <Textarea
                value={v.observacoes ?? ""}
                onChange={(e) => set("observacoes", e.target.value)}
                rows={3}
              />
            </div>
          </>
        )}
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
