import { useState } from 'react';
import { X, TrendingUp, ShoppingCart, DollarSign, Users, Calendar } from 'lucide-react';
import { th2 } from '../utils/format';
import {
  getDailyTotal,
  getDailyItemCount,
  getDailyTransactionCount,
  getWeeklyTotal,
  getMonthlyTotal,
  getYearlyTotal,
  getTopSellingProducts,
  getSalesByPaymentMethod
} from '../utils/reports';
import DailySalesChart from './charts/DailySalesChart';
import MonthlySalesChart from './charts/MonthlySalesChart';
import YearlySalesChart from './charts/YearlySalesChart';

function Dashboard({ onClose }) {
  const dailyTotal = getDailyTotal();
  const dailyItemCount = getDailyItemCount();
  const dailyTransactionCount = getDailyTransactionCount();
  const weeklyTotal = getWeeklyTotal();
  const monthlyTotal = getMonthlyTotal();
  const yearlyTotal = getYearlyTotal();
  const topProducts = getTopSellingProducts(5);
  const paymentMethods = getSalesByPaymentMethod();

  const stats = [
    {
      label: 'ຍອດຂາຍວັນນີ້',
      value: `₭${th2(dailyTotal)}`,
      icon: DollarSign,
      color: '#E5342A',
      bgColor: '#FEF2F1'
    },
    {
      label: 'ລາຍການວັນນີ້',
      value: dailyItemCount,
      icon: ShoppingCart,
      color: '#2563EB',
      bgColor: '#EDF2FF'
    },
    {
      label: 'ບິວັນນີ້',
      value: dailyTransactionCount,
      icon: Calendar,
      color: '#7C4FE0',
      bgColor: '#F4EEFE'
    },
    {
      label: 'ຍອດຂາວັນນີ້',
      value: `₭${th2(weeklyTotal)}`,
      icon: TrendingUp,
      color: '#1E9E5A',
      bgColor: '#EAFBF1'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#ECEDF0]">
          <div>
            <h2 className="text-[20px] font-bold text-[#1C1F26]">ລາຍງານຍອດຂາຍ</h2>
            <p className="text-[13px] text-[#8A8F98] mt-1">ສະຖິຕິແລະງມືນຂາຍ</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl hover:bg-[#F3F4F6] text-[#8A8F98]"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="rounded-xl p-4 border border-[#ECEDF0]"
                  style={{ backgroundColor: stat.bgColor }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-lg"
                      style={{ backgroundColor: stat.color }}
                    >
                      <Icon size={20} className="text-white" />
                    </div>
                  </div>
                  <div className="text-[13px] text-[#8A8F98]">{stat.label}</div>
                  <div className="text-[20px] font-bold text-[#1C1F26]">{stat.value}</div>
                </div>
              );
            })}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <DailySalesChart />
            <MonthlySalesChart />
          </div>

          <div className="mb-6">
            <YearlySalesChart />
          </div>

          {/* Top Products */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#ECEDF0]">
              <h3 className="text-[16px] font-bold text-[#1C1F26] mb-4">ສິນຄ້າຂາຍດີ 5 ອັນດັບ</h3>
              {topProducts.length > 0 ? (
                <div className="space-y-3">
                  {topProducts.map((product, index) => (
                    <div key={product.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-8 w-8 items-center justify-center rounded-full text-[12px] font-bold text-white"
                          style={{ backgroundColor: index === 0 ? '#E5342A' : index === 1 ? '#F59E0B' : index === 2 ? '#1E9E5A' : '#8A8F98' }}
                        >
                          {index + 1}
                        </div>
                        <div className="text-[13.5px] font-medium text-[#1C1F26]">{product.name}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[14px] font-semibold text-[#E5342A]">₭{th2(product.totalRevenue)}</div>
                        <div className="text-[11px] text-[#8A8F98]">{product.totalQty} ຊັບ</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-[13px] text-[#8A8F98] py-8">
                  ຍັງບໍ່ມີຂໍ້ມູນການຂາຍ
                </div>
              )}
            </div>

            {/* Payment Methods */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#ECEDF0]">
              <h3 className="text-[16px] font-bold text-[#1C1F26] mb-4">ວິທີຊຳລະເງິນ</h3>
              {paymentMethods.length > 0 ? (
                <div className="space-y-3">
                  {paymentMethods.map((method, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="text-[13.5px] font-medium text-[#1C1F26]">{method.method}</div>
                      <div className="text-right">
                        <div className="text-[14px] font-semibold text-[#E5342A]">₭{th2(method.total)}</div>
                        <div className="text-[11px] text-[#8A8F98]">{method.count} ບິນ</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-[13px] text-[#8A8F98] py-8">
                  ຍັງບໍ່ມີຂໍ້ມູນການຂາຍ
                </div>
              )}
            </div>
          </div>

          {/* Summary */}
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-[#ECEDF0]">
              <div className="text-[13px] text-[#8A8F98]">ຍອດຂາຍເດືອນນີ້</div>
              <div className="text-[18px] font-bold text-[#1C1F26]">₭{th2(monthlyTotal)}</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-[#ECEDF0]">
              <div className="text-[13px] text-[#8A8F98]">ຍອດຂາປີ</div>
              <div className="text-[18px] font-bold text-[#1C1F26]">₭{th2(yearlyTotal)}</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-[#ECEDF0]">
              <div className="text-[13px] text-[#8A8F98]">ຍອດຂາທັງໝົດ</div>
              <div className="text-[18px] font-bold text-[#1C1F26]">₭{th2(yearlyTotal)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
