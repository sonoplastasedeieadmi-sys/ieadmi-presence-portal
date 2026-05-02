import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";

export default function Privacidade() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-xl bg-primary-soft flex items-center justify-center">
          <ShieldCheck className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-primary">Aviso de Privacidade</h1>
          <p className="text-sm text-muted-foreground">Tratamento de dados conforme a LGPD</p>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Dados que coletamos</CardTitle></CardHeader>
        <CardContent className="text-sm leading-relaxed space-y-3 text-muted-foreground">
          <p>
            O Portal IEADMI Check-in coleta apenas os dados necessários ao controle de presença em
            reuniões oficiais: <strong>nome completo, CPF, telefone, congregação, cargo/função</strong>{" "}
            e, quando aplicável, <strong>número de credencial</strong>.
          </p>
          <p>
            Dados opcionais como e-mail, foto, data de nascimento e endereço só são solicitados
            quando estritamente necessários para fins administrativos do ministério.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Finalidade</CardTitle></CardHeader>
        <CardContent className="text-sm leading-relaxed space-y-3 text-muted-foreground">
          <p>
            Os dados são utilizados exclusivamente para registro de presença, organização das
            reuniões ministeriais e comunicação institucional da IEADMI.
          </p>
          <p>Nenhum dado é compartilhado com terceiros para fins comerciais.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Direitos do titular</CardTitle></CardHeader>
        <CardContent className="text-sm leading-relaxed space-y-3 text-muted-foreground">
          <p>
            Em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018), o titular pode
            solicitar a qualquer momento: confirmação da existência de tratamento, acesso, correção,
            anonimização ou eliminação de seus dados pessoais.
          </p>
          <p>
            Para exercer estes direitos, contate a secretaria da IEADMI.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Segurança</CardTitle></CardHeader>
        <CardContent className="text-sm leading-relaxed space-y-3 text-muted-foreground">
          <p>
            O acesso ao sistema é restrito a usuários autorizados, com diferentes níveis de
            permissão. O CPF é exibido de forma mascarada para perfis sem necessidade operacional de
            visualização completa.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
