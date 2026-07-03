export function ToggleSwitch({ id, defaultChecked, onChange }) {
  return (
    <label class="toggle-switch" for={id}>
      <input
        id={id}
        class="toggle-input"
        type="checkbox"
        defaultChecked={defaultChecked}
        onChange={onChange}
      />
      <span class="toggle-track" aria-hidden="true" />
    </label>
  );
}
