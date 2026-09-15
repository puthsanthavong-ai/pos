import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getYearlySales } from '../../utils/reports';
import { th2 } from '../../utils/format';

const YearlySalesChart = () => {
  const currentYear = new Date().getFullYear();
  const yearlySales = getYearlySales(currentYear);

  // Calculate monthly totals for the current year
  const monthlyData = [];
  for (let month = 0; month < 12; month++) {
    const monthSales = yearlySales.filter(sale => {
      const saleDate = new Date(sale.date);
      return saleDate.getMonth() === month;
    });

    const total = monthSales.reduce((sum, sale) => sum + sale.total, 0);
    const monthNames = ['ມ.ກ.', 'ກ.ພ.', 'ມີ.ນ.', 'ມ.ສ.', 'ພ.ພ.', 'ມິ.ຖ.', 'ກ.ລ.', 'ສ.ຄ.', 'ກ.ຍ.', 'ຕ.ລ.', 'ພ.ຈ.', 'ທ.ວ.'];

    monthlyData.push({
      month: monthNames[month],
      total: total
    });
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#ECEDF0]">
      <h3 className="text-[16px] font-bold text-[#1C1F26] mb-4">ຍອດຂາປີ {currentYear + 543}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={monthlyData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ECEDF0" />
          <XAxis
            dataKey="month"
            stroke="#8A8F98"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#8A8F98"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `₭${th2(value)}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1C1F26',
              border: 'none',
              borderRadius: '8px',
              padding: '12px',
              fontSize: '13px'
            }}
            itemStyle={{ color: '#FFFFFF' }}
            formatter={(value) => `₭${th2(value)}`}
          />
          <Legend />
          <Bar
            dataKey="total"
            fill="#E5342A"
            radius={[4, 4, 0, 0]}
            name="ຍອດຂາຍ"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default YearlySalesChart;
