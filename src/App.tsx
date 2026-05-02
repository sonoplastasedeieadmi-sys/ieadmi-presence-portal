import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MockAuthProvider } from "@/hooks/useMockAuth";
import { MockStoreProvider } from "@/store/mockStore";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import AppLayout from "@/components/layout/AppLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Pessoas from "./pages/Pessoas";
import PessoaDetalhes from "./pages/PessoaDetalhes";
import Reunioes from "./pages/Reunioes";
import Checkin from "./pages/Checkin";
import Privacidade from "./pages/Privacidade";
import NotFound from "./pages/NotFound";
import Painel from "./pages/Painel";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <MockAuthProvider>
        <MockStoreProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<Login />} />
              <Route
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/checkin" element={<Checkin />} />
                <Route path="/pessoas" element={<Pessoas />} />
                <Route path="/pessoas/:id" element={<PessoaDetalhes />} />
                <Route path="/reunioes" element={<Reunioes />} />
                <Route path="/privacidade" element={<Privacidade />} />
              </Route>
              <Route path="/painel" element={<Painel />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </MockStoreProvider>
      </MockAuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
