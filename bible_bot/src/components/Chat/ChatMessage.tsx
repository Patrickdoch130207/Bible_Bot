import React from "react";

const ChatMessage = ({ message }: { message: any }) => {
  const isAssistant = message.role === "assistant";

  const sources = React.useMemo(() => {
    if (!message.sources) return [];
    if (Array.isArray(message.sources)) return message.sources;
    if (typeof message.sources === "string") {
      try {
        const parsed = JSON.parse(message.sources);
        return Array.isArray(parsed) ? parsed : [];
      } catch { return []; }
    }
    return [];
  }, [message.sources]);

  return (
    <div className={`flex ${isAssistant ? "justify-start" : "justify-end"} w-full`}>
      <div
        className={`
          max-w-[88%] rounded-2xl px-4 py-3.5
          ${isAssistant
            ? "bg-white shadow-[0_1px_8px_rgba(0,0,0,0.06)] border border-lumiere-dark/5"
            : "bg-lumiere-teal text-white"
          }
        `}
      >
        {/* Label expéditeur */}
        <p className={`text-[10px] font-semibold uppercase tracking-widest mb-2 ${
          isAssistant ? "text-lumiere-teal" : "text-white/60"
        }`}>
          {isAssistant ? "Lumière" : "Vous"}
        </p>

        {/* Contenu */}
        <p className={`text-[13.5px] leading-relaxed whitespace-pre-wrap ${
          isAssistant ? "text-lumiere-dark/85" : "text-white"
        }`}>
          {message.content}
        </p>

        {/* ── Versets sources ── */}
        {isAssistant && sources.length > 0 && (
          <div className="mt-4 pt-3.5 border-t border-lumiere-dark/6">
            <p className="text-[9px] font-semibold text-lumiere-gray/60 uppercase tracking-[0.2em] mb-2.5">
              Versets de référence
            </p>
            <div className="space-y-2">
              {sources.map((source: {
                livre: string;
                chapitre: number | string;
                verset: number | string;
                texte: string;
              }, idx: number) => (
                <div key={idx} className="pl-3 border-l-[2px] border-lumiere-orange/60">
                  <p className="text-[10px] font-semibold text-lumiere-orange mb-0.5">
                    {source.livre} {source.chapitre}:{source.verset}
                  </p>
                  <p className="text-[12px] text-lumiere-gray/80 leading-snug italic">
                    {source.texte}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;