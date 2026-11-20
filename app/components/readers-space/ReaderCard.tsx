import RavenLogo from "../Ravenlogo";
import type { ReaderCard as ReaderCardData } from "../../../lib/reader-card";

export default function ReaderCard({
  card,
  className = "",
}: {
  card: ReaderCardData;
  className?: string;
}) {
  const readerSince = new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(card.readerSince));

  return (
    <article
      aria-label="SADWRITA Reader's Card"
      className={`reader-card-paper flex min-h-[320px] w-full max-w-[760px] flex-col border border-archive-border-strong bg-background p-6 text-left text-foreground sm:aspect-[1.586/1] sm:min-h-0 sm:p-10 ${className}`}
    >
      <header className="flex items-start justify-between gap-6 border-b border-archive-border pb-5 sm:pb-7">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.3em] sm:text-xs">
            SADWRITA
          </p>
          <p className="mt-3 text-[10px] font-medium tracking-[0.24em] text-archive-muted-strong uppercase sm:mt-4 sm:text-xs">
            READER&apos;S CARD
          </p>
        </div>
        <RavenLogo className="h-12 w-12 shrink-0 object-contain sm:h-16 sm:w-16" />
      </header>

      <dl className="grid grow grid-cols-2 content-center gap-x-5 gap-y-7 py-7 sm:gap-x-10 sm:gap-y-8 sm:py-9">
        <div className="col-span-2">
          <dt className="text-[9px] tracking-[0.22em] text-archive-muted uppercase sm:text-[10px]">
            Reader Name
          </dt>
          <dd className="mt-2 break-words font-serif text-2xl leading-tight sm:mt-3 sm:text-4xl">
            {card.readerName || "Reader"}
          </dd>
        </div>
        <div className="min-w-0">
          <dt className="text-[9px] tracking-[0.22em] text-archive-muted uppercase sm:text-[10px]">
            Reader ID
          </dt>
          <dd className="mt-2 break-all font-mono text-xs tracking-[0.08em] sm:mt-3 sm:text-sm">
            {card.readerId}
          </dd>
        </div>
        <div className="min-w-0">
          <dt className="text-[9px] tracking-[0.22em] text-archive-muted uppercase sm:text-[10px]">
            Reader Since
          </dt>
          <dd className="mt-2 font-serif text-sm sm:mt-3 sm:text-base">
            {readerSince}
          </dd>
        </div>
      </dl>

      <footer className="border-t border-archive-border pt-5 sm:pt-6">
        <p className="text-[9px] font-medium tracking-[0.2em] uppercase sm:text-[10px]">
          Member of the Archive
        </p>
      </footer>
    </article>
  );
}
