import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useMockStore, Pessoa, TipoPessoa } from "@/store/mockStore";
import { useMockAuth } from "@/hooks/useMockAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Pencil, Trash2, Eye, Search } from "lucide-react";
import { displayCpf, onlyDigits } from "@/lib/maskCpf";
import { PessoaForm } from "@/components/pessoas/PessoaForm";
import { toast } from "sonner";

const TIPOS: ("todos" | TipoPessoa)[] = [
  "todos", "membro", "congregado", "obreiro", "pastor", "dirigente", "visitante",
];

export default function Pessoas() {
  const { pessoas, addPessoa, updatePessoa, removePessoa } = useMockStore();
  const { canSeeFullCpf } = useMockAuth();
  const [busca, setBusca] = useState("");
  const [filtroTipo, setFiltroTipo] = useState<"todos" | TipoPessoa>("todos");
  const [editing, setEditing] = useState<Pessoa | null>(null);
  const [creating, setCreating] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Pessoa | null>(null);

  const filtradas = useMemo(() => {
    const q = busca.trim().toLowerCase();
    const qDigits = onlyDigits(busca);
    return pessoas.filter((p) => {
      if (filtroTipo !== "todos" && p.tipo_pessoa !== filtroTipo) return false;
      if (!q) return true;
      return (
        p.nome_completo.toLowerCase().includes(q) ||
        p.congregacao.toLowerCase().includes(q) ||
        (qDigits && p.cpf.includes(qDigits))
      );
    });
  }, [pessoas, busca, filtroTipo]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-primary">Pessoas</h1>
          <p className="text-sm text-muted-foreground">
            {pessoas.length} pessoa{pessoas.length === 1 ? "" : "s"} cadastrada
            {pessoas.length === 1 ? "" : "s"}
          </p>
        </div>
        <Button onClick={() => setCreating(true)}>
          <Plus className="mr-2 h-4 w-4" /> Nova Pessoa
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar por nome, CPF ou congregação"
                className="pl-9"
              />
            </div>
            <Select value={filtroTipo} onValueChange={(v) => setFiltroTipo(v as any)}>
              <SelectTrigger className="sm:w-56"><SelectValue /></SelectTrigger>
              <SelectContent>
                {TIPOS.map((t) => (
                  <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr className="text-left">
                  <th className="px-4 py-2 font-medium">Nome</th>
                  <th className="px-4 py-2 font-medium hidden md:table-cell">CPF</th>
                  <th className="px-4 py-2 font-medium hidden lg:table-cell">Congregação</th>
                  <th className="px-4 py-2 font-medium">Tipo</th>
                  <th className="px-4 py-2 font-medium text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtradas.map((p) => (
                  <tr key={p.id} className="border-t hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <p className="font-medium">{p.nome_completo}</p>
                      <p className="text-xs text-muted-foreground md:hidden">
                        {displayCpf(p.cpf, canSeeFullCpf)}
                      </p>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell font-mono text-xs">
                      {displayCpf(p.cpf, canSeeFullCpf)}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">{p.congregacao}</td>
                    <td className="px-4 py-3">
                      <Badge variant="secondary" className="capitalize">{p.tipo_pessoa}</Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <Button asChild size="sm" variant="ghost">
                          <Link to={`/pessoas/${p.id}`}><Eye className="h-4 w-4" /></Link>
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setEditing(p)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setConfirmDelete(p)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtradas.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">
                      Nenhuma pessoa encontrada.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={creating} onOpenChange={setCreating}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Nova pessoa</DialogTitle></DialogHeader>
          <PessoaForm
            onCancel={() => setCreating(false)}
            onSubmit={(v) => {
              addPessoa(v);
              setCreating(false);
              toast.success("Pessoa cadastrada com sucesso");
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Editar pessoa</DialogTitle></DialogHeader>
          {editing && (
            <PessoaForm
              initial={editing}
              onCancel={() => setEditing(null)}
              onSubmit={(v) => {
                updatePessoa(editing.id, v);
                setEditing(null);
                toast.success("Cadastro atualizado");
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!confirmDelete} onOpenChange={(o) => !o && setConfirmDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir cadastro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Todos os check-ins desta pessoa também serão removidos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (confirmDelete) {
                  removePessoa(confirmDelete.id);
                  toast.success("Cadastro excluído");
                }
                setConfirmDelete(null);
              }}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
