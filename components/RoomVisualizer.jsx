"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Box, RotateCcw } from "lucide-react";

const ROOMS = [
  {
    key: "living",
    label: "Living Room",
    width: 4.2,
    length: 3.6,
    note: "Sofa, low table and a media unit.",
  },
  {
    key: "bedroom",
    label: "Bedroom",
    width: 3.6,
    length: 3.2,
    note: "Bed, wardrobe and side table.",
  },
  {
    key: "kitchen",
    label: "Kitchen",
    width: 3.0,
    length: 2.8,
    note: "L-shaped counter and refrigerator.",
  },
  {
    key: "study",
    label: "Study",
    width: 2.6,
    length: 2.8,
    note: "Desk, chair and shelving.",
  },
];

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function furnitureFor(key, width, length) {
  const items = [];
  const margin = 0.28;

  if (key === "living") {
    items.push({
      x: margin,
      y: margin,
      w: clamp(width - 0.9, 0.8, 2.1),
      h: 0.85,
      label: "Sofa",
      tone: "gold",
    });
    items.push({
      x: margin,
      y: clamp(length - 1.35, margin + 0.9, length - margin - 0.6),
      w: clamp(width - 1.8, 0.7, 1.3),
      h: 0.65,
      label: "Table",
      tone: "stone",
    });
    items.push({
      x: clamp(width - margin - 0.6, margin, width - margin - 0.4),
      y: margin,
      w: 0.55,
      h: clamp(length - 1.2, 0.8, 1.7),
      label: "TV",
      tone: "stone",
    });
  } else if (key === "bedroom") {
    items.push({
      x: margin,
      y: clamp(length - 2.15, margin, length - margin - 1.4),
      w: clamp(width - 0.9, 0.9, 1.6),
      h: clamp(length - 1.1, 1.2, 1.85),
      label: "Bed",
      tone: "gold",
    });
    items.push({
      x: clamp(width - margin - 0.55, margin, width - margin - 0.4),
      y: margin,
      w: 0.55,
      h: clamp(length - 2.1, 0.7, 1.9),
      label: "Wardrobe",
      tone: "stone",
    });
    items.push({
      x: margin,
      y: margin,
      w: 0.45,
      h: 0.45,
      label: "",
      tone: "stone",
    });
  } else if (key === "kitchen") {
    items.push({
      x: margin,
      y: margin,
      w: clamp(width - 0.56, 0.8, width - 0.56),
      h: 0.58,
      label: "Counter",
      tone: "gold",
    });
    items.push({
      x: margin,
      y: margin,
      w: 0.58,
      h: clamp(length - 1.1, 0.8, length - 0.56),
      label: "",
      tone: "gold",
    });
    items.push({
      x: clamp(width - 0.95, margin, width - margin - 0.5),
      y: clamp(length - 1.0, margin, length - margin - 0.5),
      w: 0.6,
      h: 0.6,
      label: "Fridge",
      tone: "stone",
    });
  } else {
    items.push({
      x: margin,
      y: margin,
      w: clamp(width - 0.56, 0.8, width - 0.56),
      h: 0.6,
      label: "Desk",
      tone: "gold",
    });
    items.push({
      x: clamp(width / 2 - 0.25, margin, width - margin - 0.5),
      y: 1.05,
      w: 0.5,
      h: 0.5,
      label: "",
      tone: "stone",
    });
    items.push({
      x: clamp(width - 0.5, margin, width - margin - 0.35),
      y: clamp(length - 1.9, margin + 0.5, length - margin - 0.9),
      w: 0.35,
      h: clamp(length - 1.3, 0.7, 1.5),
      label: "Shelf",
      tone: "stone",
    });
  }

  return items;
}

