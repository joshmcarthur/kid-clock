export function ClockIcon() {
  return (
    <svg
      class="app-icon"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle
        cx="24"
        cy="24"
        r="20"
        stroke="currentColor"
        stroke-width="2.5"
        opacity="0.35"
      />
      <circle cx="24" cy="24" r="2.5" fill="currentColor" />
      <line
        x1="24"
        y1="24"
        x2="24"
        y2="12"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
      />
      <line
        x1="24"
        y1="24"
        x2="32"
        y2="28"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        opacity="0.7"
      />
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const inner = deg % 90 === 0 ? 15 : 17;
        const outer = 19;
        return (
          <line
            key={deg}
            x1={24 + inner * Math.sin(rad)}
            y1={24 - inner * Math.cos(rad)}
            x2={24 + outer * Math.sin(rad)}
            y2={24 - outer * Math.cos(rad)}
            stroke="currentColor"
            stroke-width={deg % 90 === 0 ? 2 : 1}
            stroke-linecap="round"
            opacity={deg % 90 === 0 ? 0.5 : 0.25}
          />
        );
      })}
    </svg>
  );
}
