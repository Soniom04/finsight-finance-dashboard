import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';



function IncomeExpenseChart({ data }) {
  // Ensure data is always an array for recharts
  const safeData = Array.isArray(data) ? data : [];

  return (
    <div style={{ width: '100%', height: 400 }}>
      <ResponsiveContainer width={"100%"} height={300}>
        <LineChart data={safeData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" textAnchor="end" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line strokeWidth={3} type="monotone" dataKey="income" stroke="#10B981" activeDot={{ r: 8 }} />
          <Line strokeWidth={3} type="monotone" dataKey="expense" stroke="#F44336" />
        </LineChart>
      </ResponsiveContainer>
      {(!Array.isArray(data)) && (
        <p style={{ textAlign: 'center', marginTop: 150, color: 'red' }}>
          An error has occurred: Chart data is not an array.
        </p>
      )}
    </div>
  );
}

export default IncomeExpenseChart;
