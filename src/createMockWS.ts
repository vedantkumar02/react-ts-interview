import type { TickerUpdate } from "./type";

export default function createMockWS(onMessage: (data: TickerUpdate) => void) {
  const coins = ["BTC", "ETH"];

  const prices: Record<string, number> = { BTC: 65000, ETH: 3200 };

  const interval = setInterval(() => {
    const coin = coins[Math.floor(Math.random() * 2)];

    const delta = (Math.random() - 0.49) * 50;

    prices[coin] = parseFloat((prices[coin] + delta).toFixed(2));

    onMessage({ coin, price: prices[coin], timestamp: Date.now() });
  }, 100);

  return { close: () => clearInterval(interval) };
}
