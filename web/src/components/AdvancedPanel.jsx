import { useState } from "preact/hooks";
import { useStore } from "../hooks/useStore.js";
import { pressButton, setSwitch } from "../api.js";
import { ReadOnlyField } from "./Field.jsx";
import { ToggleSwitch } from "./ToggleSwitch.jsx";
import { isSwitchOn } from "../store.js";

const ADVANCED_STORAGE_KEY = "kid-clock-advanced";

function loadAdvancedPreference() {
  try {
    return localStorage.getItem(ADVANCED_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function saveAdvancedPreference(open) {
  try {
    localStorage.setItem(ADVANCED_STORAGE_KEY, open ? "1" : "0");
  } catch {
    /* private browsing */
  }
}

export function AdvancedPanel() {
  useStore();
  const [open, setOpen] = useState(loadAdvancedPreference);

  function toggleOpen() {
    const next = !open;
    setOpen(next);
    saveAdvancedPreference(next);
  }

  async function nextScenario() {
    try {
      await pressButton("Test Next Scenario");
    } catch (err) {
      console.warn("kid-clock:", err);
    }
  }

  return (
    <section class="card advanced-card">
      <button
        type="button"
        class={"advanced-toggle" + (open ? " advanced-toggle-active" : "")}
        onClick={toggleOpen}
        aria-expanded={open}
      >
        {open ? "Hide advanced tools" : "Show advanced tools"}
      </button>

      {open && (
        <div class="card-body advanced-body">
          <h3 class="subsection-title">Test mode</h3>
          <div class="field-row">
            <span class="field-label">Test Mode</span>
            <ToggleSwitch
              id="test-mode"
              defaultChecked={isSwitchOn("Test Mode")}
              onChange={(e) => {
                setSwitch("Test Mode", e.target.checked).catch((err) => {
                  console.warn("kid-clock:", err);
                });
              }}
            />
          </div>
          <div class="field-row">
            <span class="field-label">Test Auto Cycle</span>
            <ToggleSwitch
              id="test-auto-cycle"
              defaultChecked={isSwitchOn("Test Auto Cycle")}
              onChange={(e) => {
                setSwitch("Test Auto Cycle", e.target.checked).catch((err) => {
                  console.warn("kid-clock:", err);
                });
              }}
            />
          </div>
          <div class="field-row">
            <span class="field-label">Test Next Scenario</span>
            <button type="button" class="btn-secondary" onClick={nextScenario}>
              Next scenario
            </button>
          </div>
          <ReadOnlyField label="Test Scenario" entityName="Test Scenario" />
          <ReadOnlyField label="Active Rule" entityName="Active Rule" />

          <h3 class="subsection-title">Indicator lights</h3>
          <div class="field-row">
            <span class="field-label">Wake LED</span>
            <ToggleSwitch
              id="wake-led"
              defaultChecked={isSwitchOn("Wake LED")}
              onChange={(e) => {
                setSwitch("Wake LED", e.target.checked).catch((err) => {
                  console.warn("kid-clock:", err);
                });
              }}
            />
          </div>
          <div class="field-row">
            <span class="field-label">Sleep LED</span>
            <ToggleSwitch
              id="sleep-led"
              defaultChecked={isSwitchOn("Sleep LED")}
              onChange={(e) => {
                setSwitch("Sleep LED", e.target.checked).catch((err) => {
                  console.warn("kid-clock:", err);
                });
              }}
            />
          </div>
        </div>
      )}
    </section>
  );
}
