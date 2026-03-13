import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getOrCreateUserId } from "../../utils/auth";

const HistorySidebar = ({ isOpen, onClose, registerRefresh }) => {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { conversationId: activeId } = useParams();
  const API_URL = "https://patrick130207-bible-bot-api.hf.space";
  const userId = getOrCreateUserId();

  const fetchHistory = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/history/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setHistory(data);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération de l'historique:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchHistory();
  }, [userId]);

  // Expose fetchHistory au parent via registerRefresh
  useEffect(() => {
    registerRefresh?.(fetchHistory);
  }, []);

  const handleDelete = async (e: React.MouseEvent, convId: string) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await fetch(`${API_URL}/conversations/${convId}`, { method: "DELETE" });
      setHistory((prev) => prev.filter((c) => c._id !== convId));
      // Si on supprime la conv active → retour accueil
      if (activeId === convId) {
        navigate("/");
        onClose();
      }
    } catch (err) {
      console.error("Erreur suppression:", err);
    }
  };

  const handlePin = async (e: React.MouseEvent, convId: string, currentPinned: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const response = await fetch(`${API_URL}/conversations/${convId}/pin`, { method: "PATCH" });
      if (response.ok) {
        const data = await response.json();
        setHistory((prev) =>
          prev
            .map((c) => (c._id === convId ? { ...c, pinned: data.pinned } : c))
            .sort((a, b) => {
              if (a.pinned === b.pinned) return 0;
              return a.pinned ? -1 : 1;
            })
        );
      }
    } catch (err) {
      console.error("Erreur pin:", err);
    }
  };

  const pinned = history.filter((c) => c.pinned && (!search || (c.title || "").toLowerCase().includes(search.toLowerCase())));
  const recent = history.filter((c) => !c.pinned && (!search || (c.title || "").toLowerCase().includes(search.toLowerCase())));

  const ConvItem = ({ conv }: { conv: any }) => {
    const isActive = activeId === conv._id;
    const isHovered = hoveredId === conv._id;

    return (
      <div
        className="relative group"
        onMouseEnter={() => setHoveredId(conv._id)}
        onMouseLeave={() => setHoveredId(null)}
      >
        <Link
          to={`/chat/${conv._id}`}
          onClick={onClose}
          className={`flex items-center pl-3 pr-16 py-2.5 rounded-xl text-[13px] transition-all truncate ${
            isActive
              ? "bg-white/10 text-lumiere-cream"
              : "text-lumiere-gray/70 hover:text-lumiere-cream hover:bg-white/6"
          }`}
        >
          {conv.pinned && (
            <span className="mr-1.5 text-lumiere-orange/70 text-[9px]">📌</span>
          )}
          <span className="truncate">
            {conv.title || "Discussion en cours…"}
          </span>
        </Link>

        {/* Actions au hover */}
        <div
          className={`absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-0.5 transition-opacity duration-150 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Épingler */}
          <button
            onClick={(e) => handlePin(e, conv._id, conv.pinned)}
            title={conv.pinned ? "Désépingler" : "Épingler"}
            className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-white/10 text-lumiere-gray/50 hover:text-lumiere-orange transition-colors"
          >
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill={conv.pinned ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>

          {/* Supprimer */}
          <button
            onClick={(e) => handleDelete(e, conv._id)}
            title="Supprimer"
            className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-white/10 text-lumiere-gray/50 hover:text-red-400 transition-colors"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    );
  };

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-50 w-[270px] bg-lumiere-dark
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      <div className="flex flex-col h-full px-4 py-5">

        {/* ── Bouton fermer (mobile uniquement) ── */}
        <div className="md:hidden flex justify-end mb-3">
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center hover:bg-white/8 rounded-xl transition-colors text-lumiere-gray/50 hover:text-lumiere-gray"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ── Recherche ── */}
        <div className="relative mb-6">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-lumiere-gray/40 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher…"
            className="w-full bg-white/6 border border-white/8 rounded-xl pl-8 pr-8 py-2 text-[12.5px] text-lumiere-cream placeholder:text-lumiere-gray/35 focus:outline-none focus:border-lumiere-teal/50 transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-lumiere-gray/40 hover:text-lumiere-gray transition-colors"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* ── Nouvelle discussion ── */}
        <button
          onClick={() => { navigate("/"); onClose(); }}
          className="flex items-center gap-2.5 w-full px-3.5 py-2.5 mb-6 rounded-xl border border-lumiere-orange/40 text-lumiere-orange text-[13px] font-medium hover:bg-lumiere-orange hover:text-white hover:border-lumiere-orange transition-all duration-200 group"
        >
          <span className="text-base leading-none group-hover:rotate-90 transition-transform duration-200">+</span>
          Nouvelle discussion
        </button>

        {/* ── Historique ── */}
        <nav className="flex-1 overflow-y-auto custom-scrollbar -mr-1 pr-1 space-y-4">

          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-9 bg-white/5 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : history.length === 0 ? (
            <p className="text-[12px] text-lumiere-gray/40 italic px-1 mt-4">
              Aucune discussion pour le moment
            </p>
          ) : pinned.length === 0 && recent.length === 0 ? (
            <p className="text-[12px] text-lumiere-gray/40 italic px-1 mt-4">
              Aucun résultat pour « {search} »
            </p>
          ) : (
            <>
              {/* Épinglés */}
              {pinned.length > 0 && (
                <div>
                  <p className="text-[10px] text-lumiere-gray/50 uppercase tracking-[0.2em] font-medium mb-2 px-1">
                    Épinglés
                  </p>
                  <div className="space-y-0.5">
                    {pinned.map((conv) => <ConvItem key={conv._id} conv={conv} />)}
                  </div>
                </div>
              )}

              {/* Récents */}
              {recent.length > 0 && (
                <div>
                  <p className="text-[10px] text-lumiere-gray/50 uppercase tracking-[0.2em] font-medium mb-2 px-1">
                    Récents
                  </p>
                  <div className="space-y-0.5">
                    {recent.map((conv) => <ConvItem key={conv._id} conv={conv} />)}
                  </div>
                </div>
              )}
            </>
          )}
        </nav>

        {/* ── Footer utilisateur ── */}
        <div className="mt-4 pt-4 border-t border-white/8 flex items-center gap-3 px-1">
          <div className="w-8 h-8 rounded-xl bg-lumiere-orange/15 flex items-center justify-center text-lumiere-orange text-[11px] font-bold border border-lumiere-orange/20 shrink-0">
            U
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[12px] text-lumiere-cream/80 font-medium">Utilisateur</span>
            <span className="text-[10px] text-lumiere-gray/40 truncate">
              {userId.substring(0, 8)}···
            </span>
          </div>
        </div>

      </div>
    </aside>
  );
};

export default HistorySidebar;