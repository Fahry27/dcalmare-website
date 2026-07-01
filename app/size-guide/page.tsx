import type { Metadata } from "next";
import SizeGuideTable from "@/components/SizeGuideTable";

export const metadata: Metadata = {
  title: "Size Guide",
  description: "Oversized tee size guide for dCalmare first drop products."
};

export default function SizeGuidePage() {
  return (
    <section className="bg-offwhite py-12 md:py-24">
      <div className="container-pad">
        <div className="max-w-2xl min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-burgundy sm:tracking-[0.24em]">
            Size Guide
          </p>
          <h1 className="mt-4 break-words font-serif text-4xl font-semibold leading-tight text-ink sm:text-5xl md:text-6xl">
            OVRZSD boxycut tshirt.
          </h1>
          <p className="mt-5 text-base leading-relaxed text-muted md:leading-8">
            Size chart resmi dCalmare untuk potongan oversized boxycut. Width
            dan length mengikuti ukuran pada chart produk.
          </p>
          <p className="mt-3 text-sm font-medium text-burgundy">
            Available sizes: M, L, XL.
          </p>
        </div>
        <div className="mt-8 md:mt-10">
          <SizeGuideTable />
        </div>
      </div>
    </section>
  );
}
