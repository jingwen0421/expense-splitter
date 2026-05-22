function ExpenseForm({
  members,
  expenseTitle,
  setExpenseTitle,
  amount,
  setAmount,
  paidBy,
  setPaidBy,
  splitAmong,
  toggleSplitMember,
  addExpense,
  editingExpenseId,
  resetExpenseForm,
  splitType,
  setSplitType,
  customShares,
  updateCustomShare,
  selectAllMembers,
  clearSelectedMembers,
}) {
  const customShareTotal = splitAmong.reduce((total, member) => {
    return total + Number(customShares[member] || 0);
  }, 0);

  const expenseAmount = Number(amount || 0);
  const isCustomShareCorrect =
    splitType === "unequal" &&
    Math.abs(customShareTotal - expenseAmount) < 0.01 &&
    expenseAmount > 0;

  return (
    <div className="rounded-2xl bg-white p-6 shadow">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">
          {editingExpenseId ? "2. Edit Expense" : "2. Add Expense"}
        </h2>

        {editingExpenseId && (
          <button
            onClick={resetExpenseForm}
            className="text-sm text-gray-500 hover:underline"
          >
            Cancel
          </button>
        )}
      </div>

      <label className="mt-4 block text-sm font-medium text-gray-700">
        Expense Title
      </label>
      <input
        className="mt-1 w-full rounded-lg border border-gray-300 p-2"
        placeholder="Example: Dinner"
        value={expenseTitle}
        onChange={(event) => setExpenseTitle(event.target.value)}
      />

      <label className="mt-4 block text-sm font-medium text-gray-700">
        Amount (RM)
      </label>
      <input
        className="mt-1 w-full rounded-lg border border-gray-300 p-2"
        type="number"
        placeholder="Example: 90"
        value={amount}
        onChange={(event) => setAmount(event.target.value)}
      />

      <label className="mt-4 block text-sm font-medium text-gray-700">
        Paid By
      </label>
      <select
        className="mt-1 w-full rounded-lg border border-gray-300 p-2"
        value={paidBy}
        onChange={(event) => setPaidBy(event.target.value)}
      >
        <option value="">Select payer</option>
        {members.map((member) => (
          <option key={member} value={member}>
            {member}
          </option>
        ))}
      </select>

      <label className="mt-4 block text-sm font-medium text-gray-700">
        Split Type
      </label>
      <select
        className="mt-1 w-full rounded-lg border border-gray-300 p-2"
        value={splitType}
        onChange={(event) => setSplitType(event.target.value)}
      >
        <option value="equal">Equal Split</option>
        <option value="unequal">Unequal Split</option>
      </select>

      <div className="mt-4">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-medium text-gray-700">Who should share this cost?</p>

          <div className="flex gap-2">
            <button
              onClick={selectAllMembers}
              type="button"
              className="rounded-full bg-[#EEF6EF] px-3 py-1 text-xs font-semibold text-[#5B8C63] hover:bg-[#DDEEDD]"
            >
              Select All
            </button>

            <button
              onClick={clearSelectedMembers}
              type="button"
              className="rounded-full bg-[#EEF6EF] px-3 py-1 text-xs font-semibold text-[#5B8C63] hover:bg-[#DDEEDD]"
            >
              None
            </button>
          </div>
        </div>

        <div className="mt-2 space-y-2">
          {members.length === 0 ? (
            <p className="text-sm text-gray-500">Add members first.</p>
          ) : (
            members.map((member) => (
              <div
                key={member}
                className={`rounded-lg border p-3 ${
                  splitAmong.includes(member)
                    ? "border-gray-800 bg-gray-100"
                    : "border-gray-200 bg-white"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleSplitMember(member)}
                  className="flex w-full items-center justify-between text-left"
                >
                  <span className="text-sm font-medium text-gray-700">
                    {member}
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs ${
                      splitAmong.includes(member)
                        ? "bg-[#5B8C63] text-white"
                        : "bg-[#EEF6EF] text-[#5B8C63]"
                    }`}
                  >
                    {splitAmong.includes(member) ? "Selected" : "Select"}
                  </span>
                </button>

                {splitType === "unequal" && splitAmong.includes(member) && (
                  <input
                    className="mt-3 w-full rounded-lg border border-gray-300 p-2 text-sm"
                    type="number"
                    placeholder={`Amount for ${member}`}
                    value={customShares[member] || ""}
                    onChange={(event) =>
                      updateCustomShare(member, event.target.value)
                    }
                  />
                )}
              </div>
            ))
          )}
        </div>

        {splitType === "unequal" && (
          <p
            className={`mt-3 text-sm font-medium ${
              isCustomShareCorrect ? "text-green-700" : "text-red-700"
            }`}
          >
            Custom shares total: RM {customShareTotal.toFixed(2)} / RM{" "}
            {expenseAmount.toFixed(2)}
          </p>
        )}
      </div>

      <button
        onClick={addExpense}
        disabled={members.length === 0}
        className={`mt-6 w-full rounded-xl px-4 py-3 font-semibold text-white ${
            members.length === 0
            ? "cursor-not-allowed bg-gray-300"
            : "bg-[#5B8C63] hover:bg-[#4D7C55]"
        }`}
        >
        {members.length === 0
            ? "Add members first"
            : editingExpenseId
            ? "Save Changes"
            : "Save Expense"}
      </button>
    </div>
  );
}

export default ExpenseForm;