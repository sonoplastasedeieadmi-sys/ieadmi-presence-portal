import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Perfil = "admin" | "pastor_presidente" | "secretaria" | "operador" | "consulta";

interface MockUser {
  nome: string;
  email: string;
  perfil: Perfil;
}

interface AuthCtx {
  user: MockUser | null;
  login: (email: string) => void;
  logout: () => void;
  canSeeFullCpf: boolean;
}

const Ctx = createContext<AuthCtx | null>(null);
const STORAGE_KEY = "ieadmi_mock_user";

export function MockAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as MockUser) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_KEY);
  }, [user]);

  const login = (email: string) => {
    setUser({
      nome: "Administrador IEADMI",
      email: email || "admin@ieadmi.org",
      perfil: "admin",
    });
  };

  const logout = () => setUser(null);

  const canSeeFullCpf =
    user?.perfil === "admin" ||
    user?.perfil === "pastor_presidente" ||
    user?.perfil === "secretaria";

  return (
    <Ctx.Provider value={{ user, login, logout, canSeeFullCpf }}>
      {children}
    </Ctx.Provider>
  );
}

export function useMockAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useMockAuth deve ser usado dentro de MockAuthProvider");
  return ctx;
}
