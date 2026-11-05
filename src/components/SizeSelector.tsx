export function SizeSelector({
  sizes,
  selectedSize,
  onSelect,
  language,
}: {
  sizes: string[];
  selectedSize: string | null;
  onSelect: (size: string) => void;
  language: "ar" | "en";
}) {
  return (
    <div aria-label={language === "ar" ? "المقاس" : "Size"} className="flex flex-wrap gap-2" role="group">
      {sizes.map((size) => (
        <button
          aria-pressed={selectedSize === size}
          className={`min-h-11 min-w-12 rounded border px-3 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a16207] ${selectedSize === size ? "border-[#24231f] bg-[#24231f] dark:bg-[#343129] text-white" : "border-[#dcd8cf] dark:border-[#403d35] bg-white dark:bg-[#201f1b] text-[#37342e] dark:text-[#f3f0e9] hover:border-[#8b7652]"}`}
          key={size}
          onClick={() => onSelect(size)}
          type="button"
        >
          {size}
        </button>
      ))}
    </div>
  );
}
