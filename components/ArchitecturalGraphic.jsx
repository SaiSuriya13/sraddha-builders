// Reusable abstract architectural line graphics.
// These are deliberately schematic — never photographic — so they never
// misrepresent any real Sraddha Builders project. Real photographs can be
// swapped in later by replacing this component's SVG with an <Image/>.

const TONES = {
  gold: "rgb(var(--brand-gold))",
  bronze: "rgb(var(--brand-bronze))",
  stone: "rgb(var(--brand-secondary))",
};

export const GRAPHIC_VARIANTS = [
  "tower",
  "skyline",
  "plan",
  "elevation",
  "arcade",
  "section",
  "courtyard",
];

export default function ArchitecturalGraphic({
  variant = "tower",
  className = "",
  tone = "gold",
}) {
  const accent = TONES[tone] || TONES.gold;
  const stroke = "rgb(var(--brand-secondary))";

  const common = {
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    className,
    role: "presentation",
    "aria-hidden": "true",
    focusable: "false",
  };

  if (variant === "tower") {
    return (
      <svg viewBox="0 0 640 760" {...common}>
        <rect x="120" y="140" width="400" height="520" stroke={accent} strokeWidth="2" />
        {[170, 280, 390, 500].map((y) =>
          [140, 220, 300, 380].map((x) => (
            <rect
              key={`${x}-${y}`}
              x={x}
              y={y}
              width="70"
              height="90"
              stroke={stroke}
              strokeWidth="1"
            />
          ))
        )}
        <line x1="80" y1="140" x2="560" y2="140" stroke={accent} strokeWidth="2" />
        <line x1="290" y1="60" x2="350" y2="60" stroke={accent} strokeWidth="2" />
        <line x1="320" y1="60" x2="320" y2="140" stroke={accent} strokeWidth="1" />
        <line x1="60" y1="680" x2="580" y2="680" stroke={accent} strokeWidth="2" />
        <line x1="120" y1="660" x2="520" y2="660" stroke={stroke} strokeWidth="1" />
        <line x1="30" y1="140" x2="30" y2="660" stroke={stroke} strokeWidth="1" />
        <line x1="20" y1="140" x2="40" y2="140" stroke={stroke} strokeWidth="1" />
        <line x1="20" y1="660" x2="40" y2="660" stroke={stroke} strokeWidth="1" />
      </svg>
    );
  }

  if (variant === "skyline") {
    return (
      <svg viewBox="0 0 640 400" {...common}>
        <rect x="20" y="120" width="80" height="220" stroke={stroke} strokeWidth="1.5" />
        <rect x="40" y="150" width="30" height="30" stroke={stroke} strokeWidth="1" />
        <rect x="90" y="40" width="120" height="300" stroke={accent} strokeWidth="2" />
        {[70, 130, 190].map((y) => (
          <g key={y}>
            <rect x="110" y={y} width="30" height="36" stroke={stroke} strokeWidth="1" />
            <rect x="150" y={y} width="30" height="36" stroke={stroke} strokeWidth="1" />
          </g>
        ))}
        <rect x="260" y="170" width="90" height="170" stroke={stroke} strokeWidth="1.5" />
        <rect x="280" y="200" width="30" height="30" stroke={stroke} strokeWidth="1" />
        <rect x="280" y="250" width="30" height="30" stroke={stroke} strokeWidth="1" />
        <rect x="390" y="90" width="70" height="250" stroke={accent} strokeWidth="2" />
        <rect x="405" y="120" width="25" height="30" stroke={stroke} strokeWidth="1" />
        <rect x="405" y="170" width="25" height="30" stroke={stroke} strokeWidth="1" />
        <rect x="500" y="140" width="120" height="200" stroke={stroke} strokeWidth="1.5" />
        <rect x="520" y="170" width="30" height="30" stroke={stroke} strokeWidth="1" />
        <rect x="570" y="170" width="30" height="30" stroke={stroke} strokeWidth="1" />
        <line x1="10" y1="350" x2="630" y2="350" stroke={accent} strokeWidth="2" />
      </svg>
    );
  }

  if (variant === "elevation") {
    return (
      <svg viewBox="0 0 640 640" {...common}>
        {/* facade outline */}
        <path d="M120 560V160H520V560" stroke={accent} strokeWidth="2" />
        <line x1="90" y1="160" x2="550" y2="160" stroke={accent} strokeWidth="2" />
        <line x1="100" y1="120" x2="540" y2="120" stroke={stroke} strokeWidth="1" />
        <line x1="320" y1="72" x2="320" y2="120" stroke={accent} strokeWidth="1" />
        {/* upper windows */}
        {[200, 300, 400].map((x) => (
          <g key={x}>
            <rect x={x} y="200" width="60" height="82" stroke={stroke} strokeWidth="1" />
            <line x1={x + 30} y1="200" x2={x + 30} y2="282" stroke={stroke} strokeWidth="0.8" />
            <line x1={x} y1="241" x2={x + 60} y2="241" stroke={stroke} strokeWidth="0.8" />
          </g>
        ))}
        {/* string course */}
        <line x1="120" y1="320" x2="520" y2="320" stroke={stroke} strokeWidth="1" />
        {/* arcade */}
        {[160, 250, 340, 430].map((x) => (
          <path
            key={x}
            d={`M${x} 560V452a35 35 0 0 1 70 0v108`}
            stroke={accent}
            strokeWidth="1.4"
          />
        ))}
        <line x1="150" y1="440" x2="490" y2="440" stroke={stroke} strokeWidth="1" />
        {/* steps + ground */}
        <path d="M104 560H536M120 580H520M136 600H504" stroke={stroke} strokeWidth="1" />
        {/* dimension line */}
        <line x1="70" y1="160" x2="70" y2="560" stroke={stroke} strokeWidth="1" />
        <path d="M62 160H78M62 560H78" stroke={stroke} strokeWidth="1" />
        <line x1="560" y1="72" x2="610" y2="72" stroke={stroke} strokeWidth="0.8" />
        <line x1="560" y1="72" x2="560" y2="120" stroke={stroke} strokeWidth="0.8" />
      </svg>
    );
  }

  if (variant === "arcade") {
    return (
      <svg viewBox="0 0 640 640" {...common}>
        <line x1="72" y1="130" x2="568" y2="130" stroke={accent} strokeWidth="2" />
        <line x1="72" y1="156" x2="568" y2="156" stroke={stroke} strokeWidth="1" />
        {[96, 190, 284, 378, 472].map((x) => (
          <g key={x}>
            <path
              d={`M${x} 540V300a42 42 0 0 1 84 0v240`}
              stroke={accent}
              strokeWidth="1.6"
            />
            <path
              d={`M${x + 14} 540V306a28 28 0 0 1 56 0v234`}
              stroke={stroke}
              strokeWidth="0.9"
            />
            <line x1={x} y1="540" x2={x + 84} y2="540" stroke={stroke} strokeWidth="1" />
          </g>
        ))}
        <line x1="56" y1="540" x2="584" y2="540" stroke={accent} strokeWidth="2" />
        <line x1="56" y1="566" x2="584" y2="566" stroke={stroke} strokeWidth="1" />
        <line x1="56" y1="592" x2="584" y2="592" stroke={stroke} strokeWidth="1" />
        <line x1="320" y1="82" x2="320" y2="130" stroke={stroke} strokeWidth="1" />
        <line x1="300" y1="82" x2="340" y2="82" stroke={accent} strokeWidth="1.4" />
      </svg>
    );
  }

  if (variant === "section") {
    return (
      <svg viewBox="0 0 640 640" {...common}>
        {/* outer envelope */}
        <path d="M120 560V120H520V560" stroke={accent} strokeWidth="2" />
        <line x1="120" y1="120" x2="520" y2="120" stroke={accent} strokeWidth="2" />
        {/* floor slabs */}
        {[180, 280, 380, 480].map((y) => (
          <line key={y} x1="120" y1={y} x2="520" y2={y} stroke={stroke} strokeWidth="1.2" />
        ))}
        {/* rooms */}
        <line x1="320" y1="180" x2="320" y2="560" stroke={stroke} strokeWidth="1" />
        <line x1="320" y1="280" x2="520" y2="280" stroke={stroke} strokeWidth="0.8" strokeDasharray="6 5" />
        {/* stair core */}
        <path
          d="M150 480h60v-40h60v-40h60v-40h60"
          stroke={accent}
          strokeWidth="1.6"
        />
        <line x1="150" y1="480" x2="150" y2="560" stroke={stroke} strokeWidth="1" />
        <line x1="390" y1="360" x2="390" y2="560" stroke={stroke} strokeWidth="1" />
        {/* roof detail */}
        <path d="M320 120V88H470" stroke={stroke} strokeWidth="1" />
        <circle cx="470" cy="88" r="6" stroke={accent} strokeWidth="1.4" />
        {/* ground + hatch */}
        <line x1="88" y1="560" x2="552" y2="560" stroke={accent} strokeWidth="2" />
        {[110, 150, 190, 230].map((x) => (
          <line key={x} x1={x} y1="560" x2={x + 18} y2="584" stroke={stroke} strokeWidth="0.8" />
        ))}
        <line x1="70" y1="120" x2="70" y2="560" stroke={stroke} strokeWidth="1" />
        <path d="M62 120H78M62 560H78" stroke={stroke} strokeWidth="1" />
      </svg>
    );
  }

  if (variant === "courtyard") {
    return (
      <svg viewBox="0 0 640 640" {...common}>
        <rect x="76" y="76" width="488" height="488" stroke={accent} strokeWidth="2" />
        <rect x="196" y="196" width="248" height="248" stroke={accent} strokeWidth="1.6" />
        {/* surrounding rooms */}
        <line x1="76" y1="196" x2="196" y2="196" stroke={stroke} strokeWidth="1" />
        <line x1="444" y1="196" x2="564" y2="196" stroke={stroke} strokeWidth="1" />
        <line x1="76" y1="444" x2="196" y2="444" stroke={stroke} strokeWidth="1" />
        <line x1="444" y1="444" x2="564" y2="444" stroke={stroke} strokeWidth="1" />
        <line x1="196" y1="76" x2="196" y2="196" stroke={stroke} strokeWidth="1" />
        <line x1="444" y1="76" x2="444" y2="196" stroke={stroke} strokeWidth="1" />
        <line x1="196" y1="444" x2="196" y2="564" stroke={stroke} strokeWidth="1" />
        <line x1="444" y1="444" x2="444" y2="564" stroke={stroke} strokeWidth="1" />
        {/* courtyard tree + paving */}
        <circle cx="320" cy="320" r="52" stroke={stroke} strokeWidth="1" />
        <path d="M320 268v104M268 320h104" stroke={stroke} strokeWidth="0.8" />
        <circle cx="320" cy="320" r="8" stroke={accent} strokeWidth="1.4" />
        {[236, 292, 348, 404].map((x) => (
          <line key={x} x1={x} y1="196" x2={x} y2="206" stroke={stroke} strokeWidth="0.8" />
        ))}
        {/* entry + dimension marks */}
        <path d="M296 76V60H344V76" stroke={accent} strokeWidth="1.4" />
        <line x1="320" y1="564" x2="320" y2="600" stroke={stroke} strokeWidth="1" />
        <line x1="300" y1="600" x2="340" y2="600" stroke={stroke} strokeWidth="1" />
      </svg>
    );
  }

  // plan / blueprint variant
  return (
    <svg viewBox="0 0 640 640" {...common}>
      <rect x="90" y="90" width="460" height="460" stroke={accent} strokeWidth="2" />
      <rect x="150" y="150" width="120" height="120" stroke={stroke} strokeWidth="1" />
      <rect x="340" y="150" width="140" height="120" stroke={stroke} strokeWidth="1" />
      <rect x="150" y="340" width="120" height="140" stroke={stroke} strokeWidth="1" />
      <rect x="340" y="340" width="140" height="140" stroke={stroke} strokeWidth="1" />
      <circle cx="210" cy="210" r="30" stroke={stroke} strokeWidth="1" />
      <circle cx="410" cy="210" r="30" stroke={stroke} strokeWidth="1" />
      <circle cx="210" cy="410" r="30" stroke={stroke} strokeWidth="1" />
      <circle cx="410" cy="410" r="30" stroke={stroke} strokeWidth="1" />
      <circle cx="120" cy="410" r="10" stroke={accent} strokeWidth="1.5" />
      <line x1="540" y1="320" x2="540" y2="64" stroke={stroke} strokeWidth="1" />
      <text
        x="548"
        y="200"
        fill={stroke}
        fontSize="14"
        fontFamily="sans-serif"
        transform="rotate(-90 555 300)"
        letterSpacing="6"
      >
        PLAN
      </text>
    </svg>
  );
}
