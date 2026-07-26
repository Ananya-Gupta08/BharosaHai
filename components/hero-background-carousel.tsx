"use client";

import type {ReactNode} from "react";

const mathuraVrindavanImages = [
  "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1599661046827-dacde6976549?auto=format&fit=crop&w=1600&q=80"
] as const;

export function HeroBackgroundCarousel({children, align = "center"}: {children: ReactNode; align?: "center" | "left"}) {
  return (
    <div className="relative isolate overflow-hidden rounded-[26px] border border-[var(--border)] bg-white shadow-[var(--shadow-soft)]">
      <div className="absolute inset-0 -z-20">
        {mathuraVrindavanImages.map((src, index) => (
          <div
            key={src}
            className="hero-bg-slide absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${src})`,
              animationDelay: `${index * 4}s`
            }}
          />
        ))}
      </div>
      <div className="absolute inset-0 -z-10 bg-[rgba(255,253,248,0.82)]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(244,163,0,0.18),transparent_42%),linear-gradient(180deg,rgba(255,253,248,0.72),rgba(255,253,248,0.94))]" />
      <div className={`px-4 py-8 sm:px-8 sm:py-10 lg:px-12 ${align === "center" ? "text-center" : ""}`}>
        {children}
      </div>
    </div>
  );
}
