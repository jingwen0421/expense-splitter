import { useState } from "react";

function ExpenseHistory({ expenses, deleteExpense, editExpense }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredExpenses = [...expenses]
    .filter((expense) => {
      const searchText = searchTerm.toLowerCase();

      return (
        expense.title.toLowerCase().includes(searchText) ||
        expense.paidBy.toLowerCase().includes(searchText) ||
        expense.splitAmong.join(" ").toLowerCase().includes(searchText) ||
        (expense.splitType || "equal").toLowerCase().includes(searchText)
      );
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="mt-6 rounded-3xl bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-[#24352B]">
        Expense History
      </h2>

      <p className="mt-1 text-sm text-[#6A756D]">
        Search and review all expenses recorded in this group.
      </p>

      <div className="mt-4">
        <div className="flex gap-2">
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="w-full rounded-xl border border-[#D8D4CA] bg-[#F7F5F0] px-4 py-3 text-sm outline-none focus:border-[#5B8C63]"
            placeholder="Search by title, payer, member, or split type..."
          />

          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="rounded-xl bg-[#EEF6EF] px-4 py-2 text-sm font-semibold text-[#5B8C63] hover:bg-[#DDEEDD]"
            >
              Clear
            </button>
          )}
        </div>

        {expenses.length > 0 && (
          <p className="mt-2 text-xs text-[#6A756D]">
            Showing {filteredExpenses.length} of {expenses.length} expense
            {expenses.length > 1 ? "s" : ""}
          </p>
        )}
      </div>

      <div className="mt-4 space-y-3">
        {expenses.length === 0 ? (
          <p className="text-sm text-gray-500">No expenses added yet.</p>
        ) : filteredExpenses.length === 0 ? (
          <p className="rounded-xl bg-[#F7F5F0] p-4 text-sm text-[#6A756D]">
            No expenses found for “{searchTerm}”.
          </p>
        ) : (
          filteredExpenses.map((expense) => (
            <div
              key={expense.id}
              className="rounded-2xl border border-[#E5E1D8] p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-[#24352B]">
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

                  <p className="mt-2 text-sm text-[#6A756D]">
                    Paid by{" "}
                    <span className="font-medium text-[#24352B]">
                      {expense.paidBy}
                    </span>
                  </p>

                  <p className="mt-1 text-sm text-[#6A756D]">
                    Split type:{" "}
                    <span className="font-medium text-[#24352B]">
                      {expense.splitType === "unequal"
                        ? "Unequal Split"
                        : "Equal Split"}
                    </span>
                  </p>

                  <p className="mt-1 text-sm text-[#6A756D]">
                    Split among: {expense.splitAmong.join(", ")}
                  </p>

                  {expense.splitType === "unequal" && (
                    <div className="mt-3 rounded-xl bg-[#F7F5F0] p-3">
                      <p className="text-xs font-semibold text-[#24352B]">
                        Custom Shares
                      </p>

                      <div className="mt-2 space-y-1">
                        {expense.splitAmong.map((member) => (
                          <p
                            key={member}
                            className="flex justify-between text-xs text-[#6A756D]"
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
                  <p className="font-semibold text-[#24352B]">
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