"use client";

import { useState } from "react";

export function TellMeInput({
  onAdd,
  disabled,
}: {
  onAdd: (fact: string) => void;
  disabled?: boolean;
}) {
  const [value, setValue] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const t = value.trim();
    if (!t) return;
    onAdd(t);
    setValue("");
  }

  return (
    <form onSubmit={submit} className="flex gap-2">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Tell Sidekick something about them…"
        disabled={disabled}
        className="flex-1 rounded-xl border border-border bg-surface px-3 py-3 text-sm text-ink outline-none placeholder:text-muted/60 focus:border-accent focus:ring-1 focus:ring-accent"
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        className="rounded-xl bg-accent px-4 py-3 text-sm font-medium text-bg transition hover:bg-accent2 disabled:opacity-40"
      >
        Remember
      </button>
    </form>
  );
}
