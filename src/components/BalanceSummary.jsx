import Avatar from "./Avatar";

function BalanceSummary({ members, balances }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow">
      <h2 className="text-xl font-semibold text-gray-800">
        Outstanding Balance
      </h2>

      <div className="mt-3 space-y-2">
        {members.length === 0 ? (
          <p className="text-sm text-gray-500">No outstanding balance yet.</p>
        ) : (
          members.map((member) => {
            const balance = Math.round(balances[member] * 100) / 100;

            return (
              <div
                key={member}
                className="flex justify-between rounded-lg bg-gray-100 px-3 py-2 text-sm"
              >
                <div className="flex items-center gap-3">
                <Avatar name={member} />
                <span className="font-medium text-[#24352B]">{member}</span>
                </div>                <span
                  className={
                    balance >= 0 ? "text-green-700" : "text-red-700"
                  }
                >
                  RM {balance.toFixed(2)}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default BalanceSummary;