import { useEffect, useState } from "react";
import { aboutRoadmap } from "../../data/siteContent";
import SectionHeading from "../ui/SectionHeading";

const SVG_WIDTH = 1000;
const X_LEFT = 180;
const X_RIGHT = 820;
const NODE_VISUAL_OFFSET = 128;
const START_Y = 310;
const ROW_GAP = 340;
const CARD_WIDTH = 300;
const CARD_GAP = 14;
const BOTTOM_PADDING = 110;
const ACTIVE_SEGMENT_MIN_LENGTH = 8;
const ROADMAP_TODAY_OVERRIDE = null;

function toFixedDate(dateString) {
  return new Date(`${dateString}T12:00:00`);
}

function getRoadmapToday() {
  return ROADMAP_TODAY_OVERRIDE ? toFixedDate(ROADMAP_TODAY_OVERRIDE) : new Date();
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function getHalfEllipseLength(radiusX, radiusY) {
  const fullPerimeter = Math.PI * (
    3 * (radiusX + radiusY) -
    Math.sqrt((3 * radiusX + radiusY) * (radiusX + 3 * radiusY))
  );

  return fullPerimeter / 2;
}

function createLineSegment(x1, y, x2) {
  return {
    type: "line",
    x1,
    y,
    x2,
    d: `M ${x1} ${y} H ${x2}`,
    length: Math.abs(x2 - x1)
  };
}

function createArcSegment(x, startY, endY, radiusX, radiusY, sweepFlag) {
  return {
    type: "arc",
    x,
    startY,
    endY,
    radiusX,
    radiusY,
    sweepFlag,
    d: `M ${x} ${startY} A ${radiusX} ${radiusY} 0 0 ${sweepFlag} ${x} ${endY}`,
    length: getHalfEllipseLength(radiusX, radiusY)
  };
}

function getSegmentStart(segment) {
  if (segment.type === "line") {
    return { x: segment.x1, y: segment.y };
  }

  return { x: segment.x, y: segment.startY };
}

function getSegmentCommand(segment) {
  if (segment.type === "line") {
    return `H ${segment.x2}`;
  }

  return `A ${segment.radiusX} ${segment.radiusY} 0 0 ${segment.sweepFlag} ${segment.x} ${segment.endY}`;
}

function buildProgressRender(segments, progressLength) {
  if (!segments.length || progressLength <= 0) {
    return { completedPath: "", activeSegment: null };
  }

  const firstStart = getSegmentStart(segments[0]);
  let completedPath = `M ${firstStart.x} ${firstStart.y}`;
  let hasCompletedSegment = false;
  let activeSegment = null;

  for (const segment of segments) {
    const visibleLength = clamp(progressLength - segment.startOffset, 0, segment.length);

    if (visibleLength <= 0) {
      break;
    }

    if (visibleLength >= segment.length - 0.001) {
      completedPath += ` ${getSegmentCommand(segment)}`;
      hasCompletedSegment = true;
      continue;
    }

    if (visibleLength >= ACTIVE_SEGMENT_MIN_LENGTH) {
      activeSegment = { ...segment, visibleLength };
    }
    break;
  }

  return {
    completedPath: hasCompletedSegment ? completedPath : "",
    activeSegment
  };
}

function buildSerpentineLayout(items) {
  const nodes = items.map((item, index) => {
    const row = Math.floor(index / 2);
    const rowIsForward = row % 2 === 0;
    const positionInRow = index % 2;
    const isLeft = rowIsForward ? positionInRow === 0 : positionInRow === 1;

    return {
      ...item,
      index,
      row,
      x: isLeft ? X_LEFT : X_RIGHT,
      nodeX: isLeft ? X_LEFT + NODE_VISUAL_OFFSET : X_RIGHT - NODE_VISUAL_OFFSET,
      y: START_Y + row * ROW_GAP
    };
  });

  const rows = [];
  const segments = [];
  const nodeProgressOffsets = new Array(nodes.length).fill(0);
  let totalLength = 0;

  nodes.forEach((node) => {
    if (!rows[node.row]) {
      rows[node.row] = [];
    }

    rows[node.row].push(node);
  });

  const path = rows.reduce((result, rowNodes, rowIndex) => {
    const rowIsForward = rowIndex % 2 === 0;
    const orderedRowNodes = [...rowNodes].sort((first, second) => (rowIsForward ? first.x - second.x : second.x - first.x));
    const rowY = orderedRowNodes[0].y;
    const rowStartX = rowIsForward ? X_LEFT : X_RIGHT;
    const rowEndX = rowIsForward ? X_RIGHT : X_LEFT;

    let nextResult = result;
    let cursorX = rowStartX;

    if (rowIndex === 0) {
      nextResult = `M ${rowStartX} ${rowY}`;
    }

    orderedRowNodes.forEach((node) => {
      if (node.nodeX !== cursorX) {
        const segment = createLineSegment(cursorX, rowY, node.nodeX);
        segments.push({ ...segment, startOffset: totalLength });
        totalLength += segment.length;
        cursorX = node.nodeX;
        nextResult += ` H ${cursorX}`;
      }

      nodeProgressOffsets[node.index] = totalLength;
    });

    if (cursorX !== rowEndX) {
      const segment = createLineSegment(cursorX, rowY, rowEndX);
      segments.push({ ...segment, startOffset: totalLength });
      totalLength += segment.length;
      cursorX = rowEndX;
      nextResult += ` H ${cursorX}`;
    }

    const nextRowNodes = rows[rowIndex + 1];

    if (!nextRowNodes) {
      return nextResult;
    }

    const nextY = nextRowNodes[0].y;
    const turnRadiusY = (nextY - rowY) / 2;
    const turnRadiusX = turnRadiusY * 0.62;
    const arcSegment = createArcSegment(rowEndX, rowY, nextY, turnRadiusX, turnRadiusY, rowIsForward ? 1 : 0);

    segments.push({ ...arcSegment, startOffset: totalLength });
    totalLength += arcSegment.length;
    nextResult += ` A ${turnRadiusX} ${turnRadiusY} 0 0 ${rowIsForward ? 1 : 0} ${rowEndX} ${nextY}`;

    return nextResult;
  }, "");

  return {
    nodes,
    path,
    segments,
    nodeProgressOffsets,
    totalLength,
    height: START_Y + Math.floor((items.length - 1) / 2) * ROW_GAP + BOTTOM_PADDING
  };
}

function getProgressLength(items, currentDate, progressOffsets, totalLength) {
  const firstDate = items[0].actualDateObject.getTime();
  const lastDate = items[items.length - 1].actualDateObject.getTime();
  const now = currentDate.getTime();

  if (now <= firstDate) {
    return progressOffsets[0];
  }

  if (now >= lastDate) {
    return totalLength;
  }

  for (let index = 0; index < items.length - 1; index += 1) {
    const start = items[index].actualDateObject.getTime();
    const end = items[index + 1].actualDateObject.getTime();

    if (now <= end) {
      const localRatio = clamp((now - start) / (end - start), 0, 1);
      const startOffset = progressOffsets[index];
      const endOffset = progressOffsets[index + 1];
      return startOffset + (endOffset - startOffset) * localRatio;
    }
  }

  return totalLength;
}

function getNodeState(items, index, currentDate) {
  const now = currentDate.getTime();
  const currentItemDate = items[index].actualDateObject.getTime();
  const nextItemDate = items[index + 1]?.actualDateObject.getTime();

  if (now < currentItemDate) {
    return "upcoming";
  }

  if (!nextItemDate || now >= nextItemDate) {
    return "reached";
  }

  return "current";
}

const roadmapItems = aboutRoadmap.map((item) => ({
  ...item,
  actualDateObject: toFixedDate(item.actualDate)
}));

export default function RoadmapSection() {
  const [today, setToday] = useState(() => getRoadmapToday());

  useEffect(() => {
    if (ROADMAP_TODAY_OVERRIDE) {
      return undefined;
    }

    let intervalId;
    const now = new Date();
    const nextMidnight = new Date(now);
    nextMidnight.setHours(24, 0, 0, 0);
    const timeoutMs = nextMidnight.getTime() - now.getTime();

    const timeoutId = window.setTimeout(() => {
      setToday(new Date());

      intervalId = window.setInterval(() => {
        setToday(new Date());
      }, 24 * 60 * 60 * 1000);
    }, timeoutMs);

    return () => {
      window.clearTimeout(timeoutId);
      if (intervalId) {
        window.clearInterval(intervalId);
      }
    };
  }, []);

  const roadmapItemsWithState = roadmapItems.map((item, index, items) => ({
    ...item,
    timelineState: getNodeState(items, index, today)
  }));
  const layout = buildSerpentineLayout(roadmapItemsWithState);
  const progressLength = getProgressLength(
    roadmapItemsWithState,
    today,
    layout.nodeProgressOffsets,
    layout.totalLength
  );
  const progressRender = buildProgressRender(layout.segments, progressLength);

  return (
    <div className="roadmap-shell">
      <div className="roadmap-intro">
        <SectionHeading
          kicker="Roadmap"
          title="Une trajectoire visuelle, régulière et lisible"
        />
      </div>

      <div className="roadmap-track" style={{ height: `${layout.height}px` }}>
        <svg className="roadmap-track-svg" viewBox={`0 0 ${SVG_WIDTH} ${layout.height}`} preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="roadmap-progress" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={SVG_WIDTH} y2="0">
              <stop offset="0%" stopColor="#73f0b5" />
              <stop offset="55%" stopColor="#ffcf7d" />
              <stop offset="100%" stopColor="#d06f55" />
            </linearGradient>
          </defs>
          <path className="roadmap-path roadmap-path--base" d={layout.path} vectorEffect="non-scaling-stroke" />
          {progressRender.completedPath ? (
            <path
              className="roadmap-path roadmap-path--progress"
              d={progressRender.completedPath}
              vectorEffect="non-scaling-stroke"
            />
          ) : null}
          {progressRender.activeSegment ? (
            progressRender.activeSegment.type === "line" ? (
              <path
                key={`active-${progressRender.activeSegment.startOffset}`}
                className="roadmap-path roadmap-path--progress"
                d={`M ${progressRender.activeSegment.x1} ${progressRender.activeSegment.y} H ${
                  progressRender.activeSegment.x1 +
                  (progressRender.activeSegment.x2 >= progressRender.activeSegment.x1 ? 1 : -1) *
                    progressRender.activeSegment.visibleLength
                }`}
                vectorEffect="non-scaling-stroke"
                style={{ strokeLinecap: "butt" }}
              />
            ) : (
              <path
                key={`active-${progressRender.activeSegment.startOffset}`}
                className="roadmap-path roadmap-path--progress"
                d={progressRender.activeSegment.d}
                pathLength={progressRender.activeSegment.length}
                vectorEffect="non-scaling-stroke"
                style={{
                  strokeDasharray: `${progressRender.activeSegment.visibleLength} ${progressRender.activeSegment.length}`,
                  strokeLinecap: "butt"
                }}
              />
            )
          ) : null}
        </svg>

        {layout.nodes.map((node) => (
          <article
            key={node.id}
            className={`roadmap-step roadmap-step--${node.timelineState} roadmap-step--${node.accent}`}
            style={{
              left: `${(node.nodeX / SVG_WIDTH) * 100}%`,
              top: `${node.y}px`
            }}
          >
            <div
              className="roadmap-step-card"
              style={{
                bottom: `${CARD_GAP}px`,
                width: `${CARD_WIDTH}px`
              }}
            >
              <p className="roadmap-step-date">{node.date}</p>
              <h3>{node.title}</h3>
              <p>{node.text}</p>
            </div>
            <div className="roadmap-step-marker">
              <span>{String(node.index + 1).padStart(2, "0")}</span>
            </div>
          </article>
        ))}
      </div>

      <div className="roadmap-mobile">
        {roadmapItemsWithState.map((item, index) => (
          <article key={item.id} className={`roadmap-mobile-card roadmap-mobile-card--${item.timelineState} roadmap-mobile-card--${item.accent}`}>
            <div className="roadmap-mobile-rail">
              <span className="roadmap-mobile-dot">{String(index + 1).padStart(2, "0")}</span>
              <span className={`roadmap-mobile-line${item.timelineState === "upcoming" ? " is-planned" : ""}`} />
            </div>
            <div className="roadmap-mobile-copy">
              <p className="roadmap-step-date">{item.date}</p>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
