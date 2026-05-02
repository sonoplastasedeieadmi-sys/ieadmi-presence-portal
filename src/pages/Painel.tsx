import { useState, useEffect } from "react";
import { useMockStore } from "@/store/mockStore";
import { format } from "date-fns";
import logo from "@/assets/logo-ieadmi.png";
import { CheckCircle2, Maximize2, Users, Clock, MapPin, Sparkles } from "lucide-react";

export default function Painel() {
  const { reuniaoAtual, presencas, pessoas } = useMockStore();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 2000);
    
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'f') {
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      clearInterval(timer);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Erro ao tentar ativar modo tela cheia: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  if (!reuniaoAtual) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#071E49] via-[#0B2D73] to-[#1E4BA8] flex items-center justify-center text-[#FFFFFF] p-8">
        <div className="text-center animate-pulse max-w-xl">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 backdrop-blur border border-white/10">
            <img src={logo} alt="IEADMI" className="h-14 w-14 opacity-25" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white/70">
            Nenhuma reunião em andamento
          </h1>
          <p className="mt-3 text-sm md:text-base text-[#C8D5F0]/55">
            Inicie uma reunião no portal para exibir o painel do telão.
          </p>
        </div>
      </div>
    );
  }

  const reuniaoPresencas = presencas
    .filter((p) => p.reuniao_id === reuniaoAtual.id)
    .sort((a, b) => new Date(b.horario_entrada).getTime() - new Date(a.horario_entrada).getTime());

  const ultimosCheckins = reuniaoPresencas.slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#071E49] via-[#0B2D73] to-[#1E4BA8] text-[#FFFFFF] flex flex-col font-sans overflow-hidden selection:bg-[#34D399]/30">
      <div className="w-full max-w-[1600px] mx-auto flex flex-col min-h-screen px-5 py-5 md:px-8 md:py-7 xl:px-10 xl:py-8">
        <header className="flex items-center justify-between gap-4 mb-4 md:mb-6">
          <div className="flex items-center gap-4 min-w-0">
            <div className="bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/10">
              <img src={logo} alt="IEADMI" className="h-10 w-auto" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] font-bold tracking-[0.3em] text-[#C8D5F0]/60 uppercase leading-none mb-1">Portal IEADMI</span>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight leading-none">Painel de Presença</h1>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            <div className="text-right">
              <p className="text-[10px] font-bold text-[#C8D5F0]/50 mb-1 tracking-widest">{format(currentTime, "dd/MM/yyyy")}</p>
              <div className="flex items-center justify-end gap-2 text-lg md:text-xl font-bold tracking-tight">
                <Clock className="w-5 h-5 text-[#C8D5F0]/60" />
                <span className="tabular-nums">{reuniaoAtual.horario_inicio || "08:00"} — {reuniaoAtual.horario_fim || "12:00"}</span>
              </div>
            </div>
            <button 
              onClick={toggleFullscreen}
              className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/10 flex items-center justify-center group"
              aria-label="Alternar tela cheia"
            >
              <Maximize2 className="w-4 h-4 text-white/70 group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </header>

        <main className="flex-1 grid grid-rows-[auto_auto_1fr] gap-4 md:gap-5 xl:gap-6">
          <section className="text-center pt-2 md:pt-4">
            <h2 className="mx-auto max-w-[1200px] text-[clamp(2rem,4vw,4.5rem)] font-extrabold tracking-tight leading-[0.95] drop-shadow-xl text-balance">
              {reuniaoAtual.titulo}
            </h2>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-[#C8D5F0]/80">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm md:text-base backdrop-blur-md">
                <MapPin className="h-4 w-4 text-[#C8D5F0]/70" />
                {reuniaoAtual.local}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#34D399]/20 bg-[#34D399]/10 px-4 py-2 text-sm md:text-base text-[#34D399] font-semibold">
                <Sparkles className="h-4 w-4" />
                Atualização ao vivo
              </span>
            </div>
          </section>

          <section className="flex flex-col items-center justify-center">
            <div className="flex items-center gap-3 text-[#C8D5F0]/40 mb-3 font-bold tracking-[0.35em] uppercase text-[10px] md:text-[11px]">
              <Users className="w-3.5 h-3.5" />
              <span>Presentes</span>
            </div>

            <p className="text-[clamp(5rem,11vw,8.5rem)] leading-none font-black tabular-nums tracking-[-0.06em] mb-4 md:mb-5 drop-shadow-2xl">
              {reuniaoPresencas.length.toString().padStart(2, "0")}
            </p>

            <div className="flex items-center gap-2 px-5 py-2 bg-[#34D399]/5 rounded-full border border-[#34D399]/20 backdrop-blur-sm">
              <CheckCircle2 className="w-4 h-4 text-[#34D399]" />
              <span className="text-sm font-bold text-[#34D399]">Atualização ao vivo</span>
            </div>
          </section>

          <section className="w-full self-end">
            <div className="flex items-end justify-between gap-3 mb-3 px-1">
              <div>
                <h3 className="text-lg md:text-xl font-bold tracking-tight text-white/85">Últimos check-ins</h3>
                <p className="text-[11px] md:text-xs font-medium text-[#C8D5F0]/35 uppercase tracking-[0.22em] mt-1">
                  Nome, congregação, cargo e horário
                </p>
              </div>
              <span className="text-[10px] font-bold text-[#C8D5F0]/30 uppercase tracking-widest text-right">
                Mostrando os {reuniaoPresencas.length} mais recentes
              </span>
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-[2rem] md:rounded-[2.5rem] px-5 py-5 md:px-8 md:py-8 border border-white/10 shadow-2xl overflow-hidden">
              {reuniaoPresencas.length === 0 ? (
                <div className="text-center py-8 md:py-12">
                  <p className="text-base md:text-lg text-[#C8D5F0]/25 font-semibold tracking-wide italic">
                    Aguardando o primeiro check-in da reunião...
                  </p>
                </div>
              ) : (
                <div className="grid gap-3 md:gap-4 xl:grid-cols-2">
                  {ultimosCheckins.map((presenca, index) => {
                    const pessoa = pessoas.find((p) => p.id === presenca.pessoa_id);
                    if (!pessoa) return null;
                    return (
                      <div
                        key={presenca.id}
                        className="flex items-center justify-between gap-4 rounded-2xl border border-white/8 bg-white/5 px-4 py-4 md:px-5 md:py-5 shadow-[0_1px_0_rgba(255,255,255,0.04)]"
                        style={{ animationDelay: `${index * 60}ms` }}
                      >
                        <div className="min-w-0">
                          <p className="text-xl md:text-2xl xl:text-[1.9rem] font-extrabold leading-tight truncate">
                            {pessoa.nome_completo}
                          </p>
                          <p className="mt-1 text-[11px] md:text-xs uppercase tracking-[0.22em] text-[#C8D5F0]/45 truncate">
                            {pessoa.congregacao} • {pessoa.cargo_funcao || pessoa.tipo_pessoa}
                          </p>
                        </div>
                        <div className="shrink-0 text-right">
                          <p className="text-2xl md:text-3xl xl:text-4xl font-black text-[#34D399] tabular-nums tracking-tight">
                            {format(new Date(presenca.horario_entrada), "HH:mm")}
                          </p>
                          <p className="text-[10px] md:text-[11px] text-[#C8D5F0]/35 uppercase tracking-[0.22em] mt-1">
                            Entrada
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        </main>

        <footer className="mt-4 md:mt-5 pt-4 md:pt-5 border-t border-white/5 flex flex-col md:flex-row md:justify-between md:items-center gap-2 text-[9px] md:text-[10px] font-bold text-[#C8D5F0]/30 uppercase tracking-[0.2em]">
          <div>Portal IEADMI Check-in · Presença · Acesso · Missão</div>
          <div className="flex items-center gap-6">
            <span>Atualização a cada 2s · Pressione F para tela cheia</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
