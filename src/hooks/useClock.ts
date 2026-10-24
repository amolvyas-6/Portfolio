import { useEffect, useState } from "react";

const format = (timeZone: string) =>
  new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(new Date());

/** Ticks every second, but only while the tab is visible. */
export function useClock(timeZone: string) {
  const [time, setTime] = useState(() => format(timeZone));
  useEffect(() => {
    const tick = () => {
      if (!document.hidden) setTime(format(timeZone));
    };
    tick();
    const id = setInterval(tick, 1000);
    document.addEventListener("visibilitychange", tick);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", tick);
    };
  }, [timeZone]);
  return time;
}
