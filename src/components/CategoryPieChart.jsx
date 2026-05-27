import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

function CategoryPieChart({ categoryTotals = {} }) {
  const data = Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value: Number(value),
  }));

  const totalSpending = data.reduce((total, item) => {
    return total + item.value;
  }, 0);

  if (data.length === 0) {
    return (
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-[#24352B]">
          Category Spending Chart
        </h2>

        <p className="mt-3 text-sm text-[#6A756D]">
          No category data yet. Add expenses to see your spending breakdown.
        </p>
      </div>
    );
  }

  const gradientMap = {
    Food: "url(#foodGradient)",
    Transport: "url(#transportGradient)",
    Accommodation: "url(#accommodationGradient)",
    Shopping: "url(#shoppingGradient)",
    Others: "url(#othersGradient)",
  };

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <div className="flex flex-col justify-between gap-2 md:flex-row md:items-end">
        <div>
          <h2 className="text-xl font-semibold text-[#24352B]">
            Category Spending Chart
          </h2>

          <p className="mt-1 text-sm text-[#6A756D]">
            Visual breakdown of total spending by category.
          </p>
        </div>

        <div className="rounded-2xl bg-[#F7F5F0] px-4 py-3 text-right">
          <p className="text-xs font-semibold uppercase text-[#6A756D]">
            Total Spending
          </p>
          <p className="text-lg font-bold text-[#5B8C63]">
            RM {totalSpending.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="relative mt-4 h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <defs>
              <linearGradient id="foodGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#A8E6A1" />
                <stop offset="100%" stopColor="#5B8C63" />
              </linearGradient>

              <linearGradient id="transportGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#A5D8FF" />
                <stop offset="100%" stopColor="#4D96FF" />
              </linearGradient>

              <linearGradient id="accommodationGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FFD6A5" />
                <stop offset="100%" stopColor="#F4A261" />
              </linearGradient>

              <linearGradient id="shoppingGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#E0BBFF" />
                <stop offset="100%" stopColor="#B07DFF" />
              </linearGradient>

              <linearGradient id="othersGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#D9D9D9" />
                <stop offset="100%" stopColor="#9E9E9E" />
              </linearGradient>
            </defs>

            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="48%"
              outerRadius={100}
              innerRadius={58}
              paddingAngle={4}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={gradientMap[entry.name] || "url(#othersGradient)"}
                />
              ))}
            </Pie>

            <Tooltip
              formatter={(value) => [
                `RM ${Number(value).toFixed(2)}`,
                "Amount",
              ]}
            />

            <Legend />
          </PieChart>
        </ResponsiveContainer>

        <div className="pointer-events-none absolute left-1/2 top-[43%] -translate-x-1/2 -translate-y-1/2 text-center">
          <p className="text-xs font-semibold uppercase text-[#6A756D]">
            Total
          </p>
          <p className="text-xl font-bold text-[#24352B]">
            RM {totalSpending.toFixed(0)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default CategoryPieChart;