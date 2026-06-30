import type { Metadata } from "next";
import SizeGuideTable from "@/components/SizeGuideTable";

export const metadata: Metadata = {
  title: "Size Guide",
  description: "Oversized tee size guide for dCalmare first drop products."
};

export default function SizeGuidePage() {
  return (
    <section className="bg-offwhite py-16 md:py-24">
      <div className="container-pad">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-burgundy">
            Size Guide
          </p>
          <h1 className="mt-4 font-serif text-5xl font-semibold leading-tight text-ink md:text-6xl">
            Oversized tee measurements.
          </h1>
          <p className="mt-5 text-base leading-8 text-muted">
            Measurements are approximate and designed for an oversized, boxy
            silhouette.
          </p>
        </div>
        <div className="mt-10">
          <SizeGuideTable />
        </div>
      </div>
    </section>
  );
}
