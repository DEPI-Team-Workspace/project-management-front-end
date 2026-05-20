export const WorkspaceAvatar = ({
  color,
  name,
}: {
  color?: string;
  name?: string;
}) => {
  return (
    <div
      className="w-6 h-6 rounded flex items-center justify-center"
      style={{
        backgroundColor: color || "#6366f1",
      }}
    >
      <span className="text-xs font-medium text-white">
        {name?.charAt(0)?.toUpperCase() || "W"}
      </span>
    </div>
  );
};