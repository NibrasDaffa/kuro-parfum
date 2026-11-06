export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-content flex-col gap-8 px-5 py-14 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-display text-4xl tracking-[0.12em]">KURO</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-mute">
            Parfum high-end. Diracik pelan, dipakai dekat kulit.
          </p>
        </div>
        <p className="text-[11px] uppercase tracking-[0.16em] text-mute">
          © {new Date().getFullYear()} Kuro Parfum
        </p>
      </div>
    </footer>
  );
}
