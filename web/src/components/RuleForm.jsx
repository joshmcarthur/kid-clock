import { RULE_FIELDS, RULE_TIME_FIELDS, ruleEntityName } from "../schema.js";
import { Field } from "./Field.jsx";
import { TimeField } from "./TimeField.jsx";

export function RuleForm({ ruleNum }) {
  return (
    <section class="card">
      <h2 class="card-title">
        Schedule
        <span class="card-title-strong">Rule {ruleNum}</span>
      </h2>
      <div class="card-body">
        {RULE_TIME_FIELDS.map((timeField) => (
          <TimeField
            key={`${ruleNum}-${timeField.inputKey}`}
            ruleNum={ruleNum}
            suffix={timeField.suffix}
            label={timeField.label}
            inputKey={timeField.inputKey}
          />
        ))}
        {RULE_FIELDS.map((field) => {
          const entityName = ruleEntityName(ruleNum, field.suffix);
          return (
            <Field
              key={entityName}
              field={field}
              entityName={entityName}
              label={field.suffix}
            />
          );
        })}
      </div>
    </section>
  );
}
