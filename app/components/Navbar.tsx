"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import RavenLogo from "./Ravenlogo";
import ThemeToggle from "./ThemeToggle";
import PersistentHeader from "./PersistentHeader";

const readerSpaceLink = { label: "Reader's Space", href: "/readers-space" };

const primaryLinks = [
  { label: "Works", href: "/works" },
  { label: "Books", href: "/books" },
  { label: "Archive", href: "/archive" },
];

const secondaryLinks = [
  { label: "Manifesto", href: "/manifesto" },
  readerSpaceLink,
  { label: "About", href: "/about" },
];

const mobileLinks = [...primaryLinks, ...secondaryLinks];

function isActiveRoute(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuPath, setMobileMenuPath] = useState<string | null>(null);
  const mobileMenuOpen = mobileMenuPath === pathname;

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileMenuPath(null);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [mobileMenuOpen]);

  return (
    <PersistentHeader position="fixed" className="text-foreground">
      <nav
        aria-label="Primary navigation"
        className="mx-auto flex h-24 max-w-[1800px] items-center justify-between px-5 sm:px-10 lg:px-12"
      >
        <Link
          href="/"
          aria-label="Sadwrita home"
          className="flex shrink-0 items-center gap-3"
        >
          <RavenLogo className="h-10 w-10 object-contain sm:h-12 sm:w-12" />
          <span className="hidden text-[11px] font-medium tracking-[0.28em] sm:inline">
            SADWRITA
          </span>
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          {[...primaryLinks, ...secondaryLinks].map((link) => {
            const isActive = isActiveRoute(pathname, link.href);

            return (
              <Link
                key={link.label}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={`relative py-2 text-[9px] font-medium tracking-[0.23em] text-archive-muted-strong uppercase transition-opacity duration-300 after:absolute after:right-0 after:bottom-0 after:left-0 after:h-px after:origin-left after:scale-x-0 after:bg-foreground/90 after:transition-transform after:duration-300 after:ease-out hover:opacity-100 hover:after:scale-x-100 ${isActive ? "text-foreground after:scale-x-100" : ""}`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center gap-5 lg:flex">
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-3 lg:hidden">
          <ThemeToggle />
          <button
            type="button"
            aria-controls="primary-mobile-navigation"
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? "Close navigation" : "Open navigation"}
            onClick={() =>
              setMobileMenuPath(mobileMenuOpen ? null : pathname)
            }
            className="inline-flex min-h-11 items-center px-2 text-[9px] font-medium tracking-[0.18em] uppercase underline decoration-archive-border underline-offset-4"
          >
            {mobileMenuOpen ? "Close" : "Menu"}
          </button>
        </div>
      </nav>

      <nav
        id="primary-mobile-navigation"
        aria-label="Mobile navigation"
        hidden={!mobileMenuOpen}
        className="absolute inset-x-0 top-full max-h-[calc(100svh-6rem)] overflow-y-auto overscroll-contain border-y border-archive-border bg-background/95 px-5 py-3 backdrop-blur-md sm:px-10 lg:hidden"
      >
        <div className="mx-auto max-w-[1800px]">
          {mobileLinks.map((link) => {
            const isActive = isActiveRoute(pathname, link.href);

            return (
              <Link
                key={link.label}
                href={link.href}
                aria-current={
                  isActive ? "page" : undefined
                }
                onClick={() => setMobileMenuPath(null)}
                className={`flex min-h-11 items-center border-b border-archive-border py-3 text-[clamp(2.5rem,13vw,4.5rem)] leading-[0.88] font-black tracking-[-0.055em] uppercase last:border-b-0 ${
                  isActive ? "text-foreground" : "text-archive-muted-strong"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </PersistentHeader>
  );
}