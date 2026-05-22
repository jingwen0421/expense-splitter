function GroupSummary({
  groupName,
  members,
  expenses,
  totalSpending,
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