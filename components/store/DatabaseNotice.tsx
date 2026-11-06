export function DatabaseNotice() {
  return (
    <div className="mx-auto max-w-xl px-6 py-28 text-center">
      <p className="text-[11px] uppercase tracking-[0.18em] text-accent">Database</p>
      <h1 className="mt-4 font-display text-5xl font-light italic">MySQL belum tersambung.</h1>
      <p className="mt-5 text-sm leading-relaxed text-mute">
        Nyalakan MySQL, cek DATABASE_URL di file .env, lalu jalankan pnpm db:setup.
      </p>
    </div>
  );
}
