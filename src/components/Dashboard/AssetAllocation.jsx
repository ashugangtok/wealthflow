import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

export const AssetAllocation = ({ assets = [] }) => {
  const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe', '#43e97b', '#fa709a', '#fee140'];

  // Group assets by type
  const assetsByType = {};
  assets.forEach((asset) => {
    const type = asset.assetType || 'Other';
    assetsByType[type] = (assetsByType[type] || 0) + (asset.value || 0);
  });

  const chartData = Object.entries(assetsByType).map(([name, value]) => ({
    name,
    value: parseFloat(value.toFixed(2)),
  }));

  const totalAssets = chartData.reduce((sum, item) => sum + item.value, 0);

  if (chartData.length === 0) {
    return (
      <div className="p-6 rounded-4xl bg-card/40 backdrop-blur-xl border border-white/10">
        <h2 className="text-2xl font-bold text-white mb-6">💼 Asset Allocation</h2>
        <p className="text-white/60 text-center py-8">Add assets to see allocation breakdown</p>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-4xl bg-card/40 backdrop-blur-xl border border-white/10">
      <h2 className="text-2xl font-bold text-white mb-6">💼 Asset Allocation</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pie Chart */}
        <div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => `₹${value.toLocaleString('en-IN')}`}
                contentStyle={{
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Breakdown Table */}
        <div className="space-y-3">
          <div className="space-y-2">
            {chartData.map((item, idx) => {
              const percentage = ((item.value / totalAssets) * 100).toFixed(1);
              return (
                <div key={idx} className="p-3 rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                      />
                      <span className="text-white font-semibold">{item.name}</span>
                    </div>
                    <span className="text-primary font-bold">{percentage}%</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full transition-all duration-300"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: COLORS[idx % COLORS.length],
                      }}
                    />
                  </div>
                  <p className="text-white/60 text-xs mt-2">₹{item.value.toLocaleString('en-IN')}</p>
                </div>
              );
            })}
          </div>

          {/* Total */}
          <div className="p-4 rounded-2xl bg-primary/10 border border-primary/30 mt-4">
            <p className="text-white/70 text-sm mb-1">Total Assets</p>
            <p className="text-2xl font-bold text-white">₹{totalAssets.toLocaleString('en-IN')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetAllocation;
