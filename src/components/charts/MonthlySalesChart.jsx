import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getMonthlySalesData } from '../../utils/reports';
import { th2 } from '../../utils/format';

const MonthlySalesChart = () => {
  const data = getMonthlySalesData();

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#ECEDF0]">
      <h3 className="text-[16px] font-bold text-[#1C1F26] mb-4">ຍອດຂາຍ 12 ເດືອນລ່າສຸດ</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
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

export default MonthlySalesChart;
