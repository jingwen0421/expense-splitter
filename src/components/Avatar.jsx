function Avatar({ name }) {
  const initials = name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#5B8C63] text-sm font-bold text-white">
      {initials}
    </div>
  );
}

export default Avatar;