import Panel from "../components/ui/Panel";

export default function InfoSection() {
  return (
    <Panel title="Dataset Info">
      <p>Samples: 510,530</p>
      <p>Classes: OK / Spoof1 / Spoof2 / Spoof3</p>
      <p>Signals: CN0, DO, PD</p>
    </Panel>
  );
}