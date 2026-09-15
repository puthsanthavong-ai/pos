import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getDailySalesData } from '../../utils/reports';
import { th2 } from '../../utils/format';

const DailySalesChart = () => {
  const data = getDailySalesData();

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#ECEDF0]">
      <h3 className="text-[16px] font-bold text-[#1C1F26] mb-4">ຍອດຂາຍ 7 ວັນລ່າສຸດ</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ECEDF0" />
          <XAxis
            dataKey="date"
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
          <Line
            type="monotone"
            dataKey="total"
            stroke="#E5342A"
            strokeWidth={3}
            dot={{ fill: '#E5342A', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
            name="ຍອດຂາຍ"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DailySalesChart;
