"use client";

import { useState } from "react";
import { useGameStore } from "@/store/gameStore";

export default function BetPanel() {
  const [amount, setAmount] = useState("");

  const {
    balance,
    spinning,
    canCashOut,
    history,
    placeBet,
    cashout,
    currentMultiplier,
  } = useGameStore();

  const chips = [5, 10, 20, 50];

  const handleBet = () => {
    const val = Number(amount);
    if (!val || val <= 0 || val > balance || spinning) return;
    placeBet(val);
  };

  const handleChip = (v: number) => {
    if (spinning) return;
    setAmount((p) => String(Number(p || 0) + v));
  };

  const possibleWin = Number(amount) * (currentMultiplier() - 1);
  const showWin = possibleWin > 0;

  return (
    <div className="w-full max-w-[960px] neon-border text-white px-4 py-4 md:px-5 md:py-4 rounded-xl flex flex-col gap-4 md:flex-row md:items-center md:gap-4">
      {/* BALANCE */}
      <div className="flex justify-between md:flex-col md:items-start md:min-w-[130px]">
        <span className="text-sm opacity-70">Balance</span>
        <span className="font-bold text-[var(--accent)] text-lg">
          ${balance.toFixed(2)}
        </span>
      </div>

      {/* CHIPS */}
      <div className="flex flex-wrap gap-2 justify-center md:flex-1">
        {chips.map((c) => (
          <button
            key={c}
            disabled={spinning}
            onClick={() => handleChip(c)}
            className="neon-chip px-3 py-1 text-sm disabled:opacity-30 active:scale-90 transition-transform"
          >
            +{c}
          </button>
        ))}
        <button
          disabled={spinning}
          onClick={() => setAmount(String(balance))}
          className="neon-chip px-3 py-1 text-sm disabled:opacity-30"
        >
          MAX
        </button>
      </div>

      {/* INPUT + PLACE BET + CASHOUT */}
      <div className="flex flex-col items-stretch gap-2 md:flex-row md:items-center md:gap-3">
        <div className="flex flex-col items-center">
          <input
            type="number"
            disabled={spinning}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Bet"
            className="w-full md:w-[120px] text-center text-lg p-2 rounded-lg bg-[var(--panel-mid)] border border-[var(--border)] focus:border-[var(--accent)] outline-none disabled:opacity-40 transition-colors"
          />

          {showWin && (
            <span className="text-xs text-[var(--success)] mt-1 animate-pulse">
              +${possibleWin.toFixed(2)} potential
            </span>
          )}
        </div>

        <div className="flex flex-row gap-2 w-full md:w-auto">
          <button
            disabled={spinning}
            onClick={handleBet}
            className="neon-btn px-4 py-2 text-sm disabled:opacity-40 whitespace-nowrap flex-1 md:flex-none"
          >
            {spinning ? "SPINNING..." : "PLACE BET"}
          </button>

          <button
            className="neon-btn px-4 py-2 text-sm whitespace-nowrap"
            disabled={!canCashOut}
            onClick={cashout}
          >
            CASHOUT
          </button>
        </div>
      </div>

      {/* HISTORY */}
      <div className="text-xs opacity-80 max-h-[80px] overflow-y-auto border-t border-[var(--border)] pt-2 md:border-t-0 md:pt-0 md:min-w-[140px] md:text-right">
        <div className="font-bold opacity-60 mb-1">History</div>
        {history.length === 0 && <div className="opacity-40">—</div>}

        {history.map((h) => (
          <div
            key={h.id}
            className={`flex justify-between md:justify-end gap-4 transition-all ${
              h.win > 0
                ? "text-[var(--success)] animate-[pulse_0.5s]"
                : "opacity-50"
            }`}
          >
            <span>${h.bet}</span>
            <span>{h.win > 0 ? `+${h.win}` : h.win}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
