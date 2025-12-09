import { create } from "zustand";
import type { RingConfig } from "@/interfaces";
import { RING_CONFIGS } from "@/config/ringConfig";

/* ============================================================
   TYPES
============================================================ */
export interface IRingLogic {
  current: number;
  max: number;
  multipliers: number[];
}

export interface GameStore {
  balance: number;
  spinning: boolean;
  history: { bet: number; win: number; id: number }[];
  canCashOut: boolean;

  // Full RingConfig for UI + logic
  rings: Record<string, RingConfig>;

  // Parsed progress state per ring
  ringProgress: Record<string, IRingLogic>;

  /* === Runtime spin function injected by GameCanvas === */
  runSpin: () => Promise<void>;
  setRunSpin: (fn: () => Promise<void>) => void;

  /* === Actions === */
  placeBet: (amount: number) => boolean;
  finishSpin: () => void;

  addProgress: (symbol: string) => void;
  resetAllProgress: () => void;
  cashout: () => number;
  addHistory: (bet: number, win: number) => void;

  /* === Selectors === */
  currentMultiplier: () => number;
}

/* ============================================================
   BUILD INITIAL STATE FROM RING_CONFIGS
============================================================ */
function makeRingProgressFromConfig(
  configs: RingConfig[]
): Record<string, IRingLogic> {
  return Object.fromEntries(
    configs
      .filter((cfg) => cfg.multipliers) // only rings with multipliers
      .map((cfg) => [
        cfg.name,
        {
          current: 0,
          max: cfg.segments?.count ?? 0,
          multipliers: cfg.multipliers!.map((m) =>
            Number(m.replace("X", ""))
          ),
        },
      ])
  );
}

/* ============================================================
   STORE
============================================================ */
export const useGameStore = create<GameStore>((set, get) => ({
  balance: 200,
  spinning: false,
  history: [],
  canCashOut: false,

  // full RingConfig for both UI + logic
  rings: Object.fromEntries(RING_CONFIGS.map((cfg) => [cfg.name, cfg])),

  // parsed numeric progress
  ringProgress: makeRingProgressFromConfig(RING_CONFIGS),

  /* ---------------------------------------
     runtime spin function injected later
  ---------------------------------------- */
  runSpin: async () => {
    console.warn("runSpin called before GameCanvas initialized");
  },

  setRunSpin: (fn: () => Promise<void>) => {
    set({ runSpin: fn });
  },

  /* ============================
     🎲 PLACE BET (does NOT spin UI directly)
     - deducts from balance
     - stores bet in history
     - kicks off runSpin()
  ============================ */
  placeBet: (amount: number) => {
    const { balance, spinning, runSpin } = get();
    if (amount <= 0 || amount > balance || spinning) return false;

    // set state first
    set({
      balance: balance - amount,
      spinning: true,
      canCashOut: false,
      history: [{ bet: amount, win: 0, id: Date.now() }, ...get().history],
    });

    // fire-and-forget PIXI spin
    void runSpin();

    return true;
  },

  /* ============================
     🎛 FINISH SPIN
     (called from GameCanvas runSpin after animation)
  ============================ */
  finishSpin: () => {
    set({ spinning: false });
  },

  /* ============================
     📈 PROGRESS
  ============================ */
  addProgress: (symbol: string) => {
    const rp = get().ringProgress[symbol];
    if (!rp) return;
    if (rp.current >= rp.max) return;

    set({
      ringProgress: {
        ...get().ringProgress,
        [symbol]: { ...rp, current: rp.current + 1 },
      },
      canCashOut: true,
    });
  },

  resetAllProgress: () => {
    set({
      ringProgress: Object.fromEntries(
        Object.entries(get().ringProgress).map(([key, rp]) => [
          key,
          { ...rp, current: 0 },
        ])
      ),
      canCashOut: false,
    });
  },

  /* ============================
     💰 CASHOUT
  ============================ */
  cashout: () => {
    const multiplier = get().currentMultiplier();
    const lastBet = get().history.at(0)?.bet ?? 0;
    const win = Math.max(0, lastBet * multiplier);

    if (win > 0) {
      set({
        balance: get().balance + win,
        canCashOut: false,
        history: [{ bet: lastBet, win, id: Date.now() }, ...get().history],
      });
    }

    get().resetAllProgress();
    return win;
  },

  /* ============================
     🧾 HISTORY
  ============================ */
  addHistory: (bet: number, win: number) => {
    set({
      history: [{ bet, win, id: Date.now() }, ...get().history].slice(0, 20),
    });
  },

  /* ============================
     🔍 MULTIPLIER SUM
  ============================ */
  currentMultiplier: () => {
    let total = 0;
    for (const rp of Object.values(get().ringProgress)) {
      for (let i = 0; i < rp.current; i++) {
        total += rp.multipliers[i];
      }
    }
    return total;
  },
}));
