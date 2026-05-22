function ExpenseHistory({ expenses, deleteExpense, editExpense }) {
  return (
    <div className="mt-6 rounded-2xl bg-white p-6 shadow">
      <h2 className="text-xl font-semibold text-gray-800">
        Expense History
      </h2>

      <div className="mt-3 space-y-3">
        {expenses.length === 0 ? (
          <p className="text-sm text-gray-500">No expenses added yet.</p>
        ) : (
          [...expenses]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((expense) => (
              <div
                key={expense.id}
                className="rounded-xl border border-gray-200 p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {expense.title}
                    </h3>

                    <p className="mt-1 text-xs text-[#6A756D]">
                        {expense.createdAt
                            ? new Date(expense.createdAt).toLocaleString("en-MY", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                            })
                            : "No date"}
                        </p>

                    <p className="mt-1 text-sm text-gray-600">
                      Paid by {expense.paidBy}
                    </p>

                    <p className="mt-1 text-sm text-gray-600">
                      Split type:{" "}
                      <span className="font-medium">
                        {expense.splitType === "unequal"
                          ? "Unequal Split"
                          : "Equal Split"}
                      </span>
                    </p>

                    <p className="mt-1 text-sm text-gray-600">
                      Split among: {expense.splitAmong.join(", ")}
                    </p>

                    {expense.splitType === "unequal" && (
                      <div className="mt-2 rounded-lg bg-gray-100 p-3">
                        <p className="text-xs font-semibold text-gray-700">
                          Custom Shares
                        </p>

                        <div className="mt-2 space-y-1">
                          {expense.splitAmong.map((member) => (
                            <p
                              key={member}
                              className="flex justify-between text-xs text-gray-600"
                            >
                              <span>{member}</span>
                              <span>
                                RM{" "}
                                {Number(
                                  expense.customShares?.[member] || 0
                                ).toFixed(2)}
                              </span>
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="text-right">
                    <p className="font-semibold text-gray-800">
                      RM {expense.amount.toFixed(2)}
                    </p>

                    <div className="mt-2 flex gap-3">
                      <button
                        onClick={() => editExpense(expense)}
                        className="text-sm font-medium text-[#5B8C63] hover:text-[#4D7C55] hover:underline"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deleteExpense(expense.id)}
                        className="text-sm font-medium text-red-600 hover:text-red-700 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
}

export default ExpenseHistory;