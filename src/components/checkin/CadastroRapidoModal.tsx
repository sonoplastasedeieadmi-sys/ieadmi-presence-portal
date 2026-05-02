import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PessoaForm, PessoaFormValues } from "@/components/pessoas/PessoaForm";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSave: (values: PessoaFormValues) => void;
}

export function CadastroRapidoModal({ open, onOpenChange, onSave }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Cadastro rápido</DialogTitle>
        </DialogHeader>
        <PessoaForm
          compact
          submitLabel="Cadastrar e registrar entrada"
          onSubmit={(v) => {
            onSave(v);
            onOpenChange(false);
          }}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
