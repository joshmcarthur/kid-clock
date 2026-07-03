const THEME_STORAGE_KEY = "kid-clock-theme";

export function getThemePreference() {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    /* ignore */
  }
  return "system";
}

export function saveThemePreference(mode) {
  try {
    if (mode === "system") {
      localStorage.removeItem(THEME_STORAGE_KEY);
    } else {
      localStorage.setItem(THEME_STORAGE_KEY, mode);
    }
  } catch {
    /* ignore */
  }
}

export function applyTheme(mode) {
  const root = document.documentElement;
  if (mode === "system") {
    root.removeAttribute("data-theme");
  } else {
    root.setAttribute("data-theme", mode);
  }
}

export function cycleTheme(current) {
  if (current === "system") return "light";
  if (current === "light") return "dark";
  return "system";
}

export function themeLabel(mode) {
  if (mode === "light") return "Light";
  if (mode === "dark") return "Dark";
  return "System";
}
