import { useEffect, useMemo, useRef, useState } from "react";
import createMockWS from "./createMockWS";
import type { TickerState, TickerUpdate } from "./type";

type CoinTickerState = {
  BTC: TickerState;
  ETH: TickerState;
};

export default function CryptoTicker() {
  const [ticker, setTicker] = useState<CoinTickerState>({
    BTC: {
      price: 0,
      prev: 0,
      history: [],
    },
    ETH: {
      price: 0,
      prev: 0,
      history: [],
    },
  });

  const tickerRef = useRef<CoinTickerState>({
    BTC: {
      price: 0,
      prev: 0,
      history: [],
    },
    ETH: {
      price: 0,
      prev: 0,
      history: [],
    },
  });

  useEffect(() => {
    const ws = createMockWS((data: TickerUpdate) => {
      const coin = data.coin as keyof CoinTickerState;

      const current = tickerRef.current[coin];

      tickerRef.current[coin] = {
        price: data.price,
        prev: current.price,
        history: [...current.history, data.price].slice(-20),
      };
    });

    const id = setInterval(() => {
      setTicker({
        BTC: {
          price: tickerRef.current.BTC.price,
          prev: tickerRef.current.BTC.prev,
          history: [...tickerRef.current.BTC.history],
        },
        ETH: {
          price: tickerRef.current.ETH.price,
          prev: tickerRef.current.ETH.prev,
          history: [...tickerRef.current.ETH.history],
        },
      });
    }, 500);

    return () => {
      ws.close();
      clearInterval(id);
    };
  }, []);

  return (
    <div>
      <TickerCard coin="BTC" ticker={ticker.BTC} />
      <TickerCard coin="ETH" ticker={ticker.ETH} />
    </div>
  );
}

function TickerCard({ coin, ticker }: { coin: string; ticker: TickerState }) {
  const delta = +(ticker.price - ticker.prev).toFixed(2);

  const isPositive = delta >= 0;

  const sparklinePoints = useMemo(() => {
    const arr = ticker.history;

    if (!arr.length) return "";

    const min = Math.min(...arr);
    const max = Math.max(...arr);
    const range = max - min || 1;

    return arr
      .map((price, i) => {
        const x = (i / Math.max(arr.length - 1, 1)) * 280;

        const y = 96 - ((price - min) / range) * 96;

        return `${x},${y}`;
      })
      .join(" ");
  }, [ticker.history]);

  return (
    <div>
      <div>
        <div>
          <p>Live Price</p>
          <h2>{coin}</h2>
        </div>

        <div>
          <p>${ticker.price.toLocaleString()}</p>

          <p className={isPositive ? "text-emerald-400" : "text-red-400"}>
            {isPositive ? "+" : ""}
            {delta}
          </p>
        </div>
      </div>

      <svg width="280" height="96">
        <polyline
          fill="none"
          stroke={isPositive ? "green" : "red"}
          points={sparklinePoints}
        />
      </svg>
    </div>
  );
}
