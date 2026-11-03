// Links the three TRIO pages. The same markup is copied into public/scan and
// public/dashboard, which are static pages outside the Next.js app.
const VIEWS = [
  { href: "/", label: "Intake" },
  { href: "/scan", label: "Scan" },
  { href: "/dashboard", label: "Dashboard" },
];

export default function ViewSwitcher({ current }: { current: string }) {
  return (
    <nav
      aria-label="TRIO pages"
      className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 gap-1 rounded-full border border-[#d7e4eb] bg-white/90 p-1 text-[13px] font-semibold shadow-[0_8px_24px_rgba(1,38,68,0.15)] backdrop-blur"
    >
      {VIEWS.map((v) => (
        <a
          key={v.href}
          href={v.href}
          aria-current={v.href === current ? "page" : undefined}
          className={`rounded-full px-3.5 py-1.5 ${v.href === current ? "bg-[#014275] text-white" : "text-[#06385e] hover:bg-[#eaf2f6]"}`}
        >
          {v.label}
        </a>
      ))}
    </nav>
  );
}
