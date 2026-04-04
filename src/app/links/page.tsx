import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Links | Sathian S.",
  description: "Links and profiles for Sathian S.",
};

const links = [
  { label: "Tooth Fairy Network", href: "https://toothfairy.network" },
  { label: "Personal Site", href: "https://sathian.ai" },
  { label: "Writing", href: "https://sathian.ai/writings" },
  { label: "X (Twitter)", href: "https://x.com/saboristry" },
  { label: "Instagram", href: "https://instagram.com/sathian.ai" },
  { label: "GitHub", href: "https://github.com/sathiandev" },
];

export default function LinksPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-[400px] flex flex-col items-center gap-8">
        <header className="text-center">
          <h1
            className="text-2xl font-semibold tracking-tight"
            style={{ fontFamily: "var(--font-display), Outfit, sans-serif" }}
          >
            Sathian S.
          </h1>
          <p className="mt-2 text-sm text-[#9CA3AF]">
            Student. Father. Builder.
          </p>
        </header>

        <nav className="w-full flex flex-col gap-3">
          {links.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center py-3.5 px-4 rounded-lg text-sm font-medium border border-white/[0.08] hover:border-white/[0.2] transition-colors duration-150"
            >
              {label}
            </a>
          ))}
        </nav>

        <footer>
          <p className="text-xs text-[#4B5563]">sathian.ai</p>
        </footer>
      </div>
    </main>
  );
}
