const sizes = [
  { size: "S", chest: "52 cm", length: "68 cm", shoulder: "50 cm", sleeve: "21 cm" },
  { size: "M", chest: "55 cm", length: "71 cm", shoulder: "52 cm", sleeve: "22 cm" },
  { size: "L", chest: "58 cm", length: "74 cm", shoulder: "54 cm", sleeve: "23 cm" },
  { size: "XL", chest: "61 cm", length: "77 cm", shoulder: "56 cm", sleeve: "24 cm" }
];

export default function SizeGuideTable() {
  return (
    <div className="overflow-x-auto border border-burgundy/12 bg-white">
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">
        <thead className="bg-cream text-burgundy">
          <tr>
            <th className="px-5 py-4 font-semibold">Size</th>
            <th className="px-5 py-4 font-semibold">Chest Width</th>
            <th className="px-5 py-4 font-semibold">Length</th>
            <th className="px-5 py-4 font-semibold">Shoulder</th>
            <th className="px-5 py-4 font-semibold">Sleeve</th>
          </tr>
        </thead>
        <tbody>
          {sizes.map((row) => (
            <tr key={row.size} className="border-t border-burgundy/10">
              <td className="px-5 py-4 font-semibold text-ink">{row.size}</td>
              <td className="px-5 py-4 text-muted">{row.chest}</td>
              <td className="px-5 py-4 text-muted">{row.length}</td>
              <td className="px-5 py-4 text-muted">{row.shoulder}</td>
              <td className="px-5 py-4 text-muted">{row.sleeve}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
