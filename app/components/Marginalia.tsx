"use client";

import { useState } from "react";

const notes = [
  {
    text: "The reader is invited to study, not consume.",
  },
  {
    text: "A fragment is the honest form.",
  },
  {
    text: "The archive does not believe in progress. It believes in preservation.",
  },
  {
    text: "Let the gap be given a room.",
  },
  {
    text: "The raven keeps the archive.",
  },
];

type MarginaliaProps = {
  desktop?: boolean;
};

export default function Marginalia({
  desktop = false,
}: MarginaliaProps) {
  const [open, setOpen] = useState(false);
  const muted = "text-archive-muted";
  const border = "border-archive-border";

  if (desktop) {
    return (
      <aside
        aria-label="Marginalia"
        className={`hidden h-fit self-start border-l pl-6 lg:sticky lg:top-[120px] lg:block ${border}`}
      >
        <div className="pt-1">
          <p className={`text-[9px] font-medium tracking-[0.3em] uppercase ${muted}`}>
            Marginalia
          </p>
          <div className="mt-14 space-y-16">
            {notes.map((note) => (
              <div key={note.text} className="max-w-[210px]">
                <p
                  className={`font-serif text-[14px] leading-[1.7] italic ${muted}`}
                >
                  <span aria-hidden="true" className="mr-1">
                    ✦
                  </span>
                  {note.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside
      aria-label="Marginalia"
      className={`mt-16 border-t ${border} pt-5 lg:hidden`}
    >
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        className={`flex w-full items-center justify-between text-[9px] tracking-[0.24em] uppercase ${muted}`}
      >
        <span>Marginalia</span>
        <span aria-hidden="true">{open ? "−" : "+"}</span>
      </button>

      {open && (
        <div className="mt-7 space-y-7 pb-2">
          {notes.map((note) => (
            <div
              key={note.text}
              className={`border-b ${border} pb-7 last:border-b-0`}
            >
              <p className="font-serif text-[13px] leading-[1.7] italic">
                <span aria-hidden="true" className="mr-1">
                  ✦
                </span>
                {note.text}
              </p>
            </div>
          ))}
        </div>
      )}
    </aside>
  );
}
