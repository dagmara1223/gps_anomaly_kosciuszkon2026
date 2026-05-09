export default function Panel({
  title,
  children
}: any) {
  return (
    <div style={{
      background: "#0f1b30",
      borderRadius: 16,
      padding: 16,
      border: "1px solid #1d3557"
    }}>
      <h2>{title}</h2>
      {children}
    </div>
  );
}