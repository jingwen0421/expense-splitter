export function calculateBalances(members, expenses) {
  const balances = {};

  members.forEach((member) => {
    balances[member] = 0;
  });

  expenses.forEach((expense) => {
    balances[expense.paidBy] += expense.amount;

    if (expense.splitType === "unequal" && expense.unequalMethod === "amount") {
      expense.splitAmong.forEach((member) => {
        const share = Number(expense.customShares?.[member] || 0);
        balances[member] -= share;
      });
    } else if (
      expense.splitType === "unequal" &&
      expense.unequalMethod === "percentage"
    ) {
      expense.splitAmong.forEach((member) => {
        const percentage = Number(expense.percentageShares?.[member] || 0);
        const share = expense.amount * (percentage / 100);
        balances[member] -= share;
      });
    } else {
      const share = expense.amount / expense.splitAmong.length;

      expense.splitAmong.forEach((member) => {
        balances[member] -= share;
      });
    }
  });

  return balances;
}

export function calculateSettlements(balances) {
  const creditors = [];
  const debtors = [];

  Object.entries(balances).forEach(([name, balance]) => {
    const roundedBalance = Math.round(balance * 100) / 100;

    if (roundedBalance > 0) {
      creditors.push({ name, amount: roundedBalance });
    } else if (roundedBalance < 0) {
      debtors.push({ name, amount: Math.abs(roundedBalance) });
    }
  });

  const settlements = [];
  let i = 0;
  let j = 0;

  while (i < debtors.length && j < creditors.length) {
    const payment = Math.min(debtors[i].amount, creditors[j].amount);
    const roundedPayment = Math.round(payment * 100) / 100;

    settlements.push({
      from: debtors[i].name,
      to: creditors[j].name,
      amount: roundedPayment,
    });

    debtors[i].amount -= payment;
    creditors[j].amount -= payment;

    if (debtors[i].amount < 0.01) i++;
    if (creditors[j].amount < 0.01) j++;
  }

  return settlements;
}