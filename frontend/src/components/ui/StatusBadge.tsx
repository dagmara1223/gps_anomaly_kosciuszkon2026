export default function StatusBadge({
  active
}: {
  active: boolean;
}) {
  return (
    <span style={{
      color: active ? "#00ff99" : "#ff4d4d"
    }}>
      ● {active ? "LIVE" : "OFFLINE"}
    </span>
  );
}