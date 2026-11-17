import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
        {isAssistant ? (
          <div className="text-[13.5px] leading-relaxed text-lumiere-dark/85 space-y-2.5">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => (
                  <h1 className="text-[16px] font-bold text-lumiere-dark mt-3 mb-1.5">{children}</h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-[15px] font-bold text-lumiere-dark mt-3.5 mb-1.5">{children}</h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-[14px] font-semibold text-lumiere-dark mt-3 mb-1">{children}</h3>
                ),
                p: ({ children }) => (
                  <p className="leading-relaxed">{children}</p>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold text-lumiere-dark">{children}</strong>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc pl-5 space-y-1">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal pl-5 space-y-1">{children}</ol>
                ),
                hr: () => (
                  <hr className="my-3 border-lumiere-dark/10" />
                ),
                table: ({ children }) => (
                  <div className="overflow-x-auto my-2.5 rounded-lg border border-lumiere-dark/10">
                    <table className="w-full text-left border-collapse text-[12.5px]">
                      {children}
                    </table>
                  </div>
                ),
                thead: ({ children }) => (
                  <thead className="bg-lumiere-dark/5 text-lumiere-dark font-semibold">
                    {children}
                  </thead>
                ),
                th: ({ children }) => (
                  <th className="px-3 py-2 border-b border-lumiere-dark/10">{children}</th>
                ),
                td: ({ children }) => (
                  <td className="px-3 py-2 border-b border-lumiere-dark/5 align-top">{children}</td>
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        ) : (
          <p className="text-[13.5px] leading-relaxed whitespace-pre-wrap text-white">
            {message.content}
          </p>
        )}

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
