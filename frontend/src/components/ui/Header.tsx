import StatusBadge from "./StatusBadge";

export default function Header() {
  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      marginBottom: 20
    }}>
      <h1>GNSS Spoofing Detection Dashboard</h1>
      <StatusBadge active={true} />
    </div>
  );
}