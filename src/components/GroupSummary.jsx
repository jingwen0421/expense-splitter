function GroupSummary({
  groupName,
  members,
  expenses,
  totalSpending,
  categoryTotals,
  resetApp,
}) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow">
      <h2 className="text-xl font-semibold text-gray-800">
        Group Summary
      </h2>

      <p className="mt-3 text-gray-700">
        <span className="font-medium">Group:</span>{" "}
        {groupName || "Unnamed Group"}
      </p>

      <p className="mt-1 text-gray-700">
        <span className="font-medium">Members:</span> {members.length}
      </p>

      <p className="mt-1 text-gray-700">
        <span className="font-medium">Expenses:</span> {expenses.length}
      </p>

      <p className="mt-1 text-gray-700">
        <span className="font-medium">Total Spending:</span> RM{" "}
        {totalSpending.toFixed(2)}
      </p>

      <div className="mt-4">
  <p className="text-sm font-medium text-[#24352B]">
    Spending by Category
  </p>

  <div className="mt-2 space-y-2">
      {Object.keys(categoryTotals).length === 0 ? (
        <p className="text-sm text-[#6A756D]">
          No category spending yet.
        </p>
      ) : (
        Object.entries(categoryTotals).map(([category, total]) => (
          <div
            key={category}
            className="flex justify-between rounded-xl bg-[#F7F5F0] px-3 py-2 text-sm"
          >
            <span className="font-medium text-[#24352B]">{category}</span>
            <span className="font-semibold text-[#5B8C63]">
              RM {total.toFixed(2)}
            </span>
          </div>
        ))
      )}
    </div>
  </div>

      <button
        onClick={resetApp}
        className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-500"
      >
        Reset All Data
      </button>
    </div>
  );
}

export default GroupSummary;