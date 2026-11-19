"use client";

import Link from "next/link";

import RavenLogo from "./Ravenlogo";
import ThemeToggle from "./ThemeToggle";
import PersistentHeader from "./PersistentHeader";

const primaryLinks = [
  { label: "Works", href: "#works" },
  { label: "Books", href: "#books" },
  { label: "Archive", href: "#archive" },
];

const secondaryLinks = [
  { label: "Reader's Space", href: "#readers-space" },
  { label: "Shop", href: "#shop" },
  { label: "Manifesto", href: "#manifesto" },
  { label: "About", href: "#about" },
];

export default function Navbar() {
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
          <span className="hidden text-xs font-medium tracking-[0.24em] sm:inline">
            SADWRITA
          </span>
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          {[...primaryLinks, ...secondaryLinks].map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="relative py-2 text-[10px] font-medium tracking-[0.18em] text-archive-muted-strong uppercase transition-opacity duration-300 after:absolute after:right-0 after:bottom-0 after:left-0 after:h-px after:origin-left after:scale-x-0 after:bg-foreground/90 after:transition-transform after:duration-300 after:ease-out hover:opacity-100 hover:after:scale-x-100"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-5">
          <div className="flex items-center gap-4 lg:hidden sm:gap-6">
            {primaryLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="relative py-2 text-[9px] font-medium tracking-[0.16em] text-archive-muted-strong uppercase transition-opacity duration-300 after:absolute after:right-0 after:bottom-0 after:left-0 after:h-px after:origin-left after:scale-x-0 after:bg-foreground/90 after:transition-transform after:duration-300 after:ease-out hover:opacity-100 hover:after:scale-x-100 sm:text-[10px]"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <ThemeToggle />
        </div>
      </nav>
    </PersistentHeader>
  );
}