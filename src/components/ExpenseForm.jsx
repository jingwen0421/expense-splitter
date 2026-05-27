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
  percentageShares,
  updatePercentageShare,
  selectAllMembers,
  clearSelectedMembers,
  unequalMethod,
  setUnequalMethod,
}) {
  const customShareTotal = splitAmong.reduce((total, member) => {
    return total + Number(customShares[member] || 0);
  }, 0);

  const percentageTotal = splitAmong.reduce((total, member) => {
    return total + Number(percentageShares[member] || 0);
  }, 0);

  const expenseAmount = Number(amount || 0);

  const isCustomShareCorrect =
    splitType === "unequal" &&
    unequalMethod === "amount" &&
    Math.abs(customShareTotal - expenseAmount) < 0.01 &&
    expenseAmount > 0;

  const isPercentageCorrect =
    splitType === "unequal" &&
    unequalMethod === "percentage" &&
    Math.abs(percentageTotal - 100) < 0.01 &&
    expenseAmount > 0;

  const equalShare =
    splitType === "equal" && splitAmong.length > 0
      ? expenseAmount / splitAmong.length
      : 0;

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-[#24352B]">
            {editingExpenseId ? "Edit Expense" : "Add New Expense"}
          </h2>
          <p className="mt-1 text-sm text-[#6A756D]">
            Record who paid and how the cost should be split.
          </p>
        </div>

        {editingExpenseId && (
          <button
            onClick={resetExpenseForm}
            className="text-sm text-[#6A756D] hover:underline"
          >
            Cancel
          </button>
        )}
      </div>

      <label className="mt-4 block text-sm font-medium text-[#24352B]">
        Expense Title
      </label>
      <input
        className="mt-1 w-full rounded-xl border border-[#D8D4CA] bg-[#F7F5F0] p-3 text-sm outline-none focus:border-[#5B8C63]"
        placeholder="Example: Dinner"
        value={expenseTitle}
        onChange={(event) => setExpenseTitle(event.target.value)}
      />

      <label className="mt-4 block text-sm font-medium text-[#24352B]">
        Amount (RM)
      </label>
      <input
        className="mt-1 w-full rounded-xl border border-[#D8D4CA] bg-[#F7F5F0] p-3 text-sm outline-none focus:border-[#5B8C63]"
        type="number"
        placeholder="Example: 90"
        value={amount}
        onChange={(event) => setAmount(event.target.value)}
      />

      <label className="mt-4 block text-sm font-medium text-[#24352B]">
        Paid By
      </label>
      <select
        className="mt-1 w-full rounded-xl border border-[#D8D4CA] bg-[#F7F5F0] p-3 text-sm outline-none focus:border-[#5B8C63]"
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

      <label className="mt-4 block text-sm font-medium text-[#24352B]">
  Split Type
        </label>
        <select
          className="mt-1 w-full rounded-xl border border-[#D8D4CA] bg-[#F7F5F0] p-3 text-sm outline-none focus:border-[#5B8C63]"
          value={splitType}
          onChange={(event) => {
            setSplitType(event.target.value);

            if (event.target.value === "equal") {
              setUnequalMethod("amount");
            }
          }}
        >
          <option value="equal">Equal Split</option>
          <option value="unequal">Unequal Split</option>
        </select>

        {splitType === "unequal" && (
          <>
            <label className="mt-4 block text-sm font-medium text-[#24352B]">
              Unequal Method
            </label>
            <select
              className="mt-1 w-full rounded-xl border border-[#D8D4CA] bg-[#F7F5F0] p-3 text-sm outline-none focus:border-[#5B8C63]"
              value={unequalMethod}
              onChange={(event) => setUnequalMethod(event.target.value)}
            >
              <option value="amount">By Amount</option>
              <option value="percentage">By Percentage</option>
            </select>
          </>
        )}

      <div className="mt-4">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-medium text-[#24352B]">
            Who should share this cost?
          </p>

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
            <p className="text-sm text-[#6A756D]">Add members first.</p>
          ) : (
            members.map((member) => {
              const percentage = Number(percentageShares[member] || 0);
              const percentageAmount = expenseAmount * (percentage / 100);

              return (
                <div
                  key={member}
                  className={`rounded-xl border p-3 ${
                    splitAmong.includes(member)
                      ? "border-[#5B8C63] bg-[#EEF6EF]"
                      : "border-[#E5E1D8] bg-white"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleSplitMember(member)}
                    className="flex w-full items-center justify-between text-left"
                  >
                    <span className="text-sm font-medium text-[#24352B]">
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

                 {splitType === "unequal" &&
                    unequalMethod === "amount" &&
                    splitAmong.includes(member) && (
                    <input
                      className="mt-3 w-full rounded-lg border border-[#D8D4CA] bg-white p-2 text-sm outline-none focus:border-[#5B8C63]"
                      type="number"
                      placeholder={`Amount for ${member}`}
                      value={customShares[member] || ""}
                      onChange={(event) =>
                        updateCustomShare(member, event.target.value)
                      }
                    />
                  )}

                  {splitType === "unequal" &&
                    unequalMethod === "percentage" &&
                    splitAmong.includes(member) && (
                      <div className="mt-3">
                        <input
                          className="w-full rounded-lg border border-[#D8D4CA] bg-white p-2 text-sm outline-none focus:border-[#5B8C63]"
                          type="number"
                          placeholder={`Percentage for ${member}`}
                          value={percentageShares[member] || ""}
                          onChange={(event) =>
                            updatePercentageShare(member, event.target.value)
                          }
                        />

                        <p className="mt-1 text-xs text-[#6A756D]">
                          Estimated share: RM {percentageAmount.toFixed(2)}
                        </p>
                      </div>
                    )}
                </div>
              );
            })
          )}
        </div>

        {splitType === "equal" && splitAmong.length > 0 && expenseAmount > 0 && (
          <p className="mt-3 rounded-lg bg-[#EEF6EF] px-3 py-2 text-sm font-medium text-[#5B8C63]">
            Each selected member will pay RM {equalShare.toFixed(2)}
          </p>
        )}

        {splitType === "unequal" && unequalMethod === "amount" && (
          <p
            className={`mt-3 rounded-lg px-3 py-2 text-sm font-medium ${
              isCustomShareCorrect
                ? "bg-[#EEF6EF] text-[#5B8C63]"
                : "bg-red-50 text-red-700"
            }`}
          >
            Custom shares total: RM {customShareTotal.toFixed(2)} / RM{" "}
            {expenseAmount.toFixed(2)}
          </p>
        )}

        {splitType === "unequal" && unequalMethod === "percentage" && (
          <p
            className={`mt-3 rounded-lg px-3 py-2 text-sm font-medium ${
              isPercentageCorrect
                ? "bg-[#EEF6EF] text-[#5B8C63]"
                : "bg-red-50 text-red-700"
            }`}
          >
            Percentage total: {percentageTotal.toFixed(2)}% / 100%
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