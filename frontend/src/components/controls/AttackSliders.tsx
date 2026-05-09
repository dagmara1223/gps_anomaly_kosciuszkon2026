export default function AttackSliders() {
  return (
    <div>
      <label>CN0 Scale</label>
      <input type="range" min="0" max="2" step="0.1" />

      <label>Noise</label>
      <input type="range" min="0" max="1" step="0.1" />

      <label>Doppler Shift</label>
      <input type="range" min="-50" max="50" />
    </div>
  );
}