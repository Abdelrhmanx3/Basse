import { Icon } from "./Icon";

type ColorOption = {
  name: { ar: string; en: string };
  hex: string;
};

export function ColorSwatch({
  color,
  language,
  selected,
  onSelect,
}: {
  color: ColorOption;
  language: "ar" | "en";
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      aria-label={`${color.name[language]}${selected ? language === "ar" ? " — محدد" : " — selected" : ""}`}
      aria-pressed={selected}
      className={`grid size-11 shrink-0 place-items-center rounded-full border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a16207] ${selected ? "border-[#201f1c] dark:border-[#f3f0e9]" : "border-transparent hover:border-[#aaa59a] dark:hover:border-[#777168]"}`}
      onClick={onSelect}
      type="button"
    >
      <span
        className="grid size-7 place-items-center rounded-full border border-black/15 dark:border-white/25"
        style={{ backgroundColor: color.hex }}
      >
        {selected && (
          <Icon
            className={`size-4 ${["#252525", "#2d3748", "#765844"].includes(color.hex.toLowerCase()) ? "text-white" : "text-[#201f1c] dark:text-[#f3f0e9]"}`}
            name="check"
          />
        )}
      </span>
    </button>
  );
}
