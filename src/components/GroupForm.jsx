import Avatar from "./Avatar";

function GroupForm({
  groupName,
  setGroupName,
  memberInput,
  setMemberInput,
  members,
  addMember,
  removeMember,
}) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow">
      <h2 className="text-xl font-semibold text-gray-800">
        1. Group & Members
      </h2>

      <label className="mt-4 block text-sm font-medium text-gray-700">
        Group Name
      </label>
      <input
        className="mt-1 w-full rounded-lg border border-gray-300 p-2"
        placeholder="Example: Penang Trip"
        value={groupName}
        onChange={(event) => setGroupName(event.target.value)}
      />

      <label className="mt-4 block text-sm font-medium text-gray-700">
        Add Member
      </label>
      <div className="mt-1 flex gap-2">
        <input
          className="w-full rounded-lg border border-gray-300 p-2"
          placeholder="Example: Jing Wen"
          value={memberInput}
          onChange={(event) => setMemberInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") addMember();
          }}
        />
        <button
          onClick={addMember}
          className="rounded-xl bg-[#5B8C63] px-4 py-2 font-semibold text-white hover:bg-[#4D7C55]"
        >
          Add
        </button>
      </div>

      <div className="mt-4">
        <p className="text-sm font-medium text-gray-700">Members</p>

        <div className="mt-2 space-y-2">
          {members.length === 0 ? (
            <p className="text-sm text-gray-500">No members yet.</p>
          ) : (
            members.map((member) => (
              <div
                key={member}
                className="flex items-center justify-between rounded-lg bg-gray-100 px-3 py-2"
              >
                <div className="flex items-center gap-3">
                    <Avatar name={member} />
                    <span className="text-sm font-medium text-[#24352B]">{member}</span>
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
  );
}

export default GroupForm;