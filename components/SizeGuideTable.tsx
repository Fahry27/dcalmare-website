import { sizeChart } from "@/lib/size-chart";

export default function SizeGuideTable() {
  return (
    <>
      <div className="max-w-full overflow-x-auto border border-burgundy/12 bg-white [-webkit-overflow-scrolling:touch]">
        <table className="w-full min-w-[420px] border-collapse text-left text-sm">
          <thead className="bg-cream text-burgundy">
            <tr>
              <th className="px-5 py-4 font-semibold">Size</th>
              <th className="px-5 py-4 font-semibold">Width</th>
              <th className="px-5 py-4 font-semibold">Length</th>
            </tr>
          </thead>
          <tbody>
            {sizeChart.map((row) => (
              <tr key={row.size} className="border-t border-burgundy/10">
                <td className="px-5 py-4 font-semibold text-ink">{row.size}</td>
                <td className="px-5 py-4 text-muted">{row.width}</td>
                <td className="px-5 py-4 text-muted">{row.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-sm leading-6 text-muted">
        OVRZSD BOXYCUT TSHIRT. Measurements follow the posted dCalmare size chart.
      </p>
      <p className="mt-3 text-sm text-muted md:hidden">
        Geser tabel untuk melihat ukuran lengkap.
      </p>
    </>
  );
}
