import { th2 } from "../utils/format";

function ProductCard({ p, qty, onAdd, stock }) {
  const Icon = p.icon;
  const availableStock = stock || 0;
  const isOutOfStock = availableStock <= 0;

  return (
    <button
      onClick={() => !isOutOfStock && onAdd(p)}
      disabled={isOutOfStock}
      className={`group relative flex flex-col items-center rounded-2xl border border-[#ECEDF0] bg-white p-4 text-left transition ${
        isOutOfStock
          ? 'opacity-50 cursor-not-allowed'
          : 'hover:border-[#E5342A]/40 hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] active:scale-[0.98]'
      }`}
    >
      {qty > 0 && (
        <span className="absolute right-2 top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#E5342A] px-1 text-[11px] font-semibold text-white">
          {qty}
        </span>
      )}
      {isOutOfStock && (
        <span className="absolute right-2 top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#8A8F98] px-1 text-[11px] font-semibold text-white">
          ຫຼວງ
        </span>
      )}
      <div
        className="mb-3 flex h-20 w-full items-center justify-center rounded-xl"
        style={{ backgroundColor: p.tone + "14" }}
      >
        <Icon size={34} style={{ color: p.tone }} strokeWidth={1.75} />
      </div>
      <div className="w-full text-[13.5px] font-medium leading-snug text-[#1C1F26] line-clamp-2">
        {p.name}
      </div>
      <div className="mt-1.5 text-[14px] font-semibold text-[#E5342A]">
        ₭{th2(p.price)}
      </div>
      <div className="mt-1 text-[11px] text-[#8A8F98]">
        {isOutOfStock ? 'ຫຼວງສະຕົກ' : `ສະຕົກ: ${availableStock}`}
      </div>
    </button>
  );
}

export default ProductCard;
