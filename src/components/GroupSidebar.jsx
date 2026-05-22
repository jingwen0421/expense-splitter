function GroupSidebar({
  groups,
  selectedGroupId,
  newGroupName,
  setNewGroupName,
  createGroup,
  selectGroup,
  deleteGroup,
}) {
  return (
    <aside className="rounded-2xl bg-white p-6 shadow md:sticky md:top-6 md:h-fit">
      <h1 className="text-3xl font-bold text-gray-800">FairShare</h1>
      <p className="mt-2 text-sm text-gray-600">
        Manage shared expenses across different groups.
      </p>

      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700">
          New Group
        </label>

        <div className="mt-2 flex gap-2">
          <input
            className="w-full rounded-lg border border-gray-300 p-2"
            placeholder="Example: Penang Trip"
            value={newGroupName}
            onChange={(event) => setNewGroupName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") createGroup();
            }}
          />

          <button
            onClick={createGroup}
            className="rounded-xl bg-[#5B8C63] px-4 py-2 font-semibold text-white hover:bg-[#4D7C55]"          >
            Add
          </button>
        </div>
      </div>

      <div className="mt-6">
        <p className="text-sm font-medium text-gray-700">Groups</p>

        <div className="mt-3 space-y-2">
          {groups.length === 0 ? (
            <p className="rounded-lg bg-gray-100 p-3 text-sm text-gray-500">
              No groups yet.
            </p>
          ) : (
            groups.map((group) => (
              <div
                key={group.id}
                className={`flex items-center justify-between rounded-lg border p-3 ${
                  selectedGroupId === group.id
                    ? "border-gray-800 bg-gray-100"
                    : "border-gray-200 bg-white"
                }`}
              >
                <button
                  onClick={() => selectGroup(group.id)}
                  className="text-left"
                >
                  <p className="font-semibold text-gray-800">{group.name}</p>
                  <p className="text-xs text-gray-500">
                    {group.members.length} members · {group.expenses.length} expenses
                  </p>
                </button>

                <button
                  onClick={() => deleteGroup(group.id)}
                  className="text-xs font-medium text-red-600 hover:text-red-700 hover:underline"                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </aside>
  );
}

export default GroupSidebar;