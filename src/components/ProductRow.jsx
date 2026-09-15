import { th2 } from "../utils/format";

function ProductRow({ p, qty, onAdd, stock }) {
  const Icon = p.icon;
  const availableStock = stock || 0;
  const isOutOfStock = availableStock <= 0;

  return (
    <button
      onClick={() => !isOutOfStock && onAdd(p)}
      disabled={isOutOfStock}
      className={`flex w-full items-center gap-3 rounded-xl border border-[#ECEDF0] bg-white px-3 py-2.5 text-left transition ${
        isOutOfStock
          ? 'opacity-50 cursor-not-allowed'
          : 'hover:border-[#E5342A]/40 hover:shadow-sm'
      }`}
    >
      <div
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg"
        style={{ backgroundColor: p.tone + "14" }}
      >
        <Icon size={20} style={{ color: p.tone }} strokeWidth={1.75} />
      </div>
      <div className="min-w-0 flex-1 text-[13.5px] font-medium text-[#1C1F26] truncate">
        {p.name}
      </div>
      {qty > 0 && (
        <span className="rounded-full bg-[#E5342A]/10 px-2 py-0.5 text-[11px] font-semibold text-[#E5342A]">
          x{qty}
        </span>
      )}
      {isOutOfStock && (
        <span className="rounded-full bg-[#8A8F98]/10 px-2 py-0.5 text-[11px] font-semibold text-[#8A8F98]">
          ຫຼວງ
        </span>
      )}
      <div className="w-16 shrink-0 text-right text-[14px] font-semibold text-[#E5342A]">
        ₭{th2(p.price)}
      </div>
      <div className="w-12 shrink-0 text-right text-[11px] text-[#8A8F98]">
        {isOutOfStock ? 'ຫຼວງສະຕົກ' : `ສະຕົກ: ${availableStock}`}
      </div>
    </button>
  );
}

export default ProductRow;