// Two-dimensional, illustrative room layout tool. Dimensions are entered by
// the visitor; furniture blocks are generic examples, not a specification for
// any Sraddha Builders project.
export function RoomVisualizer() {
  const [roomKey, setRoomKey] = useState("living");
  const room = ROOMS.find((entry) => entry.key === roomKey) || ROOMS[0];
  const [width, setWidth] = useState(room.width);
  const [length, setLength] = useState(room.length);

  const furniture = useMemo(
    () => furnitureFor(roomKey, width, length),
    [roomKey, width, length]
  );

  const area = width * length;
  const squareFeet = area * 10.7639;
  const pad = 0.35;

  const requirements = `Room layout idea — ${room.label}, ${width.toFixed(
    1
  )} m × ${length.toFixed(1)} m (${area.toFixed(
    1
  )} m² / ${Math.round(
    squareFeet
  )} sq ft). This is a personal planning sketch, not a project specification.`;

  function selectRoom(key) {
    const next = ROOMS.find((entry) => entry.key === key) || ROOMS[0];
    setRoomKey(key);
    setWidth(next.width);
    setLength(next.length);
  }

  function reset() {
    setWidth(room.width);
    setLength(room.length);
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Room Visualiser</p>
          <h2 className="mt-5 font-serif text-3xl font-medium tracking-tight text-brand-ink sm:text-4xl">
            Sketch a room in two dimensions.
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-brand-secondary">
            Choose a room type and set its dimensions. Furniture blocks are
            illustrative examples only — nothing here is a project floor plan.
          </p>
        </div>
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-brand-secondary">
          <Box className="h-4 w-4 text-brand-gold" />
          2D · not to construction scale
        </div>
      </div>

      <div className="mt-8 grid gap-px overflow-hidden border border-brand-line bg-brand-line lg:grid-cols-12">
        {/* Controls */}
        <div className="bg-brand-card p-6 sm:p-8 lg:col-span-5">
          <p className="text-[10px] uppercase tracking-[0.22em] text-brand-secondary">
            Room type
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {ROOMS.map((entry) => (
              <button
                key={entry.key}
                type="button"
                onClick={() => selectRoom(entry.key)}
                aria-pressed={entry.key === roomKey}
                className={`px-3 py-2.5 text-[11px] uppercase tracking-[0.14em] transition-colors ${
                  entry.key === roomKey
                    ? "bg-brand-gold text-brand-bg"
                    : "border border-brand-line text-brand-secondary hover:border-brand-gold hover:text-brand-ink"
                }`}
              >
                {entry.label}
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs leading-relaxed text-brand-secondary">
            {room.note}
          </p>

          <div className="mt-8 space-y-6">
            <label className="block">
              <span className="flex items-baseline justify-between gap-3">
                <span className="text-[10px] uppercase tracking-[0.2em] text-brand-secondary">
                  Width
                </span>
                <span className="font-serif text-xl text-brand-ink">
                  {width.toFixed(1)} m
                </span>
              </span>
              <input
                type="range"
                min="2.0"
                max="6.0"
                step="0.1"
                value={width}
                onChange={(event) => setWidth(Number(event.target.value))}
                className="mt-2 w-full accent-[rgb(var(--brand-gold))]"
                aria-label="Room width in metres"
              />
            </label>

            <label className="block">
              <span className="flex items-baseline justify-between gap-3">
                <span className="text-[10px] uppercase tracking-[0.2em] text-brand-secondary">
                  Length
                </span>
                <span className="font-serif text-xl text-brand-ink">
                  {length.toFixed(1)} m
                </span>
              </span>
              <input
                type="range"
                min="2.0"
                max="7.0"
                step="0.1"
                value={length}
                onChange={(event) => setLength(Number(event.target.value))}
                className="mt-2 w-full accent-[rgb(var(--brand-gold))]"
                aria-label="Room length in metres"
              />
            </label>
          </div>

          <dl className="mt-8 grid grid-cols-2 gap-px border border-brand-line bg-brand-line">
            <div className="bg-brand-bg p-4">
              <dt className="text-[10px] uppercase tracking-[0.18em] text-brand-secondary">
                Area
              </dt>
              <dd className="mt-1 font-serif text-2xl text-brand-ink">
                {area.toFixed(1)} m²
              </dd>
            </div>
            <div className="bg-brand-bg p-4">
              <dt className="text-[10px] uppercase tracking-[0.18em] text-brand-secondary">
                Equivalent
              </dt>
              <dd className="mt-1 font-serif text-2xl text-brand-ink">
                {Math.round(squareFeet)} sq ft
              </dd>
            </div>
          </dl>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-brand-gold transition-colors hover:text-brand-bronze"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset dimensions
            </button>
            <Link
              href={`/contact?requirements=${encodeURIComponent(requirements)}`}
              className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-brand-ink transition-colors hover:text-brand-gold"
            >
              Send this sketch
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Plan */}
        <div className="flex items-center justify-center bg-brand-bg p-4 sm:p-8 lg:col-span-7">
          <svg
            viewBox={`0 0 ${width + pad * 2} ${length + pad * 2}`}
            className="h-auto w-full max-h-[34rem]"
            role="img"
            aria-label={`Illustrative ${room.label.toLowerCase()} plan, ${width.toFixed(
              1
            )} by ${length.toFixed(1)} metres`}
          >
            <g transform={`translate(${pad},${pad})`}>
              {/* floor */}
              <rect
                x="0"
                y="0"
                width={width}
                height={length}
                fill="rgb(var(--brand-card))"
                stroke="rgb(var(--brand-bg))"
                strokeWidth="0.05"
              />

              {/* grid every 0.5m */}
              {Array.from({ length: Math.floor(width / 0.5) }).map((_, i) => (
                <line
                  key={`v-${i}`}
                  x1={(i + 1) * 0.5}
                  y1="0"
                  x2={(i + 1) * 0.5}
                  y2={length}
                  stroke="rgb(var(--brand-line))"
                  strokeWidth="0.012"
                />
              ))}
              {Array.from({ length: Math.floor(length / 0.5) }).map((_, i) => (
                <line
                  key={`h-${i}`}
                  x1="0"
                  y1={(i + 1) * 0.5}
                  x2={width}
                  y2={(i + 1) * 0.5}
                  stroke="rgb(var(--brand-line))"
                  strokeWidth="0.012"
                />
              ))}

              {/* door swing */}
              <path
                d={`M ${Math.min(0.9, width / 3)} ${length} A ${Math.min(
                  0.9,
                  width / 3
                )} ${Math.min(0.9, width / 3)} 0 0 1 0 ${
                  length - Math.min(0.9, width / 3)
                }`}
                fill="none"
                stroke="rgb(var(--brand-gold))"
                strokeWidth="0.03"
              />
              <line
                x1="0"
                y1={length}
                x2={Math.min(0.9, width / 3)}
                y2={length}
                stroke="rgb(var(--brand-card))"
                strokeWidth="0.1"
              />

              {/* window */}
              <line
                x1={width * 0.55}
                y1="0"
                x2={width * 0.9}
                y2="0"
                stroke="rgb(var(--brand-gold))"
                strokeWidth="0.09"
              />

              {/* furniture */}
              {furniture.map((item, index) => (
                <g key={index}>
                  <rect
                    x={item.x}
                    y={item.y}
                    width={Math.max(item.w, 0.2)}
                    height={Math.max(item.h, 0.2)}
                    fill={item.tone === "gold" ? "rgb(var(--brand-gold))" : "rgb(var(--brand-secondary))"}
                    fillOpacity="0.28"
                    stroke={item.tone === "gold" ? "rgb(var(--brand-gold))" : "rgb(var(--brand-secondary))"}
                    strokeWidth="0.025"
                  />
                  {item.label ? (
                    <text
                      x={item.x + item.w / 2}
                      y={item.y + item.h / 2}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="rgb(var(--brand-ink))"
                      fontSize="0.17"
                      letterSpacing="0.02"
                    >
                      {item.label}
                    </text>
                  ) : null}
                </g>
              ))}

              {/* dimension labels */}
              <text
                x={width / 2}
                y={-0.12}
                textAnchor="middle"
                fill="rgb(var(--brand-muted))"
                fontSize="0.16"
                letterSpacing="0.04"
              >
                {width.toFixed(1)} m
              </text>
              <text
                x={-0.12}
                y={length / 2}
                textAnchor="middle"
                fill="rgb(var(--brand-muted))"
                fontSize="0.16"
                letterSpacing="0.04"
                transform={`rotate(-90 -0.12 ${length / 2})`}
              >
                {length.toFixed(1)} m
              </text>
            </g>
          </svg>
        </div>
      </div>

      <p className="mt-4 text-[11px] leading-relaxed text-brand-secondary/80">
        This visualiser is a communication aid. It is not an architectural
        drawing, does not imply any project offers a particular layout, and
        should not be used for construction or furniture purchase.
      </p>
    </div>
  );
}
