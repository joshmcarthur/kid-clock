import { useEffect, useState } from "preact/hooks";
import { subscribe } from "../store.js";

export function useStore() {
  const [, setTick] = useState(0);

  useEffect(() => {
    return subscribe(() => setTick((n) => n + 1));
  }, []);

  return null;
}
