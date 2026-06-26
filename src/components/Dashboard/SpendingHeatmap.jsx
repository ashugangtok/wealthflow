import React, { useMemo } from 'react';

export const SpendingHeatmap = ({ expenses = [] }) => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const heatmapData = useMemo(() => {
    // Calculate daily spending
    const dailySpending = {};
    expenses.forEach(exp => {
      const expDate = new Date(exp.date);
      if (expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear) {
        const day = expDate.getDate();
        dailySpending[day] = (dailySpending[day] || 0) + exp.amount;
      }
    });

    // Find max spending for color scaling
    const maxSpending = Math.max(Object.values(dailySpending)[0] || 1, 1);

    return { dailySpending, maxSpending };
  }, [expenses, currentMonth, currentYear]);

  const getHeatColor = (amount, max) => {
    if (amount === 0) return 'bg-white/5 border-white/10';
    const intensity = Math.min(amount / max, 1);
    if (intensity < 0.2) return 'bg-green-500/30 border-green-500/50';
    if (intensity < 0.4) return 'bg-yellow-500/30 border-yellow-500/50';
    if (intensity < 0.6) return 'bg-orange-500/30 border-orange-500/50';
    if (intensity < 0.8) return 'bg-red-500/30 border-red-500/50';
    return 'bg-red-600/50 border-red-600/70';
  };

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();

  // Create grid with empty cells for days before month starts
  const calendarDays = Array(firstDay).fill(null).concat(
    Array.from({ length: daysInMonth }, (_, i) => i + 1)
  );

  const monthName = new Date(currentYear, currentMonth).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="p-6 rounded-4xl bg-card/40 backdrop-blur-xl border border-white/10">
      <h2 className="text-2xl font-bold text-white mb-6">🔥 Spending Heatmap - {monthName}</h2>

      {/* Calendar Grid */}
      <div className="mb-6">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-2 mb-3">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
            <div key={day} className="text-center text-white/60 text-xs font-semibold">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((day, idx) => {
            if (day === null) {
              return <div key={`empty-${idx}`} className="aspect-square" />;
            }

            const amount = heatmapData.dailySpending[day] || 0;
            const color = getHeatColor(amount, heatmapData.maxSpending);

            return (
              <div
                key={day}
                className={`aspect-square rounded-lg border flex flex-col items-center justify-center cursor-pointer hover:ring-2 ring-primary/50 transition-all group ${color}`}
                title={`${day} ${monthName}: ₹${amount.toLocaleString()}`}
              >
                <span className="text-white font-bold text-sm">{day}</span>
                <span className="text-white/60 text-xs group-hover:text-white">
                  {amount > 0 ? `₹${(amount / 1000).toFixed(1)}k` : '-'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 pt-4 border-t border-white/10">
        <span className="text-white/60 text-sm">Spending Level:</span>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-white/5 border border-white/10" />
          <span className="text-white/60 text-xs">No spend</span>
        </div>
        <div className="w-4 h-4 rounded bg-green-500/30 border border-green-500/50" />
        <div className="w-4 h-4 rounded bg-yellow-500/30 border border-yellow-500/50" />
        <div className="w-4 h-4 rounded bg-orange-500/30 border border-orange-500/50" />
        <div className="w-4 h-4 rounded bg-red-500/30 border border-red-500/50" />
        <div className="w-4 h-4 rounded bg-red-600/50 border border-red-600/70" />
        <span className="text-white/60 text-xs">High spend</span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/10">
        <div>
          <p className="text-white/60 text-sm mb-1">Days with Spending</p>
          <p className="text-2xl font-bold text-white">
            {Object.keys(heatmapData.dailySpending).length}
          </p>
        </div>
        <div>
          <p className="text-white/60 text-sm mb-1">Average per Day</p>
          <p className="text-2xl font-bold text-white">
            ₹{(
              Object.values(heatmapData.dailySpending).reduce((a, b) => a + b, 0) /
              Object.keys(heatmapData.dailySpending).length || 0
            ).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </p>
        </div>
        <div>
          <p className="text-white/60 text-sm mb-1">Highest Spending Day</p>
          <p className="text-2xl font-bold text-white">
            ₹{Math.max(...Object.values(heatmapData.dailySpending), 0).toLocaleString('en-IN', {
              maximumFractionDigits: 0,
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SpendingHeatmap;
