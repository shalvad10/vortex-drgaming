"use client";
import { useState } from "react";
import BetPanel from "@/components/BetPanel";
import { GameCanvas } from "@/components/game/GameCanvas";

type HistoryItem = { id: number; bet: number; win: number };

export default function GamePage() {
  const [balance, setBalance] = useState(200);
  const [spinning, setSpinning] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [currentBet, setCurrentBet] = useState(0);

  const runSpin = async (bet: number) => {
    const spin = (window as any).spinSlots;
    if (typeof spin !== "function") return;

    setSpinning(true);
    setCurrentBet(bet);
    await spin();
    setSpinning(false);
  };

  const onBet = async (amount: number) => {
    if (spinning) return;
    if (amount <= 0 || amount > balance) return;

    setBalance((b) => b - amount);
    await runSpin(amount);
  };

  const handleCashOut = () => {
    const rings = (window as any).rings;
    if (!rings || !currentBet) return;

    const totalMultiplier: number =
      typeof rings.getTotalMultiplier === "function"
        ? rings.getTotalMultiplier()
        : 0;

    if (totalMultiplier <= 0) {
      // still clear progress if you want
      if (typeof rings.resetAllProgress === "function") {
        rings.resetAllProgress();
      }
      return;
    }

    const win = currentBet * totalMultiplier;
    setBalance((b) => b + win);

    setHistory((prev) => [
      { id: Date.now(), bet: currentBet, win },
      ...prev,
    ]);

    if (typeof rings.resetAllProgress === "function") {
      rings.resetAllProgress();
    }
    setCurrentBet(0);
  };

  const canCashOut = currentBet > 0;

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[var(--bg-dark)] gap-6">
      <GameCanvas />
      <BetPanel
        balance={balance}
        history={history}
        disabled={spinning}
        onBet={onBet}
        onCashOut={handleCashOut}
        canCashOut={canCashOut}
      />
    </div>
  );
}
