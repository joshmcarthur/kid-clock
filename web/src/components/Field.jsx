import { useRef } from "preact/hooks";
import { setNumber, setText } from "../api.js";
import {
  addPending,
  clearPending,
  getEntityValue,
  getNumberValue,
  getTextValue,
  setOptimisticNumber,
  setOptimisticText,
} from "../store.js";
import { useStore } from "../hooks/useStore.js";
import { ToggleSwitch } from "./ToggleSwitch.jsx";

function parseDefault(field, entityName) {
  if (field.type === "text") {
    return getTextValue(entityName, "");
  }
  if (field.type === "toggle") {
    return getNumberValue(entityName, 0) > 0;
  }
  if (field.type === "select") {
    return getNumberValue(entityName, field.options?.[0]?.value ?? 0);
  }
  return getNumberValue(entityName, field.min ?? 0);
}

async function commitField(field, entityName, rawValue) {
  if (field.domain === "text") {
    setOptimisticText(entityName, String(rawValue));
  } else if (field.type === "toggle") {
    setOptimisticNumber(entityName, rawValue ? 1 : 0);
  } else {
    setOptimisticNumber(entityName, rawValue);
  }

  addPending(entityName);
  try {
    if (field.domain === "text") {
      await setText(entityName, String(rawValue));
    } else if (field.type === "toggle") {
      await setNumber(entityName, rawValue ? 1 : 0);
    } else {
      await setNumber(entityName, rawValue);
    }
  } finally {
    clearPending(entityName);
  }
}

export function Field({ field, entityName, label }) {
  const debounceRef = useRef(null);
  const displayLabel = label || field.name || entityName;
  const defaultValue = parseDefault(field, entityName);

  function onTextInput(e) {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      commitField(field, entityName, e.target.value).catch((err) => {
        console.warn("kid-clock:", err);
      });
    }, 400);
  }

  function onTextBlur(e) {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
    commitField(field, entityName, e.target.value).catch((err) => {
      console.warn("kid-clock:", err);
    });
  }

  if (field.type === "text") {
    return (
      <div class="field-row">
        <label class="field-label" for={entityName}>
          {displayLabel}
        </label>
        <input
          id={entityName}
          class="field-input"
          type="text"
          defaultValue={defaultValue}
          maxLength={field.maxLength}
          onInput={onTextInput}
          onBlur={onTextBlur}
        />
      </div>
    );
  }

  if (field.type === "toggle") {
    return (
      <div class="field-row">
        <span class="field-label" id={`${entityName}-label`}>
          {displayLabel}
        </span>
        <ToggleSwitch
          id={entityName}
          defaultChecked={defaultValue}
          onChange={(e) => {
            commitField(field, entityName, e.target.checked).catch((err) => {
              console.warn("kid-clock:", err);
            });
          }}
        />
      </div>
    );
  }

  if (field.type === "select") {
    return (
      <div class="field-row">
        <label class="field-label" for={entityName}>
          {displayLabel}
        </label>
        <select
          id={entityName}
          class="field-select"
          defaultValue={String(defaultValue)}
          onChange={(e) => {
            commitField(field, entityName, parseInt(e.target.value, 10)).catch(
              (err) => {
                console.warn("kid-clock:", err);
              }
            );
          }}
        >
          {field.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (field.type === "slider") {
    return (
      <div class="field-row">
        <label class="field-label" for={entityName}>
          {displayLabel}
          {field.unit ? ` (${field.unit})` : ""}
        </label>
        <div class="field-slider-wrap">
          <input
            id={entityName}
            class="field-slider"
            type="range"
            min={field.min}
            max={field.max}
            step={field.step}
            defaultValue={defaultValue}
            onInput={(e) => {
              const span = e.target.parentElement?.querySelector(
                ".field-slider-value"
              );
              if (span) {
                span.textContent = `${e.target.value}${field.unit ? ` ${field.unit}` : ""}`;
              }
            }}
            onChange={(e) => {
              commitField(field, entityName, parseFloat(e.target.value)).catch(
                (err) => {
                  console.warn("kid-clock:", err);
                }
              );
            }}
          />
          <span class="field-slider-value" data-for={entityName}>
            {defaultValue}
            {field.unit ? ` ${field.unit}` : ""}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div class="field-row">
      <label class="field-label" for={entityName}>
        {displayLabel}
      </label>
      <input
        id={entityName}
        class="field-input field-input-number"
        type="number"
        min={field.min}
        max={field.max}
        step={field.step}
        defaultValue={defaultValue}
        onBlur={(e) => {
          commitField(field, entityName, parseFloat(e.target.value)).catch(
            (err) => {
              console.warn("kid-clock:", err);
            }
          );
        }}
      />
    </div>
  );
}

export function ReadOnlyField({ label, entityName }) {
  useStore();
  const value = getEntityValue(entityName, "—");
  return (
    <div class="field-row field-row-readonly">
      <span class="field-label">{label}</span>
      <span class="field-readonly-value">{value}</span>
    </div>
  );
}
