import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  AlertCircle,
  Boxes,
  CheckCircle2,
  ChevronRight,
  Layout,
  LayoutDashboard,
  Package,
  StickyNote,
  TrendingUp,
  Wallet
} from "lucide-react";
import { PHASE_OPTIONS } from "../../admin/adminConfig";
import { useStoredAdminPreferences, useStoredAssets } from "../../admin/useStoredAdminData";
import { useAuth } from "../../auth/AuthContext";

const tools = [
  {
    id: "assets",
    icon: Package,
    label: "Asset Manager",
    description: "Inventaire, suivi et annotation de tous les assets 3D du jeu",
    path: "/equipe/assets",
    tone: "blue"
  },
  {
    id: "notes",
    icon: StickyNote,
    label: "Notes de production",
    description: "Bloc-notes libre pour idées, décisions et suivi du projet",
    path: "/equipe/notes",
    tone: "amber"
  },
  {
    id: "kanban",
    icon: Layout,
    label: "Kanban",
    description: "Tableau de tâches par statut, priorité, dates et domaines",
    path: "/equipe/kanban",
    tone: "blue"
  },
  {
    id: "budget",
    icon: Wallet,
    label: "Budget & Dépenses",
    description: "Suivi des postes budgétaires, factures, recettes et jalons",
    path: "/equipe/budget",
    tone: "green"
  }
];

function AdminStatCard({ stat, index }) {
  const Icon = stat.icon;

  return (
    <motion.article
      className="admin-stat-card"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <div className="admin-stat-head">
        <span>{stat.label}</span>
        <Icon className={`admin-icon admin-icon--${stat.tone}`} aria-hidden="true" />
      </div>
      <strong className={`admin-stat-value admin-text--${stat.tone}`}>{stat.value}</strong>
    </motion.article>
  );
}

function AdminToolCard({ tool, index }) {
  const Icon = tool.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -18 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.18 + index * 0.08 }}
    >
      <Link to={tool.path} className="admin-tool-card">
        <span className={`admin-tool-icon admin-tool-icon--${tool.tone}`}>
          <Icon aria-hidden="true" />
        </span>
        <span className="admin-tool-copy">
          <strong>{tool.label}</strong>
          <span>{tool.description}</span>
        </span>
        <ChevronRight className="admin-tool-chevron" aria-hidden="true" />
      </Link>
    </motion.div>
  );
}

export default function AdminDashboard() {
  const { profile, user } = useAuth();
  const [assets] = useStoredAssets();
  const [preferences, setPreferences] = useStoredAdminPreferences();
  const targetPhase = preferences.targetPhase;

  function setPhase(phase) {
    setPreferences((current) => ({ ...current, targetPhase: phase }));
  }

  const phaseInfo = PHASE_OPTIONS.find((phase) => phase.value === targetPhase) ?? PHASE_OPTIONS[0];
  const phaseAssets = assets.filter((asset) => asset.milestone === targetPhase);
  const stats = [
    { label: "Assets total", value: assets.length, icon: Boxes, tone: "blue" },
    { label: "Terminés", value: assets.filter((asset) => asset.status === "done").length, icon: CheckCircle2, tone: "green" },
    { label: `Requis (${phaseInfo.short})`, value: phaseAssets.length, icon: TrendingUp, tone: "primary" },
    { label: `Manquants (${phaseInfo.short})`, value: phaseAssets.filter((asset) => asset.status === "missing").length, icon: AlertCircle, tone: "red" }
  ];
  const displayName = profile?.email?.split("@")[0] ?? user?.email?.split("@")[0] ?? "équipe";

  return (
    <main className="admin-shell">
      <div className="admin-container">
        <motion.header className="admin-header" initial={{ opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }}>
          <div className="admin-brand-row">
            <span className="admin-brand-icon">
              <LayoutDashboard aria-hidden="true" />
            </span>
            <span>Cobalith Studio</span>
          </div>
          <h1>Espace Admin</h1>
          <p>Bonjour, {displayName} — Dashboard de production</p>

          <div className="admin-phase-row" aria-label="Phase visée">
            <span>Phase visée :</span>
            {PHASE_OPTIONS.map((phase) => (
              <button
                className={`admin-phase-chip ${targetPhase === phase.value ? phase.className : ""}`}
                type="button"
                key={phase.value}
                onClick={() => setPhase(phase.value)}
              >
                {phase.label}
              </button>
            ))}
          </div>
        </motion.header>

        <section className="admin-stats-grid" aria-label="Statistiques admin">
          {stats.map((stat, index) => (
            <AdminStatCard key={stat.label} stat={stat} index={index} />
          ))}
        </section>

        <section className="admin-tools-section">
          <h2>Outils disponibles</h2>
          <div className="admin-tools-grid">
            {tools.map((tool, index) => (
              <AdminToolCard key={tool.id} tool={tool} index={index} />
            ))}
          </div>
        </section>

        <footer className="admin-return">
          <Link to="/">← Retour au site public</Link>
        </footer>
      </div>
    </main>
  );
}
