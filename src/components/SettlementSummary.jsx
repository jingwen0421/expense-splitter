import { useState } from "react";

function SettlementSummary({ settlements }) {
  const [copied, setCopied] = useState(false);

  function copySettlementSummary() {
    const summaryText = settlements
      .map(
        (s) => `${s.from} pays ${s.to} RM ${s.amount.toFixed(2)}`
      )
      .join("\n");

    navigator.clipboard.writeText(summaryText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Settlement Suggestion
        </h2>

        <button
          onClick={copySettlementSummary}
          disabled={settlements.length === 0}
          className="rounded-lg bg-gray-800 px-3 py-2 text-sm text-white transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {copied ? "Copied ✓" : "Copy"}
        </button>
      </div>

      <div className="mt-3 space-y-2">
        {settlements.length === 0 ? (
          <p className="text-sm text-gray-500">
            No settlement needed yet. Add expenses to see who should pay whom.
          </p>
        ) : (
          settlements.map((settlement, index) => (
            <div
              key={index}
              className="rounded-2xl bg-[#EEF6EF] px-4 py-3 text-sm text-[#24352B]"
            >
              <p>
                <span className="font-semibold">{settlement.from}</span> should pay{" "}
                <span className="font-semibold">{settlement.to}</span>
              </p>
              <p className="mt-1 text-lg font-bold text-[#5B8C63]">
                RM {settlement.amount.toFixed(2)}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default SettlementSummary;