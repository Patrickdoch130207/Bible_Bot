import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import HistorySidebar from "../components/History/HistorySidebar";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const refreshHistoryRef = useRef<(() => void) | null>(null);
  const navigate = useNavigate();

  // Appelé par ChatPage quand une nouvelle conv est créée → recharge la sidebar
  const handleNewConversation = () => {
    refreshHistoryRef.current?.();
  };

  return (
    <div className="flex h-screen w-full bg-lumiere-cream text-lumiere-dark overflow-hidden">

      {/* Sidebar — reçoit une ref pour exposer son refresh */}
      <HistorySidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        registerRefresh={(fn) => { refreshHistoryRef.current = fn; }}
      />

      {/* Overlay mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-lumiere-dark/40 backdrop-blur-[2px] z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Zone principale */}
      <main className="flex-1 flex flex-col min-w-0 h-full">

        {/* ── Topbar (mobile + desktop) ── */}
        <header className="flex items-center px-5 py-4 bg-lumiere-cream/90 backdrop-blur-sm border-b border-lumiere-dark/6 sticky top-0 z-30">

          {/* Burger — même côté que la sidebar (gauche) */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="w-9 h-9 flex flex-col items-center justify-center gap-[5px] hover:bg-lumiere-dark/5 rounded-xl transition-colors"
            aria-label="Ouvrir le menu"
          >
            <span className="w-5 h-[1.5px] bg-lumiere-dark/70 rounded-full block" />
            <span className="w-3.5 h-[1.5px] bg-lumiere-dark/70 rounded-full block self-start ml-[5px]" />
          </button>

          {/* Logo centré */}
          <div className="flex-1 flex items-center justify-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-lumiere-teal flex items-center justify-center shadow-sm">
              <span className="text-xs leading-none">🕊️</span>
            </div>
            <span className="text-[14px] font-semibold tracking-[0.12em] text-lumiere-dark uppercase">
              Lumière
            </span>
          </div>

          {/* Icône nouvelle discussion — remplace le spacer balancier */}
          <button
            onClick={() => navigate("/")}
            title="Nouvelle discussion"
            className="w-9 h-9 flex items-center justify-center hover:bg-lumiere-dark/5 rounded-xl transition-colors group relative"
            aria-label="Nouvelle discussion"
          >
            <svg className="w-[18px] h-[18px] text-lumiere-dark/60" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
            </svg>
            {/* Tooltip */}
            <span className="absolute -bottom-8 right-0 bg-lumiere-dark text-lumiere-cream text-[10px] font-medium px-2 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none">
              Nouvelle discussion
            </span>
          </button>
        </header>

        {/* Contenu + footer */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-2xl mx-auto w-full h-full">
              {/* On passe le callback aux enfants via React.cloneElement */}
              {React.isValidElement(children)
                ? React.cloneElement(children as React.ReactElement<any>, { onNewConversation: handleNewConversation })
                : children}
            </div>
          </div>

          <footer className="py-2.5">
            <p className="text-[10px] text-center text-lumiere-gray/60 tracking-wide">
              Lumière peut faire des erreurs · Vérifiez avec les Saintes Écritures
            </p>
          </footer>
        </div>

      </main>
    </div>
  );
};

export default MainLayout;