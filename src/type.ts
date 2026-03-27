export type TickerUpdate = { coin: string; price: number; timestamp: number };

export type TickerState = { price: number; prev: number; history: number[] };
