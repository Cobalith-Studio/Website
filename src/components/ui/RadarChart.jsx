import { useEffect, useMemo, useRef, useState } from "react";

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

function normalizeItems(items) {
  return items.map((item) => ({
    ...item,
    value: clamp(item.value <= 1 ? item.value * 100 : item.value, 0, 100)
  }));
}

export default function RadarChart({ title, items, accentClass = "" }) {
  const size = 240;
  const center = size / 2;
  const radius = 74;
  const levels = 4;
  const animationRef = useRef(null);
  const normalizedItems = useMemo(() => normalizeItems(items), [items]);
  const [displayItems, setDisplayItems] = useState(normalizedItems);
  const angleStep = (Math.PI * 2) / items.length;

  useEffect(() => {
    const fromItems = displayItems.length === normalizedItems.length
      ? displayItems
      : normalizedItems.map((item, index) => ({
          ...item,
          value: displayItems[index]?.value ?? item.value
        }));
    const start = performance.now();
    const duration = 260;

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    const step = (timestamp) => {
      const progress = clamp((timestamp - start) / duration, 0, 1);
      const eased = 1 - (1 - progress) * (1 - progress);
      const nextItems = normalizedItems.map((item, index) => {
        const initialValue = fromItems[index]?.value ?? item.value;
        return {
          ...item,
          value: initialValue + (item.value - initialValue) * eased
        };
      });

      setDisplayItems(nextItems);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(step);
      }
    };

    animationRef.current = requestAnimationFrame(step);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [normalizedItems]);

  const points = displayItems.map((item, index) => {
    const angle = -Math.PI / 2 + angleStep * index;
    const distance = radius * item.value / 100;
    return {
      ...item,
      x: center + Math.cos(angle) * distance,
      y: center + Math.sin(angle) * distance,
      labelX: center + Math.cos(angle) * (radius + 26),
      labelY: center + Math.sin(angle) * (radius + 26)
    };
  });

  const polygon = points.map((point) => `${point.x},${point.y}`).join(" ");
  const closedPolygon = points.length ? `${polygon} ${points[0].x},${points[0].y}` : polygon;

  return (
    <div className={`radar-card ${accentClass}`}>
      {title ? <h3>{title}</h3> : null}
      <svg viewBox={`0 0 ${size} ${size}`} className="radar-chart" aria-hidden="true">
        {Array.from({ length: levels }, (_, index) => {
          const ratio = (index + 1) / levels;
          const ring = items.map((_, itemIndex) => {
            const angle = -Math.PI / 2 + angleStep * itemIndex;
            return `${center + Math.cos(angle) * radius * ratio},${center + Math.sin(angle) * radius * ratio}`;
          });
          return <polygon key={ratio} points={ring.join(" ")} className="radar-ring" />;
        })}

        {items.map((_, index) => {
          const angle = -Math.PI / 2 + angleStep * index;
          return (
            <line
              key={index}
              x1={center}
              y1={center}
              x2={center + Math.cos(angle) * radius}
              y2={center + Math.sin(angle) * radius}
              className="radar-axis"
            />
          );
        })}

        <polyline points={closedPolygon} className="radar-outline" />

        {points.map((point) => (
          <g key={point.label}>
            <circle cx={point.x} cy={point.y} r="3.8" className="radar-dot" />
            <text x={point.labelX} y={point.labelY} className="radar-label" textAnchor="middle">
              {point.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
