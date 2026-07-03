import { GLOBAL_FIELDS } from "../schema.js";
import { Field } from "./Field.jsx";

export function GlobalSettings() {
  return (
    <section class="card">
      <h2 class="card-title">
        Display
        <span class="card-title-strong">Global settings</span>
      </h2>
      <div class="card-body">
        {GLOBAL_FIELDS.map((field) => (
          <Field key={field.name} field={field} entityName={field.name} />
        ))}
      </div>
    </section>
  );
}
