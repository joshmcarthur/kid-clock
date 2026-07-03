export const MAX_RULES = 10;
export const RULE_MESSAGE_MAX_LENGTH = 64;
export const MINUTE_OF_DAY_MAX = 1439;

export const RULE_TIME_FIELDS = [
  {
    suffix: "Start Minute Of Day",
    label: "Starts",
    inputKey: "start",
  },
  {
    suffix: "End Minute Of Day",
    label: "Ends",
    inputKey: "end",
  },
];

export const RULE_FIELDS = [
  { suffix: "Priority", domain: "number", type: "number", min: 1, max: 99, step: 1 },
  {
    suffix: "Display Mode",
    domain: "number",
    type: "select",
    options: [
      { value: 0, label: "Message" },
      { value: 1, label: "Greeting" },
      { value: 2, label: "Alternate" },
    ],
  },
  { suffix: "Green LED", domain: "number", type: "toggle" },
  { suffix: "Red LED", domain: "number", type: "toggle" },
  { suffix: "Message", domain: "text", type: "text", maxLength: RULE_MESSAGE_MAX_LENGTH },
];

export const GLOBAL_FIELDS = [
  { name: "Child Name", domain: "text", type: "text", maxLength: 8 },
  { name: "Greeting Prefix", domain: "text", type: "text", maxLength: 8 },
  {
    name: "Alternate Seconds",
    domain: "number",
    type: "slider",
    min: 2,
    max: 60,
    step: 1,
    unit: "s",
  },
];

export function minuteOfDayToParts(minuteOfDay) {
  const clamped = Math.max(0, Math.min(MINUTE_OF_DAY_MAX, Math.floor(minuteOfDay)));
  return {
    hour: Math.floor(clamped / 60),
    minute: clamped % 60,
  };
}

export function partsToMinuteOfDay(hour, minute) {
  const h = Math.max(0, Math.min(23, Math.floor(hour)));
  const m = Math.max(0, Math.min(59, Math.floor(minute)));
  return h * 60 + m;
}

export function ruleEntityName(ruleNum, suffix) {
  return `Rule ${ruleNum} ${suffix}`;
}

export function ruleEnabledName(ruleNum) {
  return `Rule ${ruleNum} Enabled`;
}

export function ruleEnabledKeys(ruleNum) {
  const name = ruleEnabledName(ruleNum);
  return [name, `number/${name}`, `number-rule_${ruleNum}_enabled`];
}
