import { MAX_RULES } from "../schema.js";
import { setNumber } from "../api.js";
import { setOptimisticRuleEnabled } from "../store.js";

export function RuleToolbar({
  enabledRules,
  activeRule,
  onSelectRule,
  onRulesChanged,
}) {
  async function addNextRule() {
    for (let n = 1; n <= MAX_RULES; n++) {
      if (!enabledRules.includes(n)) {
        try {
          await setNumber(`Rule ${n} Enabled`, 1);
          setOptimisticRuleEnabled(n, true);
          onSelectRule(n);
          onRulesChanged();
        } catch (err) {
          console.warn("kid-clock:", err);
        }
        return;
      }
    }
  }

  async function removeActiveRule() {
    if (activeRule <= 2 || enabledRules.length <= 1) return;
    try {
      await setNumber(`Rule ${activeRule} Enabled`, 0);
      setOptimisticRuleEnabled(activeRule, false);
      const remaining = enabledRules.filter((n) => n !== activeRule);
      onSelectRule(remaining[remaining.length - 1]);
      onRulesChanged();
    } catch (err) {
      console.warn("kid-clock:", err);
    }
  }

  const canAdd = enabledRules.length < MAX_RULES;
  const canRemove = enabledRules.length > 1 && activeRule > 2;

  return (
    <section class="card rule-toolbar-card">
      <div class="rule-toolbar">
        <span class="rule-toolbar-label">Schedule rules</span>
        <div class="rule-tabs">
          {enabledRules.map((ruleNum) => (
            <button
              key={ruleNum}
              type="button"
              class={
                "rule-tab" + (ruleNum === activeRule ? " rule-tab-active" : "")
              }
              onClick={() => onSelectRule(ruleNum)}
            >
              Rule {ruleNum}
            </button>
          ))}
        </div>
        <div class="rule-actions">
          {canAdd && (
            <button type="button" class="rule-add" onClick={addNextRule}>
              + Add rule
            </button>
          )}
          {canRemove && (
            <button type="button" class="rule-remove" onClick={removeActiveRule}>
              Remove rule
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
