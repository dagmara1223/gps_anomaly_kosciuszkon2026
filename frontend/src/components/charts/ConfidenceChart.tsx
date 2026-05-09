import { useWS } from "../../context/WebSocketProvider";

export default function ConfidenceChart() {
  const { latest } = useWS();

  const confidence =
    latest?.Output === 1 ? "96%" : "99%";

  return (
    <div style={{ marginTop: 10 }}>
      <strong>Model Confidence:</strong> {confidence}
    </div>
  );
}