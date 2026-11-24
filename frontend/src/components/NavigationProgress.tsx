"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

type ProgressState = {
  visible: boolean;
  value: number;
};

const START_VALUE = 14;
const AUTO_LIMIT = 90;
const SAFETY_TIMEOUT = 5000;

function isModifiedEvent(event: MouseEvent): boolean {
  return (
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey ||
    event.button !== 0
  );
}

function shouldTrack(anchor: HTMLAnchorElement): boolean {
  const href = anchor.getAttribute("href");

  if (!href) return false;
  if (
    href.startsWith("#") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:") ||
    href.startsWith("javascript:")
  ) {
    return false;
  }

  if (anchor.target && anchor.target !== "_self") return false;
  if (anchor.hasAttribute("download")) return false;
  if (anchor.dataset.noProgress === "true") return false;

  let url: URL;

  try {
    url = new URL(anchor.href, window.location.href);
  } catch {
    return false;
  }

  if (url.origin !== window.location.origin) return false;

  if (
    url.pathname === window.location.pathname &&
    url.search === window.location.search
  ) {
    return false;
  }

  return true;
}

function ProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [state, setState] = useState<ProgressState>({ visible: false, value: 0 });
  const activeRef = useRef(false);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const safetyRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resetRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = useCallback(() => {
    if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }

    if (safetyRef.current) {
      clearTimeout(safetyRef.current);
      safetyRef.current = null;
    }

    if (hideRef.current) {
      clearTimeout(hideRef.current);
      hideRef.current = null;
    }

    if (resetRef.current) {
      clearTimeout(resetRef.current);
      resetRef.current = null;
    }
  }, []);

  const finish = useCallback(() => {
    if (!activeRef.current) return;

    activeRef.current = false;

    if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }

    if (safetyRef.current) {
      clearTimeout(safetyRef.current);
      safetyRef.current = null;
    }

    setState({ visible: true, value: 100 });

    hideRef.current = setTimeout(() => {
      setState((current) => ({ ...current, visible: false }));
      hideRef.current = null;

      resetRef.current = setTimeout(() => {
        setState({ visible: false, value: 0 });
        resetRef.current = null;
      }, 240);
    }, 180);
  }, []);

  const begin = useCallback(() => {
    clearTimers();
    activeRef.current = true;
    setState({ visible: true, value: START_VALUE });

    tickRef.current = setInterval(() => {
      setState((current) => {
        if (!current.visible || current.value >= AUTO_LIMIT) {
          return current;
        }

        const increment = Math.max(1.5, (AUTO_LIMIT - current.value) * 0.14);

        return {
          ...current,
          value: Math.min(AUTO_LIMIT, current.value + increment)
        };
      });
    }, 180);

    safetyRef.current = setTimeout(finish, SAFETY_TIMEOUT);
  }, [clearTimers, finish]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || isModifiedEvent(event)) return;

      const target = event.target;

      if (!(target instanceof Element)) return;

      const anchor = target.closest("a");

      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (!shouldTrack(anchor)) return;

      begin();
    };

    document.addEventListener("click", onClick, true);

    return () => {
      document.removeEventListener("click", onClick, true);
      clearTimers();
    };
  }, [begin, clearTimers]);

  const routeKey = `${pathname}?${searchParams.toString()}`;

  useEffect(() => {
    finish();
  }, [routeKey, finish]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 right-0 top-0 z-50 h-0.5 overflow-hidden"
    >
      <div
        className="h-full origin-left bg-[#D4A373] shadow-[0_0_10px_rgba(212,163,115,0.85)] transition-[transform,opacity] duration-200 ease-out"
        style={{
          transform: `scaleX(${state.value / 100})`,
          transformOrigin: "left",
          opacity: state.visible ? 1 : 0,
          willChange: "transform, opacity"
        }}
      />
    </div>
  );
}

export function NavigationProgress() {
  return (
    <Suspense fallback={null}>
      <ProgressBar />
    </Suspense>
  );
}
