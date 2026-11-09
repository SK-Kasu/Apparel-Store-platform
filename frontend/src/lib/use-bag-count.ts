"use client";

import { useCallback, useEffect, useState } from "react";

const BAG_COUNT_KEY = "daylog-bag-count";

export function useBagCount() {
  const [bagCount, setBagCount] = useState(0);

  useEffect(() => {
    const stored = Number(window.localStorage.getItem(BAG_COUNT_KEY));
    if (Number.isFinite(stored) && stored > 0) {
      setBagCount(stored);
    }
  }, []);

  const addToBag = useCallback((quantity = 1) => {
    setBagCount((current) => {
      const next = current + quantity;
      window.localStorage.setItem(BAG_COUNT_KEY, String(next));
      return next;
    });
  }, []);

  return { bagCount, addToBag };
}
