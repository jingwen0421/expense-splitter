import { useEffect, useState } from "react";
import { calculateBalances, calculateSettlements } from "./utils/calculations";

import GroupSidebar from "./components/GroupSidebar";
import GroupForm from "./components/GroupForm";
import ExpenseForm from "./components/ExpenseForm";
import GroupSummary from "./components/GroupSummary";
import BalanceSummary from "./components/BalanceSummary";
import SettlementSummary from "./components/SettlementSummary";
import ExpenseHistory from "./components/ExpenseHistory";

function App() {
  const [groups, setGroups] = useState(() => {
    const savedGroups = localStorage.getItem("groups");
    return savedGroups ? JSON.parse(savedGroups) : [];
  });

  const [selectedGroupId, setSelectedGroupId] = useState(() => {
    return localStorage.getItem("selectedGroupId") || null;
  });

  const [newGroupName, setNewGroupName] = useState("");
  const [memberInput, setMemberInput] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [toast, setToast] = useState("");

  const [expenseTitle, setExpenseTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [splitAmong, setSplitAmong] = useState([]);
  const [splitType, setSplitType] = useState("equal");
  const [unequalMethod, setUnequalMethod] = useState("amount");
  const [customShares, setCustomShares] = useState({});
  const [percentageShares, setPercentageShares] = useState({});
  const [editingExpenseId, setEditingExpenseId] = useState(null);

  useEffect(() => {
    localStorage.setItem("groups", JSON.stringify(groups));
  }, [groups]);

  useEffect(() => {
    if (selectedGroupId) {
      localStorage.setItem("selectedGroupId", selectedGroupId);
    }
  }, [selectedGroupId]);

  const selectedGroup = groups.find((group) => group.id === selectedGroupId);

  const members = selectedGroup ? selectedGroup.members : [];
  const expenses = selectedGroup ? selectedGroup.expenses : [];
  const paidSettlements = selectedGroup ? selectedGroup.paidSettlements || [] : [];
  const groupName = selectedGroup ? selectedGroup.name : "";

  function updateSelectedGroup(updatedData) {
    setGroups((previousGroups) =>
      previousGroups.map((group) =>
        group.id === selectedGroupId ? { ...group, ...updatedData } : group
      )
    );
  }

  function showToast(message) {
    setToast(message);

    setTimeout(() => {
      setToast("");
    }, 2500);
  }

  function createGroup() {
    const name = newGroupName.trim();

    if (!name) {
      showToast("Please enter a group name.");
      return;
    }

    const newGroup = {
      id: Date.now().toString(),
      name,
      members: [],
      expenses: [],
      paidSettlements: [],
      createdAt: new Date().toISOString(),
    };

    setGroups([newGroup, ...groups]);
    setSelectedGroupId(newGroup.id);
    setNewGroupName("");
    showToast("Group created successfully.");
  }

  function selectGroup(groupId) {
    setSelectedGroupId(groupId);
    setMemberInput("");
    setActiveTab("overview");
    resetExpenseForm();
  }

  function deleteGroup(groupId) {
    const confirmDelete = confirm("Delete this group and all its data?");
    if (!confirmDelete) return;

    const updatedGroups = groups.filter((group) => group.id !== groupId);
    setGroups(updatedGroups);

    if (selectedGroupId === groupId) {
      const nextId = updatedGroups[0]?.id || null;
      setSelectedGroupId(nextId);
      // add this:
      if (!nextId) localStorage.removeItem("selectedGroupId");
    }
  }

  function setGroupName(newName) {
    if (!selectedGroup) return;

    updateSelectedGroup({
      name: newName,
    });
  }

  function addMember() {
    if (!selectedGroup) {
      showToast("Please create or select a group first.");
      return;
    }

    const name = memberInput.trim();

    if (!name) {
      showToast("Please enter a member name.");
      return;
    }

    if (members.includes(name)) {
      showToast("This member already exists.");
      return;
    }

    updateSelectedGroup({
      members: [...members, name],
    });

    setMemberInput("");
    showToast("Member added.");
  }

  function removeMember(memberName) {
    if (!selectedGroup) return;

    const isUsedInExpense = expenses.some((expense) => {
      return expense.paidBy === memberName || expense.splitAmong.includes(memberName);
    });

    if (isUsedInExpense) {
      showToast("Cannot remove this member because they are used in an existing expense.");
      return;
    }

    updateSelectedGroup({
      members: members.filter((member) => member !== memberName),
    });
    showToast("Member removed.");
  }

  function toggleSplitMember(name) {
    if (splitAmong.includes(name)) {
      setSplitAmong(splitAmong.filter((member) => member !== name));

      const updatedCustomShares = { ...customShares };
      delete updatedCustomShares[name];
      setCustomShares(updatedCustomShares);

      const updatedPercentageShares = { ...percentageShares };
      delete updatedPercentageShares[name];
      setPercentageShares(updatedPercentageShares);
    } else {
      setSplitAmong([...splitAmong, name]);

      setCustomShares({
        ...customShares,
        [name]: "",
      });

      setPercentageShares({
        ...percentageShares,
        [name]: "",
      });
    }
  }

  function updateCustomShare(memberName, value) {
    setCustomShares({
      ...customShares,
      [memberName]: value,
    });
  }

  function updatePercentageShare(memberName, value) {
    setPercentageShares({
      ...percentageShares,
      [memberName]: value,
    });
  }

  function selectAllMembers() {
    setSplitAmong(members);

    const shares = {};
    const percentages = {};

    members.forEach((member) => {
      shares[member] = customShares[member] || "";
      percentages[member] = percentageShares[member] || "";
    });

    setCustomShares(shares);
    setPercentageShares(percentages);
  }

  function clearSelectedMembers() {
    setSplitAmong([]);
    setCustomShares({});
    setPercentageShares({});
  }
  function addExpense() {
    if (!selectedGroup) {
      showToast("Please create or select a group first.");
      return;
    }

    const numericAmount = parseFloat(amount);

    if (!expenseTitle.trim()) {
      showToast("Please enter an expense title.");
      return;
    }

    if (!numericAmount || numericAmount <= 0) {
      showToast("Please enter a valid amount.");
      return;
    }

    if (!paidBy) {
      showToast("Please select who paid.");
      return;
    }

    if (splitAmong.length === 0) {
      showToast("Please select at least one person to split with.");
      return;
    }

    let finalCustomShares = {};
    let finalPercentageShares = {};

    if (splitType === "unequal" && unequalMethod === "amount") {
      let totalCustomShare = 0;

      for (const member of splitAmong) {
        const share = parseFloat(customShares[member]);

        if (isNaN(share) || share < 0) {
          showToast("Please enter valid custom shares.");
          return;
        }

        finalCustomShares[member] = share;
        totalCustomShare += share;
      }

      if (Math.abs(totalCustomShare - numericAmount) > 0.01) {
        showToast("Unequal shares must add up to the total amount.");
        return;
      }
    }

    if (splitType === "unequal" && unequalMethod === "percentage") {
      let totalPercentage = 0;

      for (const member of splitAmong) {
        const percentage = parseFloat(percentageShares[member]);

        if (isNaN(percentage) || percentage < 0) {
          showToast("Please enter valid percentages.");
          return;
        }

        finalPercentageShares[member] = percentage;
        totalPercentage += percentage;
      }

      if (Math.abs(totalPercentage - 100) > 0.01) {
        showToast("Percentages must add up to 100%.");
        return;
      }
    }

    const savedExpense = {
      id: editingExpenseId || Date.now().toString(),
      title: expenseTitle.trim(),
      amount: numericAmount,
      paidBy,
      splitAmong,
      splitType,
      unequalMethod: splitType === "unequal" ? unequalMethod : null,
      customShares:
        splitType === "unequal" && unequalMethod === "amount"
          ? finalCustomShares
          : {},
      percentageShares:
        splitType === "unequal" && unequalMethod === "percentage"
          ? finalPercentageShares
          : {},
      createdAt:
        expenses.find((expense) => expense.id === editingExpenseId)?.createdAt ||
        new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedExpenses = editingExpenseId
      ? expenses.map((expense) =>
          expense.id === editingExpenseId ? savedExpense : expense
        )
      : [savedExpense, ...expenses];

    updateSelectedGroup({
      expenses: updatedExpenses,
    });

    resetExpenseForm();
    setActiveTab("history");
    showToast(editingExpenseId ? "Expense updated." : "Expense added.");
  }

  function deleteExpense(id) {
    updateSelectedGroup({
      expenses: expenses.filter((expense) => expense.id !== id),
    });

     showToast("Expense deleted.");
  }

  function editExpense(expense) {
    setEditingExpenseId(expense.id);
    setExpenseTitle(expense.title);
    setAmount(expense.amount.toString());
    setPaidBy(expense.paidBy);
    setSplitAmong(expense.splitAmong);
    setSplitType(expense.splitType || "equal");
    setUnequalMethod(expense.unequalMethod || "amount");
    setCustomShares(expense.customShares || {});
    setPercentageShares(expense.percentageShares || {});
    setActiveTab("add");
  }

  function resetExpenseForm() {
    setExpenseTitle("");
    setAmount("");
    setPaidBy("");
    setSplitAmong([]);
    setSplitType("equal");
    setCustomShares({});
    setPercentageShares({});
    setEditingExpenseId(null);
  }

  function getSettlementId(settlement) {
    return `${settlement.from}-${settlement.to}-${settlement.amount.toFixed(2)}`;
  }

  function toggleSettlementPaid(settlement) {
    if (!selectedGroup) return;

    const settlementId = getSettlementId(settlement);

    const alreadyPaid = paidSettlements.some(
      (item) => item.id === settlementId
    );

    let updatedPaidSettlements;

    if (alreadyPaid) {
      updatedPaidSettlements = paidSettlements.filter(
        (item) => item.id !== settlementId
      );

      showToast("Settlement marked as unpaid.");
    } else {
      updatedPaidSettlements = [
        ...paidSettlements,
        {
          id: settlementId,
          from: settlement.from,
          to: settlement.to,
          amount: settlement.amount,
          paidAt: new Date().toISOString(),
        },
      ];

      showToast("Settlement marked as paid.");
    }

    updateSelectedGroup({
      paidSettlements: updatedPaidSettlements,
    });
  }

  function resetApp() {
    const confirmReset = confirm("Are you sure you want to reset this group?");

    if (!confirmReset || !selectedGroup) return;

    updateSelectedGroup({
      members: [],
      expenses: [],
    });

    setMemberInput("");
    resetExpenseForm();
  }

  const balances = selectedGroup ? calculateBalances(members, expenses) : {};
  const settlements = calculateSettlements(balances);

function calculateOutstandingBalances(members, balances, paidSettlements) {
    const outstandingBalances = { ...balances };

    paidSettlements.forEach((payment) => {
      if (outstandingBalances[payment.from] !== undefined) {
        outstandingBalances[payment.from] += payment.amount;
      }

      if (outstandingBalances[payment.to] !== undefined) {
        outstandingBalances[payment.to] -= payment.amount;
      }
    });

    members.forEach((member) => {
      if (Math.abs(outstandingBalances[member]) < 0.01) {
        outstandingBalances[member] = 0;
      }
    });

    return outstandingBalances;
  }

  const outstandingBalances = selectedGroup
    ? calculateOutstandingBalances(members, balances, paidSettlements)
    : {};

  const totalSpending = expenses.reduce((total, expense) => {
    return total + expense.amount;
  }, 0);

  return (
      <div className="min-h-screen bg-[#F7F5F0] px-4 py-8 text-[#24352B]">      {toast && (
        <div className="fixed right-5 top-5 z-50 rounded-2xl bg-[#24352B] px-5 py-3 text-sm text-white shadow-lg">
          {toast}
        </div>
      )}
      <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-[320px_1fr]">
        <GroupSidebar
          groups={groups}
          selectedGroupId={selectedGroupId}
          newGroupName={newGroupName}
          setNewGroupName={setNewGroupName}
          createGroup={createGroup}
          selectGroup={selectGroup}
          deleteGroup={deleteGroup}
        />

        <main>
          {!selectedGroup ? (
                          <div>
                <div className="flex min-h-[70vh] items-center justify-center rounded-3xl bg-white p-8 text-center shadow-sm">
                  <div>
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#EEF6EF] text-3xl">
                      💸
                    </div>

                    <h2 className="mt-5 text-3xl font-bold text-[#24352B]">
                      Create your first expense group
                    </h2>

                    <p className="mx-auto mt-2 max-w-md text-sm text-[#6A756D]">
                      Start with a group like “Penang Trip”, “Dinner with Friends”, or “Housemates”.
                      Then add members and record shared expenses.
                    </p>
                  </div>
                </div>
                <p className="mt-2 text-sm text-[#6A756D]">
                  Example: Penang Trip, Dinner Group, Housemates.
                </p>
              </div>
          ) : (
            <>
              <div className="mb-6 rounded-3xl bg-white p-6 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-widest text-[#5B8C63]">
                  Selected Group
                </p>

                <div className="mt-1 flex flex-col justify-between gap-4 md:flex-row md:items-end">
                  <div>
                    <h1 className="text-4xl font-bold text-[#24352B]">
                      {groupName}
                    </h1>
                    <p className="mt-2 text-sm text-[#6A756D]">
                      Track shared expenses, split costs, and see who should pay whom.
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="rounded-2xl bg-[#F7F5F0] px-4 py-3">
                      <p className="text-xs font-semibold text-[#6A756D]">Members</p>
                      <p className="text-lg font-bold">{members.length}</p>
                    </div>

                    <div className="rounded-2xl bg-[#F7F5F0] px-4 py-3">
                      <p className="text-xs font-semibold text-[#6A756D]">Expenses</p>
                      <p className="text-lg font-bold">{expenses.length}</p>
                    </div>

                    <div className="rounded-2xl bg-[#F7F5F0] px-4 py-3">
                      <p className="text-xs font-semibold text-[#6A756D]">Total</p>
                      <p className="text-lg font-bold">RM {totalSpending.toFixed(0)}</p>
                    </div>
                  </div>
                </div>
              </div>
            <div className="mb-6 flex flex-wrap gap-2">
            {[
              { id: "overview", label: "Overview" },
              { id: "add", label: "Add / Edit Expense" },
              { id: "history", label: " Expense History" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                  activeTab === tab.id
                    ? "bg-[#24352B] text-white"
                    : "bg-white text-[#6A756D] hover:bg-[#EEF6EF] hover:text-[#5B8C63]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
      {activeTab === "overview" && (
        <>
        {members.length === 0 && expenses.length === 0 && (
          <div className="mb-6 rounded-3xl border border-dashed border-[#D8D4CA] bg-white p-6 shadow-sm">
            <h3 className="text-xl font-bold text-[#24352B]">
              Start in 3 simple steps
            </h3>

            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl bg-[#F7F5F0] p-4">
                <p className="text-sm font-semibold text-[#5B8C63]">Step 1</p>
                <p className="mt-1 font-medium text-[#24352B]">Add members</p>
                <p className="mt-1 text-sm text-[#6A756D]">
                  Add friends, housemates, or trip members.
                </p>
              </div>

              <div className="rounded-2xl bg-[#F7F5F0] p-4">
                <p className="text-sm font-semibold text-[#5B8C63]">Step 2</p>
                <p className="mt-1 font-medium text-[#24352B]">Record expenses</p>
                <p className="mt-1 text-sm text-[#6A756D]">
                  Enter who paid and who should share the cost.
                </p>
              </div>

              <div className="rounded-2xl bg-[#F7F5F0] p-4">
                <p className="text-sm font-semibold text-[#5B8C63]">Step 3</p>
                <p className="mt-1 font-medium text-[#24352B]">Settle up</p>
                <p className="mt-1 text-sm text-[#6A756D]">
                  View balances and see who should pay whom.
                </p>
              </div>
            </div>
          </div>
        )}
          <div className="grid gap-6 md:grid-cols-2">
            <GroupForm
              groupName={groupName}
              setGroupName={setGroupName}
              memberInput={memberInput}
              setMemberInput={setMemberInput}
              members={members}
              addMember={addMember}
              removeMember={removeMember}
            />

            <GroupSummary
              groupName={groupName}
              members={members}
              expenses={expenses}
              totalSpending={totalSpending}
              resetApp={resetApp}
            />
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <BalanceSummary members={members} balances={outstandingBalances} />

            <SettlementSummary
              groupName={groupName}
              settlements={settlements}
              paidSettlements={paidSettlements}
              toggleSettlementPaid={toggleSettlementPaid}
              getSettlementId={getSettlementId}
            />
          </div>
        </>
          )}

          {activeTab === "add" && (
            <ExpenseForm
              members={members}
              expenseTitle={expenseTitle}
              setExpenseTitle={setExpenseTitle}
              amount={amount}
              setAmount={setAmount}
              paidBy={paidBy}
              setPaidBy={setPaidBy}
              splitAmong={splitAmong}
              toggleSplitMember={toggleSplitMember}
              addExpense={addExpense}
              unequalMethod={unequalMethod}
              setUnequalMethod={setUnequalMethod}
              editingExpenseId={editingExpenseId}
              resetExpenseForm={resetExpenseForm}
              splitType={splitType}
              setSplitType={setSplitType}
              customShares={customShares}
              updateCustomShare={updateCustomShare}
              percentageShares={percentageShares}
              updatePercentageShare={updatePercentageShare}
              selectAllMembers={selectAllMembers}
              clearSelectedMembers={clearSelectedMembers}
            />
          )}

          {activeTab === "history" && (
            <ExpenseHistory
              expenses={expenses}
              deleteExpense={deleteExpense}
              editExpense={editExpense}
            />
          )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;