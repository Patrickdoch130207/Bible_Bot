import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ChatMessage from "../components/Chat/ChatMessage";
import ChatInput from "../components/Chat/ChatInput";
import { getOrCreateUserId } from "../utils/auth";

const ChatPage = ({ onNewConversation }: { onNewConversation?: () => void }) => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const userId = getOrCreateUserId();
  const API_URL = "https://patrick130207-bible-bot-api.hf.space";

  const [messages, setMessages] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false); // chargement d'une conv existante
  const [isLoadingReply, setIsLoadingReply] = useState(false);     // attente réponse LLM
  const bottomRef = useRef<HTMLDivElement>(null);

  // Scroll automatique
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoadingReply]);

  // Charger les messages quand on change de conversation
  useEffect(() => {
    const fetchMessages = async () => {
      if (!conversationId) {
        setMessages([]);
        return;
      }
      setIsLoadingHistory(true);
      setMessages([]); // Vider immédiatement pour afficher l'écran de chargement propre
      try {
        const response = await fetch(`${API_URL}/messages/${conversationId}`);
        if (response.ok) {
          const data = await response.json();
          setMessages(data);
        }
      } catch (error) {
        console.error("Erreur chargement messages:", error);
      } finally {
        setIsLoadingHistory(false);
      }
    };
    fetchMessages();
  }, [conversationId]);

  const handleSendMessage = async (text: string) => {
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setIsLoadingReply(true);

    try {
      const response = await fetch(`${API_URL}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          text,
          conversation_id: conversationId || null,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.answer, sources: data.context },
        ]);
        if (!conversationId && data.conversation_id) {
          navigate(`/chat/${data.conversation_id}`, { replace: true });
          onNewConversation?.(); // Recharge la sidebar sans refresh
        }
      }
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setIsLoadingReply(false);
    }
  };

  // ── Écran de chargement d'une conversation existante ──
  if (isLoadingHistory) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-6">
          <div className="w-12 h-12 rounded-2xl bg-lumiere-teal/10 flex items-center justify-center">
            <span className="text-xl">🕊️</span>
          </div>
          <div className="space-y-1.5">
            <p className="text-[13px] font-medium text-lumiere-dark/70">Chargement de la discussion</p>
            <div className="flex gap-1 justify-center">
              <span className="w-1.5 h-1.5 bg-lumiere-teal/50 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1.5 h-1.5 bg-lumiere-teal/50 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1.5 h-1.5 bg-lumiere-teal/50 rounded-full animate-bounce" />
            </div>
          </div>
        </div>
        {/* Input désactivé pendant le chargement */}
        <div className="px-4 pb-4 pt-2">
          <ChatInput onSend={() => {}} disabled={true} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">

      {/* Zone messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">

        {messages.length === 0 && !isLoadingReply ? (
          /* ── Écran d'accueil (nouvelle conv) ── */
          <div className="h-full min-h-[60vh] flex flex-col items-center justify-center text-center px-6 space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-lumiere-teal flex items-center justify-center shadow-sm">
              <span className="text-2xl">🕊️</span>
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-lumiere-dark tracking-tight">
                Comment puis-je vous éclairer ?
              </h2>
              <p className="text-[13px] text-lumiere-gray/70 max-w-xs leading-relaxed">
                Posez une question sur la Bible ou demandez un conseil spirituel.
              </p>
            </div>
          </div>
        ) : (
          messages.map((msg, index) => (
            <ChatMessage key={index} message={msg} />
          ))
        )}

        {/* Indicateur de frappe Lumière */}
        {isLoadingReply && (
          <div className="flex justify-start w-full">
            <div className="bg-white border border-lumiere-dark/5 rounded-2xl px-4 py-3 shadow-[0_1px_8px_rgba(0,0,0,0.05)] flex items-center gap-2.5">
              <span className="text-sm">🕊️</span>
              <div className="flex gap-1 items-center">
                <span className="w-1.5 h-1.5 bg-lumiere-teal/60 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 bg-lumiere-teal/60 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 bg-lumiere-teal/60 rounded-full animate-bounce" />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Barre d'input */}
      <div className="px-4 pb-4 pt-2">
        <ChatInput onSend={handleSendMessage} disabled={isLoadingReply} />
      </div>

    </div>
  );
};

export default ChatPage;