import Panel from "../components/ui/Panel";
import AttackSliders from "../components/controls/AttackSliders";
import StartButton from "../components/controls/StartButton";

export default function SandboxSection() {
  return (
    <Panel title="Attack Sandbox">
      <AttackSliders />
      <StartButton />
    </Panel>
  );
}