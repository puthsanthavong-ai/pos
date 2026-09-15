import { Minus, Plus, X } from "lucide-react";
import { th2 } from "../utils/format";

function CartLine({ item, onInc, onDec, onRemove }) {
  const Icon = item.icon;
  return (
    <div className="flex items-center gap-3 px-5 py-3">
      <div
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg"
        style={{ backgroundColor: item.tone + "14" }}
      >
        <Icon size={20} style={{ color: item.tone }} strokeWidth={1.75} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-[13.5px] font-medium text-[#1C1F26]">{item.name}</div>
        <div className="text-[12.5px] text-[#8A8F98]">₭{th2(item.price)}</div>
      </div>
      <div className="flex items-center gap-1.5 rounded-lg border border-[#ECEDF0] px-1 py-1">
        <button
          onClick={() => onDec(item.id)}
          className="flex h-6 w-6 items-center justify-center rounded-md text-[#8A8F98] hover:bg-[#F3F4F6]"
        >
          <Minus size={14} />
        </button>
        <span className="w-4 text-center text-[13px] font-semibold text-[#1C1F26]">{item.qty}</span>
        <button
          onClick={() => onInc(item.id)}
          className="flex h-6 w-6 items-center justify-center rounded-md text-[#8A8F98] hover:bg-[#F3F4F6]"
        >
          <Plus size={14} />
        </button>
      </div>
      <div className="w-14 shrink-0 text-right text-[14px] font-semibold text-[#E5342A]">
        ₭{th2(item.price * item.qty)}
      </div>
      <button
        onClick={() => onRemove(item.id)}
        className="ml-1 flex h-6 w-6 shrink-0 items-center justify-center text-[#B4B8C0] hover:text-[#E5342A]"
      >
        <X size={15} />
      </button>
    </div>
  );
}

export default CartLine;
