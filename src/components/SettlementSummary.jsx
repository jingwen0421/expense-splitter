import { useState } from "react";

function SettlementSummary({
  groupName,
  settlements,
  paidSettlements,
  toggleSettlementPaid,
  getSettlementId,
}) {
  const [copied, setCopied] = useState(false);

  function isSettlementPaid(settlement) {
    const settlementId = getSettlementId(settlement);

    return paidSettlements.some((item) => item.id === settlementId);
  }

  const unpaidSettlements = settlements.filter(
    (settlement) => !isSettlementPaid(settlement)
  );

  const completedSettlements = settlements.filter((settlement) =>
    isSettlementPaid(settlement)
  );

  const totalOutstanding = unpaidSettlements.reduce((total, settlement) => {
    return total + settlement.amount;
  }, 0);

  const totalCompleted = completedSettlements.reduce((total, settlement) => {
    return total + settlement.amount;
  }, 0);

  function copySettlementSummary() {
    if (settlements.length === 0) {
      return;
    }

    const unpaidText =
      unpaidSettlements.length === 0
        ? "No outstanding settlements."
        : unpaidSettlements
            .map(
              (settlement) =>
                `${settlement.from} should pay ${
                  settlement.to
                } RM ${settlement.amount.toFixed(2)}`
            )
            .join("\n");

    const completedText =
      completedSettlements.length === 0
        ? "No completed payments yet."
        : completedSettlements
            .map(
              (settlement) =>
                `${settlement.from} paid ${
                  settlement.to
                } RM ${settlement.amount.toFixed(2)}`
            )
            .join("\n");

    const summaryText = `FairShare Settlement Summary - ${groupName}

  Outstanding Settlements:
  ${unpaidText}

  Completed Payments:
  ${completedText}

  Total Outstanding: RM ${totalOutstanding.toFixed(2)}
  Total Completed: RM ${totalCompleted.toFixed(2)}`;

    navigator.clipboard.writeText(summaryText);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-[#24352B]">
            Settlement Status
          </h2>
          <p className="mt-1 text-sm text-[#6A756D]">
            Track unpaid and completed settlements.
          </p>
        </div>

        <button
          onClick={copySettlementSummary}
          disabled={settlements.length === 0}
          className={`rounded-xl px-4 py-2 text-sm font-semibold ${
            settlements.length === 0
              ? "cursor-not-allowed bg-gray-200 text-gray-400"
              : "bg-[#24352B] text-white hover:bg-[#18241D]"
          }`}
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl bg-red-50 px-4 py-3">
          <p className="text-xs font-semibold uppercase text-red-700">
            Outstanding
          </p>
          <p className="mt-1 text-lg font-bold text-red-700">
            RM {totalOutstanding.toFixed(2)}
          </p>
        </div>

        <div className="rounded-2xl bg-green-50 px-4 py-3">
          <p className="text-xs font-semibold uppercase text-green-700">
            Completed
          </p>
          <p className="mt-1 text-lg font-bold text-green-700">
            RM {totalCompleted.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="mt-5">
        <h3 className="text-sm font-bold text-[#24352B]">
          Outstanding Settlements
        </h3>

        <div className="mt-3 space-y-3">
          {unpaidSettlements.length === 0 ? (
            <p className="rounded-2xl bg-[#F7F5F0] p-4 text-sm text-[#6A756D]">
              No outstanding settlements. All payments are completed.
            </p>
          ) : (
            unpaidSettlements.map((settlement, index) => (
              <div
                key={index}
                className="rounded-2xl border border-[#D8D4CA] bg-[#EEF6EF] px-4 py-3 text-sm text-[#24352B]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p>
                      <span className="font-semibold">{settlement.from}</span>{" "}
                      should pay{" "}
                      <span className="font-semibold">{settlement.to}</span>
                    </p>

                    <p className="mt-1 text-lg font-bold text-[#5B8C63]">
                      RM {settlement.amount.toFixed(2)}
                    </p>

                    <p className="mt-1 text-xs font-medium text-red-700">
                      Unpaid
                    </p>
                  </div>

                  <button
                    onClick={() => toggleSettlementPaid(settlement)}
                    className="rounded-xl bg-[#5B8C63] px-3 py-2 text-xs font-semibold text-white hover:bg-[#4D7C55]"
                  >
                    Mark Paid
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {completedSettlements.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-bold text-[#24352B]">
            Completed Payments
          </h3>

          <div className="mt-3 space-y-3">
            {completedSettlements.map((settlement, index) => (
              <div
                key={index}
                className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p>
                      <span className="font-semibold">{settlement.from}</span>{" "}
                      paid{" "}
                      <span className="font-semibold">{settlement.to}</span>
                    </p>

                    <p className="mt-1 text-lg font-bold text-green-700">
                      RM {settlement.amount.toFixed(2)}
                    </p>

                    <p className="mt-1 text-xs font-medium text-green-700">
                      Paid
                    </p>
                  </div>

                  <button
                    onClick={() => toggleSettlementPaid(settlement)}
                    className="rounded-xl bg-white px-3 py-2 text-xs font-semibold text-green-700 hover:bg-green-100"
                  >
                    Mark Unpaid
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SettlementSummary;