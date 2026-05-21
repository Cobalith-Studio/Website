import { useEffect, useMemo, useState } from "react";
import CustomSelect from "../ui/CustomSelect";
import {
  createEdgePath,
  getDefaultWineGraphModel,
  getWineGraphModel,
  outputClassName,
  peekDefaultWineGraphModel
} from "../../lib/wineGraph";
import { createDefaultContext, getContextFields } from "../../lib/wineEngine";

function isDefaultContext(context, defaultContext) {
  return Object.keys(defaultContext).every((key) => context[key] === defaultContext[key]);
}

function scheduleAfterPaint(callback) {
  let secondFrame = 0;
  const firstFrame = window.requestAnimationFrame(() => {
    secondFrame = window.requestAnimationFrame(callback);
  });

  return () => {
    window.cancelAnimationFrame(firstFrame);
    window.cancelAnimationFrame(secondFrame);
  };
}

export default function WineSimulator({ shouldLoadGraph = true }) {
  const defaultContext = useMemo(() => createDefaultContext(), []);
  const contextFields = useMemo(() => getContextFields(), []);
  const [context, setContext] = useState(defaultContext);
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [model, setModel] = useState(() => peekDefaultWineGraphModel());
  const [isLoading, setIsLoading] = useState(() => !peekDefaultWineGraphModel());

  useEffect(() => {
    if (!shouldLoadGraph) {
      return undefined;
    }

    let cancelled = false;
    let timerId = 0;
    setIsLoading(true);

    const cancelScheduledWork = scheduleAfterPaint(() => {
      timerId = window.setTimeout(() => {
        const shouldUseDefaultModel = selectedGroupId === "" && isDefaultContext(context, defaultContext);
        const nextModel = shouldUseDefaultModel
          ? getDefaultWineGraphModel()
          : getWineGraphModel(context, selectedGroupId);

        if (cancelled) {
          return;
        }

        setModel(nextModel);
        setIsLoading(false);
      }, 0);
    });

    return () => {
      cancelled = true;
      cancelScheduledWork();
      window.clearTimeout(timerId);
    };
  }, [context, defaultContext, selectedGroupId, shouldLoadGraph]);

  function updateContext(key, value) {
    setIsLoading(true);
    setContext((current) => ({ ...current, [key]: value }));
  }

  function updateGroup(groupId) {
    setIsLoading(true);
    setSelectedGroupId(groupId);
  }

  const groupOptions = model?.groups.map((group) => ({ value: group.id, label: group.label })) ?? [];

  return (
    <div className="wine-graph-layout">
      <section className="panel compact-panel">
        <div className="panel-heading compact-heading">
          <p className="panel-kicker">Contexte</p>
        </div>

        <div className="field-grid field-grid-compact">
          {contextFields.map((field) => (
            <label className="field" key={field.key}>
              <span>{field.label}</span>
              <CustomSelect
                value={context[field.key]}
                onChange={(value) => updateContext(field.key, value)}
                options={field.options}
              />
            </label>
          ))}
          <label className="field">
            <span>Groupe de cépages</span>
            <CustomSelect
              value={model?.activeGroup?.id ?? ""}
              onChange={updateGroup}
              options={groupOptions}
              placeholder={shouldLoadGraph && isLoading ? "Chargement..." : "Choisir"}
              disabled={!model}
            />
          </label>
        </div>
      </section>

      <div className="wine-graph-main">
        <section className="panel compact-panel">
          <div className="panel-heading compact-heading">
            <p className="panel-kicker">Arbre</p>
          </div>

          <div className={`graph-canvas-shell${shouldLoadGraph && isLoading ? " is-loading" : ""}`}>
            {shouldLoadGraph && isLoading ? (
              <div className="graph-loading-overlay" aria-hidden="true">
                <div className="graph-loading-spinner" />
              </div>
            ) : null}

            {model ? (
              <svg className="wine-graph-canvas" viewBox={model.graph.viewBox} preserveAspectRatio="xMinYMin meet">
                <defs>
                  <marker id="wine-arrow" viewBox="0 0 10 10" refX="0.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" className="graph-arrow-head" />
                  </marker>
                </defs>

                {model.graph.edges.map((edge) => (
                  <path
                    key={edge.id}
                    d={createEdgePath(edge, model.graph.nodeMap)}
                    className="graph-edge"
                    markerEnd="url(#wine-arrow)"
                  />
                ))}

                {model.graph.nodes.map((node) => (
                  <g
                    key={node.id}
                    className={`graph-render-node graph-render-node--${node.type}${
                      node.type === "bottle" && node.output ? ` graph-render-node--${outputClassName(node.output)}` : ""
                    }`}
                    transform={`translate(${node.x}, ${node.y})`}
                  >
                    <rect width={node.width} height={node.height} rx="12" ry="12" />
                    <text x="12" y="22" className="graph-label">
                      {node.lines.map((line, index) => (
                        <tspan
                          key={`${node.id}-${line}-${index}`}
                          x="12"
                          dy={index === 0 ? "0" : "14"}
                          className={index === 0 ? "graph-label-title" : "graph-label-detail"}
                        >
                          {line}
                        </tspan>
                      ))}
                    </text>
                  </g>
                ))}
              </svg>
            ) : (
              <div className="graph-loading-state">
                <div className="graph-loading-spinner" aria-hidden="true" />
                <p>{shouldLoadGraph ? "Chargement du graphe de vinification..." : "Préparation du graphe..."}</p>
              </div>
            )}
          </div>

          <div className="graph-legend">
            <span className="legend-title">Légende des vins</span>
            <span className="legend-item"><i className="legend-swatch legend-swatch--effervescent" /> Effervescent</span>
            <span className="legend-item"><i className="legend-swatch legend-swatch--blanc" /> Blanc</span>
            <span className="legend-item"><i className="legend-swatch legend-swatch--blanc-de-noirs" /> Blanc de Noirs</span>
            <span className="legend-item"><i className="legend-swatch legend-swatch--orange" /> Vin Orange</span>
            <span className="legend-item"><i className="legend-swatch legend-swatch--rose" /> Rosé</span>
            <span className="legend-item"><i className="legend-swatch legend-swatch--rouge" /> Rouge</span>
            <span className="legend-item"><i className="legend-swatch legend-swatch--liquoreux" /> Liquoreux</span>
          </div>
        </section>
      </div>
    </div>
  );
}
