export function calculateBalances(members, expenses) {
  const balances = {};

  members.forEach((member) => {
    balances[member] = 0;
  });

  expenses.forEach((expense) => {
    balances[expense.paidBy] += expense.amount;

    expense.splitAmong.forEach((member) => {
        const share =
        expense.splitType === "unequal"
            ? expense.customShares[member]
            : expense.amount / expense.splitAmong.length;

        balances[member] -= share;
    });
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