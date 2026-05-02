import { useState } from "react";
import { useMockStore, Reuniao } from "@/store/mockStore";
import { Button } from "@/components/ui/button";
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
import { Plus, Pencil, Trash2, Play, Square } from "lucide-react";
import { ReuniaoForm } from "@/components/reunioes/ReuniaoForm";
import { formatDate } from "@/lib/format";
import { toast } from "sonner";

const STATUS_LABEL: Record<Reuniao["status"], { label: string; className: string }> = {
  agendada: { label: "Agendada", className: "bg-secondary text-secondary-foreground" },
  em_andamento: { label: "Em andamento", className: "bg-success text-success-foreground" },
  finalizada: { label: "Finalizada", className: "bg-muted text-muted-foreground" },
};

export default function Reunioes() {
  const { reunioes, addReuniao, updateReuniao, removeReuniao, iniciarReuniao, finalizarReuniao } =
    useMockStore();
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<Reuniao | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Reuniao | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-primary">Reuniões</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie as reuniões oficiais da IEADMI
          </p>
        </div>
        <Button onClick={() => setCreating(true)}>
          <Plus className="mr-2 h-4 w-4" /> Nova Reunião
        </Button>
      </div>

      <div className="grid gap-4">
        {reunioes.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              Nenhuma reunião cadastrada.
            </CardContent>
          </Card>
        )}
        {reunioes.map((r) => {
          const st = STATUS_LABEL[r.status];
          return (
            <Card key={r.id}>
              <CardContent className="pt-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg font-semibold text-primary-deep">{r.titulo}</h3>
                      <Badge className={st.className}>{st.label}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {formatDate(r.data)} · {r.horario_inicio} – {r.horario_fim} · {r.local}
                    </p>
                    {r.pastor_responsavel && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Pastor responsável: {r.pastor_responsavel}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {r.status !== "em_andamento" && r.status !== "finalizada" && (
                      <Button
                        size="sm"
                        onClick={() => {
                          iniciarReuniao(r.id);
                          toast.success("Reunião iniciada");
                        }}
                      >
                        <Play className="mr-1 h-4 w-4" /> Iniciar
                      </Button>
                    )}
                    {r.status === "em_andamento" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          finalizarReuniao(r.id);
                          toast.success("Reunião finalizada");
                        }}
                      >
                        <Square className="mr-1 h-4 w-4" /> Finalizar
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" onClick={() => setEditing(r)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setConfirmDelete(r)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
                {r.descricao && (
                  <p className="text-sm text-muted-foreground mt-3">{r.descricao}</p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={creating} onOpenChange={setCreating}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Nova reunião</DialogTitle></DialogHeader>
          <ReuniaoForm
            onCancel={() => setCreating(false)}
            onSubmit={(v) => {
              addReuniao(v);
              setCreating(false);
              toast.success("Reunião cadastrada");
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Editar reunião</DialogTitle></DialogHeader>
          {editing && (
            <ReuniaoForm
              initial={editing}
              onCancel={() => setEditing(null)}
              onSubmit={(v) => {
                updateReuniao(editing.id, v);
                setEditing(null);
                toast.success("Reunião atualizada");
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!confirmDelete} onOpenChange={(o) => !o && setConfirmDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir reunião?</AlertDialogTitle>
            <AlertDialogDescription>
              As presenças vinculadas a esta reunião também serão removidas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (confirmDelete) {
                  removeReuniao(confirmDelete.id);
                  toast.success("Reunião excluída");
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
