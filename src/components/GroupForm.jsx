import Avatar from "./Avatar";

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
    <aside className="rounded-3xl bg-white p-5 shadow-sm">
      <h2 className="text-2xl font-bold text-[#24352B]">FairShare</h2>
      <p className="mt-1 text-sm text-[#6A756D]">
        Manage groups, members, and shared expenses.
      </p>

      <div className="mt-6">
        <label className="block text-sm font-semibold text-[#24352B]">
          Create Group
        </label>

        <div className="mt-2 flex gap-2">
          <input
            className="w-full rounded-xl border border-[#D8D4CA] bg-[#F7F5F0] p-2 text-sm outline-none focus:border-[#5B8C63]"
            placeholder="Penang Trip"
            value={newGroupName}
            onChange={(event) => setNewGroupName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") createGroup();
            }}
          />

          <button
            onClick={createGroup}
            className="rounded-xl bg-[#5B8C63] px-4 py-2 text-sm font-semibold text-white hover:bg-[#4D7C55]"
          >
            Add
          </button>
        </div>
      </div>

      <div className="mt-6">
        <p className="text-sm font-semibold text-[#24352B]">Groups</p>

        <div className="mt-2 space-y-2">
          {groups.length === 0 ? (
            <p className="rounded-xl bg-[#F7F5F0] p-3 text-sm text-[#6A756D]">
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
                <button
                  onClick={() => selectGroup(group.id)}
                  className="w-full text-left"
                >
                  <p className="font-semibold text-[#24352B]">{group.name}</p>
                  <p className="mt-1 text-xs text-[#6A756D]">
                    {group.members.length} members · {group.expenses.length} expenses
                  </p>
                </button>

                <button
                  onClick={() => deleteGroup(group.id)}
                  className="mt-2 text-xs font-medium text-red-600 hover:text-red-700 hover:underline"
                >
                  Delete group
                </button>
              </div>
            ))
          )}
        </div>
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
                    <div className="flex items-center gap-3">
                      <Avatar name={member} />
                      <span className="text-sm font-medium text-[#24352B]">
                        {member}
                      </span>
                    </div>

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
    </aside>
  );
}

export default GroupSidebar;