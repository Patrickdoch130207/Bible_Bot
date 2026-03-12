import React, { useState } from "react";

const ChatInput = ({
  onSend,
  disabled,
}: {
  onSend: (text: string) => void;
  disabled: boolean;
}) => {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !disabled) {
      onSend(text);
      setText("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 bg-white border border-lumiere-dark/8 rounded-2xl px-4 py-3 shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-all focus-within:border-lumiere-teal/40 focus-within:shadow-[0_2px_16px_rgba(13,115,119,0.08)]"
    >
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={disabled}
        placeholder="Posez votre question biblique…"
        className="flex-1 bg-transparent text-[13.5px] text-lumiere-dark placeholder:text-lumiere-gray/50 focus:outline-none disabled:opacity-40"
      />

      <button
        type="submit"
        disabled={disabled || !text.trim()}
        className="w-8 h-8 flex items-center justify-center bg-lumiere-orange rounded-xl text-white hover:bg-lumiere-orange/90 active:scale-95 transition-all disabled:opacity-25 disabled:hover:bg-lumiere-orange shrink-0"
      >
        {disabled ? (
          <div className="w-3.5 h-3.5 border-[1.5px] border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        )}
      </button>
    </form>
  );
};

export default ChatInput;