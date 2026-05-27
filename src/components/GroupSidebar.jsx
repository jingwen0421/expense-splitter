function GroupSidebar({
  groups,
  selectedGroupId,
  newGroupName,
  setNewGroupName,
  createGroup,
  selectGroup,
  deleteGroup,
  selectedGroup,
  groupName,
  setGroupName,
  memberInput,
  setMemberInput,
  members,
  addMember,
  removeMember,
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
                className={`rounded-2xl border p-3 ${
                  selectedGroupId === group.id
                    ? "border-[#5B8C63] bg-[#EEF6EF]"
                    : "border-[#E5E1D8] bg-white"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <button
                    onClick={() => selectGroup(group.id)}
                    className="flex-1 text-left"
                  >
                    <p className="font-semibold text-[#24352B]">{group.name}</p>
                    <p className="mt-1 text-xs text-[#6A756D]">
                      {group.members.length} members · {group.expenses.length} expenses
                    </p>
                  </button>

                  <button
                    onClick={() => deleteGroup(group.id)}
                    className="text-xs font-medium text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        {selectedGroup && (
  <div className="mt-6 rounded-3xl bg-[#F7F5F0] p-4">
    <h3 className="text-lg font-bold text-[#24352B]">
      Group & Members
    </h3>

    <label className="mt-4 block text-sm font-medium text-[#24352B]">
      Group Name
    </label>
    <input
      className="mt-1 w-full rounded-xl border border-[#D8D4CA] bg-white p-2 text-sm outline-none focus:border-[#5B8C63]"
      value={groupName}
      onChange={(event) => setGroupName(event.target.value)}
    />

    <label className="mt-4 block text-sm font-medium text-[#24352B]">
      Add Member
    </label>
    <div className="mt-1 flex gap-2">
      <input
        className="w-full rounded-xl border border-[#D8D4CA] bg-white p-2 text-sm outline-none focus:border-[#5B8C63]"
        placeholder="Jing Wen"
        value={memberInput}
        onChange={(event) => setMemberInput(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") addMember();
        }}
      />

      <button
        onClick={addMember}
        className="rounded-xl bg-[#5B8C63] px-4 py-2 text-sm font-semibold text-white hover:bg-[#4D7C55]"
      >
        Add
      </button>
    </div>

    <div className="mt-4">
      <p className="text-sm font-medium text-[#24352B]">Members</p>

      <div className="mt-2 space-y-2">
        {members.length === 0 ? (
          <p className="text-sm text-[#6A756D]">No members yet.</p>
        ) : (
          members.map((member) => (
            <div
              key={member}
              className="flex items-center justify-between rounded-xl bg-white px-3 py-2"
            >
              <span className="text-sm font-medium text-[#24352B]">
                {member}
              </span>

              <button
                onClick={() => removeMember(member)}
                className="text-xs font-medium text-red-600 hover:text-red-700 hover:underline"
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  </div>
)}
      </div>
    </aside>
  );
}

export default GroupSidebar;