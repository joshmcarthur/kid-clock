import { useRef } from "preact/hooks";
import { setNumber } from "../api.js";
import { getNumberValue } from "../store.js";
import {
  minuteOfDayToParts,
  partsToMinuteOfDay,
  ruleEntityName,
} from "../schema.js";

function formatTimeValue(minuteOfDay) {
  const { hour, minute } = minuteOfDayToParts(minuteOfDay);
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

export function TimeField({ ruleNum, suffix, label, inputKey }) {
  const entityName = ruleEntityName(ruleNum, suffix);
  const inputId = `rule-${ruleNum}-time-${inputKey}`;
  const defaultValue = formatTimeValue(getNumberValue(entityName, 0));
  const pendingRef = useRef(false);

  async function commitTime(value) {
    if (!value || pendingRef.current) return;
    const parts = value.split(":");
    if (parts.length !== 2) return;

    const hour = parseInt(parts[0], 10);
    const minute = parseInt(parts[1], 10);
    if (!Number.isFinite(hour) || !Number.isFinite(minute)) return;

    pendingRef.current = true;
    try {
      await setNumber(entityName, partsToMinuteOfDay(hour, minute));
    } catch (err) {
      console.warn("kid-clock:", err);
    } finally {
      pendingRef.current = false;
    }
  }

  return (
    <div class="field-row">
      <label class="field-label" for={inputId}>
        {label}
      </label>
      <input
        id={inputId}
        class="field-input field-input-time"
        type="time"
        defaultValue={defaultValue}
        onChange={(e) => {
          commitTime(e.target.value);
        }}
      />
    </div>
  );
}
