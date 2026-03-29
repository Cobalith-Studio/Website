import { useEffect, useState } from "react";
import { flushSync } from "react-dom";
import CustomSelect from "../ui/CustomSelect";
import {
  createEdgePath,
  getWineGraphModel,
  outputClassName
} from "../../lib/wineGraph";
import { createDefaultContext } from "../../lib/wineEngine";

export default function WineSimulator() {
  const [context, setContext] = useState(createDefaultContext);
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [model, setModel] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    let frameId = 0;
    let timerId = 0;

    frameId = window.requestAnimationFrame(() => {
      timerId = window.setTimeout(() => {
        const nextModel = getWineGraphModel(context, selectedGroupId);
        if (cancelled) {
          return;
        }
        setModel(nextModel);
        setIsLoading(false);
      }, 0);
    });

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frameId);
      window.clearTimeout(timerId);
    };
  }, [context, selectedGroupId]);

  function updateContext(key, value) {
    flushSync(() => {
      setIsLoading(true);
    });

    window.requestAnimationFrame(() => {
      setContext((current) => ({ ...current, [key]: value }));
    });
  }

  function updateGroup(groupId) {
    flushSync(() => {
      setIsLoading(true);
    });

    window.requestAnimationFrame(() => {
      setSelectedGroupId(groupId);
    });
  }

  if (!model) {
    return (
      <div className="wine-graph-layout">
        <section className="panel compact-panel wine-graph-loader-panel">
          <div className="graph-loading-state">
            <div className="graph-loading-spinner" aria-hidden="true" />
            <p>Chargement du graphe de vinification...</p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="wine-graph-layout">
      <section className="panel compact-panel">
        <div className="panel-heading compact-heading">
          <p className="panel-kicker">Contexte</p>
        </div>

        <div className="field-grid field-grid-compact">
          {model.contextFields.map((field) => (
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
              value={model.activeGroup?.id ?? ""}
              onChange={updateGroup}
              options={model.groups.map((group) => ({ value: group.id, label: group.label }))}
            />
          </label>
        </div>
      </section>

      <div className="wine-graph-main">
        <section className="panel compact-panel">
          <div className="panel-heading compact-heading">
            <p className="panel-kicker">Arbre</p>
          </div>

          <div className={`graph-canvas-shell${isLoading ? " is-loading" : ""}`}>
            {isLoading ? (
              <div className="graph-loading-overlay" aria-hidden="true">
                <div className="graph-loading-spinner" />
              </div>
            ) : null}

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
