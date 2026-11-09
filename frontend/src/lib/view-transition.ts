type ViewTransitionDocument = Document & {
  startViewTransition?: (callback: () => void) => {
    finished: Promise<void>;
  };
};

export function runViewTransition(update: () => void): void {
  if (typeof document === "undefined") {
    update();
    return;
  }

  if (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    update();
    return;
  }

  const viewTransitionDocument = document as ViewTransitionDocument;

  if (typeof viewTransitionDocument.startViewTransition !== "function") {
    update();
    return;
  }

  viewTransitionDocument.startViewTransition(update);
}
