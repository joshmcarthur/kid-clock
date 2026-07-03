import { MAX_RULES, ruleEnabledKeys, ruleEnabledName } from "./schema.js";

const listeners = new Set();

export const entityStates = {};
export const pendingEntities = new Set();
export let focusedEntity = null;
export let connected = false;
export let initialStateReceived = false;

let source = null;
let bootstrapTimer = null;
const BOOTSTRAP_QUIET_MS = 200;

function scheduleBootstrapComplete() {
  if (initialStateReceived) return;
  if (bootstrapTimer) clearTimeout(bootstrapTimer);
  bootstrapTimer = setTimeout(() => {
    bootstrapTimer = null;
    if (!initialStateReceived) {
      initialStateReceived = true;
      notify();
    }
  }, BOOTSTRAP_QUIET_MS);
}

function notify() {
  for (const fn of listeners) {
    fn();
  }
}

export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function setFocusedEntity(name) {
  focusedEntity = name;
}

export function clearFocusedEntity(name) {
  if (focusedEntity === name) focusedEntity = null;
}

export function addPending(name) {
  pendingEntities.add(name);
}

export function clearPending(name) {
  pendingEntities.delete(name);
  notify();
}

function ingestEntity(entity) {
  if (!entity || typeof entity !== "object") return;

  const id = entity.id || entity.object_id || "";
  if (id) entityStates[id] = entity;
  if (entity.name_id) entityStates[entity.name_id] = entity;
  if (entity.name) entityStates[entity.name] = entity;
  if (entity.unique_id) entityStates[entity.unique_id] = entity;

  const nameId = entity.name_id || "";
  if (nameId.includes("/")) {
    const derivedName = nameId.slice(nameId.indexOf("/") + 1);
    entityStates[derivedName] = entity;
    if (!entity.name) entity.name = derivedName;
  }

  const name = entity.name || "";
  const enabledMatch = /^Rule (\d+) Enabled$/.exec(name);
  if (enabledMatch) {
    const ruleNum = parseInt(enabledMatch[1], 10);
    for (const key of ruleEnabledKeys(ruleNum)) {
      entityStates[key] = entity;
    }
  }
}

export function getEntity(name) {
  return entityStates[name] || null;
}

export function isEntityLoaded(name) {
  return getEntity(name) !== null;
}

export function getEntityValue(name, fallback = "") {
  const ent = getEntity(name);
  if (!ent) return fallback;
  if (ent.value !== undefined && ent.value !== null) return ent.value;
  if (ent.state !== undefined && ent.state !== null) return ent.state;
  return fallback;
}

export function getNumberValue(name, fallback = 0) {
  const raw = getEntityValue(name, fallback);
  const num = parseFloat(String(raw).replace(/[^\d.-]/g, ""));
  return Number.isFinite(num) ? num : fallback;
}

export function getTextValue(name, fallback = "") {
  return String(getEntityValue(name, fallback));
}

export function isSwitchOn(name) {
  const ent = getEntity(name);
  if (!ent) return false;
  if (typeof ent.value === "boolean") return ent.value;
  const state = String(ent.state ?? ent.value ?? "").toUpperCase();
  return state === "ON" || state === "TRUE" || state === "1";
}

function hasRuleEnabledState(ruleNum) {
  for (const key of ruleEnabledKeys(ruleNum)) {
    if (entityStates[key]) return true;
  }
  return false;
}

export function isRuleEnabled(ruleNum) {
  for (const key of ruleEnabledKeys(ruleNum)) {
    const ent = entityStates[key];
    if (ent) return getNumberValue(key, 0) > 0;
  }
  if (ruleNum <= 2 && !hasRuleEnabledState(ruleNum)) return true;
  return false;
}

export function getEnabledRules() {
  const enabled = [];
  for (let n = 1; n <= MAX_RULES; n++) {
    if (isRuleEnabled(n)) enabled.push(n);
  }
  return enabled.length > 0 ? enabled : [1];
}

export function setOptimisticNumber(name, value) {
  const optimistic = {
    name,
    name_id: `number/${name}`,
    value,
    state: String(value),
  };
  entityStates[name] = optimistic;
  entityStates[`number/${name}`] = optimistic;
}

export function setOptimisticText(name, value) {
  const optimistic = {
    name,
    name_id: `text/${name}`,
    value,
    state: String(value),
  };
  entityStates[name] = optimistic;
  entityStates[`text/${name}`] = optimistic;
}
export function setOptimisticRuleEnabled(ruleNum, enabled) {
  const name = ruleEnabledName(ruleNum);
  const value = enabled ? 1 : 0;
  const optimistic = {
    name,
    name_id: `number/${name}`,
    id: `number-rule_${ruleNum}_enabled`,
    value,
    state: String(value),
  };
  for (const key of ruleEnabledKeys(ruleNum)) {
    entityStates[key] = optimistic;
  }
  notify();
}

export function connectSSE() {
  if (source) return;

  source = new EventSource("/events");

  source.addEventListener("open", () => {
    connected = true;
    notify();
  });

  source.addEventListener("error", () => {
    connected = false;
    notify();
  });

  source.addEventListener("state", (e) => {
    try {
      const data = JSON.parse(e.data);
      ingestEntity(data);
      notify();
      scheduleBootstrapComplete();
    } catch {
      /* ignore malformed */
    }
  });
}

export function hasInitialState() {
  return initialStateReceived;
}
