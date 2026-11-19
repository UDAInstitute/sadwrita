"use client";

import { useSyncExternalStore, type ReactNode } from "react";

type PersistentHeaderProps = {
  children: ReactNode;
  className?: string;
  position?: "fixed" | "sticky";
};

function subscribeToScroll(onStoreChange: () => void) {
  window.addEventListener("scroll", onStoreChange, { passive: true });
  return () => window.removeEventListener("scroll", onStoreChange);
}

function getScrolledSnapshot() {
  return window.scrollY > 8;
}

function getServerSnapshot() {
  return false;
}

export default function PersistentHeader({
  children,
  className = "",
  position = "sticky",
}: PersistentHeaderProps) {
  const scrolled = useSyncExternalStore(
    subscribeToScroll,
    getScrolledSnapshot,
    getServerSnapshot,
  );
  const positionClass =
    position === "fixed" ? "fixed inset-x-0 top-0" : "sticky top-0";

  return (
    <header
      data-scrolled={scrolled}
      className={`archive-masthead ${positionClass} z-50 ${
        scrolled
          ? "bg-background/85 backdrop-blur-sm"
          : "bg-transparent backdrop-blur-none"
      } ${className}`}
    >
      {children}
    </header>
  );
}
