export async function setNumber(name, value) {
  const url = `/number/${encodeURIComponent(name)}/set?value=${encodeURIComponent(value)}`;
  const res = await fetch(url, { method: "POST" });
  if (!res.ok) throw new Error(`Failed to set ${name}: ${res.status}`);
  return res;
}

export async function setText(name, value) {
  const url = `/text/${encodeURIComponent(name)}/set?value=${encodeURIComponent(value)}`;
  const res = await fetch(url, { method: "POST" });
  if (!res.ok) throw new Error(`Failed to set ${name}: ${res.status}`);
  return res;
}

export async function setSwitch(name, on) {
  const action = on ? "turn_on" : "turn_off";
  const url = `/switch/${encodeURIComponent(name)}/${action}`;
  const res = await fetch(url, { method: "POST" });
  if (!res.ok) throw new Error(`Failed to set ${name}: ${res.status}`);
  return res;
}

export async function pressButton(name) {
  const url = `/button/${encodeURIComponent(name)}/press`;
  const res = await fetch(url, { method: "POST" });
  if (!res.ok) throw new Error(`Failed to press ${name}: ${res.status}`);
  return res;
}
