export function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="bg-bg/80 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-accent">
      {children}
    </span>
  );
}

export function AromaTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="border border-line px-3 py-1 text-[11px] uppercase tracking-[0.12em] text-mute">
      {children}
    </span>
  );
}
