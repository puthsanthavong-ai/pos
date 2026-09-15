import { useState } from 'react';
import { X, Percent, Tag } from 'lucide-react';
import { th2 } from '../utils/format';

function DiscountModal({ onClose, onApplyDiscount }) {
  const [discountType, setDiscountType] = useState('percentage'); // percentage or fixed
  const [discountValue, setDiscountValue] = useState('');
  const [discountCode, setDiscountCode] = useState('');

  const handleApply = () => {
    if (!discountValue) return;

    const discount = {
      type: discountType,
      value: parseFloat(discountValue),
      code: discountCode || null
    };

    onApplyDiscount(discount);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#ECEDF0]">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E5342A]">
              <Percent size={18} className="text-white" />
            </div>
            <h2 className="text-[18px] font-bold text-[#1C1F26]">ສ່ວນຫຼຸດ</h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl hover:bg-[#F3F4F6] text-[#8A8F98]"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Discount Type */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-[#1C1F26] mb-2">
              ປະເຊີນສ່ວນຫຼຸດ
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setDiscountType('percentage')}
                className={`flex-1 py-3 px-4 rounded-xl text-[13px] font-medium transition ${
                  discountType === 'percentage'
                    ? 'bg-[#E5342A] text-white'
                    : 'bg-[#F8F9FA] text-[#4B5060] hover:bg-[#ECEDF0]'
                }`}
              >
                ເປີເຊັນ (%)
              </button>
              <button
                onClick={() => setDiscountType('fixed')}
                className={`flex-1 py-3 px-4 rounded-xl text-[13px] font-medium transition ${
                  discountType === 'fixed'
                    ? 'bg-[#E5342A] text-white'
                    : 'bg-[#F8F9FA] text-[#4B5060] hover:bg-[#ECEDF0]'
                }`}
              >
                ຈຳນຽມ (₭)
              </button>
            </div>
          </div>

          {/* Discount Value */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-[#1C1F26] mb-2">
              {discountType === 'percentage' ? 'ເປີເຊັນ' : 'ຈຳນຽມ'}
            </label>
            <input
              type="number"
              value={discountValue}
              onChange={(e) => setDiscountValue(e.target.value)}
              placeholder={discountType === 'percentage' ? '0' : '0'}
              className="w-full h-12 rounded-xl border border-[#ECEDF0] bg-[#F8F9FA] px-4 text-[14px] outline-none focus:border-[#E5342A]/40 focus:bg-white"
            />
          </div>

          {/* Discount Code */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-[#1C1F26] mb-2">
              ລະຫັດສ່ວນຫຼຸດ (ຖ້າມີ)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
                placeholder="ປ້ອນລະຫັດສ່ວນຫຼຸດ"
                className="flex-1 h-12 rounded-xl border border-[#ECEDF0] bg-[#F8F9FA] px-4 text-[14px] outline-none focus:border-[#E5342A]/40 focus:bg-white"
              />
              <button className="h-12 px-4 rounded-xl border border-[#ECEDF0] bg-[#F8F9FA] text-[#4B5060] hover:bg-[#ECEDF0]">
                <Tag size={18} />
              </button>
            </div>
          </div>

          {/* Quick Discounts */}
          <div className="mb-6">
            <label className="block text-[13px] font-medium text-[#1C1F26] mb-2">
              ສ່ວນຫຼຸດດ່ວກ
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[5, 10, 15, 20].map((value) => (
                <button
                  key={value}
                  onClick={() => {
                    setDiscountType('percentage');
                    setDiscountValue(value.toString());
                  }}
                  className="py-2 px-3 rounded-lg border border-[#ECEDF0] bg-[#F8F9FA] text-[13px] font-medium text-[#4B5060] hover:bg-[#ECEDF0] hover:text-[#E5342A]"
                >
                  {value}%
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl border border-[#ECEDF0] text-[13px] font-medium text-[#4B5060] hover:bg-[#F8F9FA]"
            >
              ຍົກເລີກ
            </button>
            <button
              onClick={handleApply}
              disabled={!discountValue}
              className="flex-1 py-3 px-4 rounded-xl bg-[#E5342A] text-[13px] font-semibold text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#CE2E25]"
            >
              ນຳມັນ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DiscountModal;
