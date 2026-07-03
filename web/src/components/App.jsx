import { useEffect, useState } from "preact/hooks";
import { connectSSE, getEnabledRules, hasInitialState } from "../store.js";
import { useStore } from "../hooks/useStore.js";
import {
  applyTheme,
  cycleTheme,
  getThemePreference,
  saveThemePreference,
  themeLabel,
} from "../theme.js";
import { GlobalSettings } from "./GlobalSettings.jsx";
import { RuleToolbar } from "./RuleToolbar.jsx";
import { RuleForm } from "./RuleForm.jsx";
import { AdvancedPanel } from "./AdvancedPanel.jsx";
import { ClockIcon } from "./ClockIcon.jsx";

export function App() {
  useStore();

  const [activeRule, setActiveRule] = useState(1);
  const [rulesTick, setRulesTick] = useState(0);
  const [theme, setTheme] = useState(() => {
    const pref = getThemePreference();
    applyTheme(pref);
    return pref;
  });

  const ready = hasInitialState();
  const enabledRules = getEnabledRules();

  useEffect(() => {
    function startSSE() {
      connectSSE();
    }

    if (document.readyState === "complete") {
      startSSE();
      return;
    }

    window.addEventListener("load", startSSE, { once: true });
    return () => window.removeEventListener("load", startSSE);
  }, []);

  const enabledRulesKey = enabledRules.join(",");

  useEffect(() => {
    if (!enabledRules.includes(activeRule)) {
      setActiveRule(enabledRules[enabledRules.length - 1]);
    }
  }, [enabledRulesKey, activeRule, enabledRules]);

  function onRulesChanged() {
    setRulesTick((n) => n + 1);
  }

  function onThemeToggle() {
    const next = cycleTheme(theme);
    setTheme(next);
    saveThemePreference(next);
    applyTheme(next);
  }

  return (
    <>
      {!ready && (
        <div id="kid-clock-loader" role="status" aria-live="polite">
          Loading settings…
        </div>
      )}

      <div class="app-bg" aria-hidden="true" />

      <div class={"app" + (ready ? " app-ready" : "")}>
        <header class="app-header">
          <div class="app-brand">
            <ClockIcon />
            <div class="app-title-group">
              <h1 class="app-title">Kid Clock</h1>
              <p class="app-subtitle">Schedule &amp; display settings</p>
            </div>
          </div>
          <button
            type="button"
            class="theme-toggle"
            onClick={onThemeToggle}
            title="Cycle theme: system, light, dark"
          >
            <svg
              class="theme-toggle-icon"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              {theme === "dark" ? (
                <path
                  d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13Zm0 1.5a5 5 0 0 1 0 10V3Z"
                  fill="currentColor"
                />
              ) : (
                <circle cx="8" cy="8" r="3.5" fill="currentColor" />
              )}
            </svg>
            {themeLabel(theme)}
          </button>
        </header>

        <main class="app-main">
          <GlobalSettings />
          <RuleToolbar
            key={rulesTick}
            enabledRules={enabledRules}
            activeRule={activeRule}
            onSelectRule={setActiveRule}
            onRulesChanged={onRulesChanged}
          />
          <RuleForm key={activeRule} ruleNum={activeRule} />
          <AdvancedPanel />
        </main>
      </div>
    </>
  );
}
