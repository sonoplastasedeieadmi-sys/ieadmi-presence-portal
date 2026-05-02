import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMockAuth } from "@/hooks/useMockAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import logo from "@/assets/logo-ieadmi.png";

export default function Login() {
  const { login } = useMockAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@ieadmi.org");
  const [senha, setSenha] = useState("ieadmi");
  const [loading, setLoading] = useState(false);

  const handle = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      login(email);
      navigate("/dashboard", { replace: true });
    }, 350);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "var(--gradient-primary)" }}
    >
      <div className="w-full max-w-md">
        <div className="bg-card rounded-2xl shadow-[var(--shadow-elevated)] p-8">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="h-32 w-32 rounded-3xl bg-primary-soft flex items-center justify-center mb-4 shadow-[0_12px_28px_rgba(10,35,90,0.14)]">
              <img src={logo} alt="Portal IEADMI Check-in" className="h-24 w-24 object-contain" />
            </div>
            <h1 className="text-2xl font-bold text-primary">Portal IEADMI</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Sistema de presença, acesso e missão
            </p>
          </div>

          <form onSubmit={handle} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="senha">Senha</Label>
              <Input
                id="senha"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full h-11 text-base" disabled={loading}>
              {loading ? "Entrando..." : "Entrar no Portal"}
            </Button>
          </form>

          <p className="text-xs text-muted-foreground text-center mt-6">
            Presença · Acesso · Missão
          </p>
        </div>
        <p className="text-center text-xs text-white/70 mt-4">
          IEADMI · Todos os direitos reservados
        </p>
      </div>
    </div>
  );
}
