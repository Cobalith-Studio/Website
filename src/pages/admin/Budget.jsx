import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart3,
  CheckCircle2,
  ChevronLeft,
  Clock,
  ExternalLink,
  Filter,
  Plus,
  Receipt,
  Save,
  Trash2,
  TrendingDown,
  TrendingUp,
  Wallet,
  X,
  XCircle
} from "lucide-react";
import { createAdminId } from "../../admin/adminStorage";
import { useDeleteStoredBudgetEntry, useStoredBudgetEntries } from "../../admin/useStoredAdminData";
import KanbanDatePicker from "../../components/kanban/KanbanDatePicker";

const CATEGORIES = {
  assets_3d: { label: "Assets 3D", color: "#3b82f6" },
  audio: { label: "Audio / Musique", color: "#8b5cf6" },
  software: { label: "Logiciels", color: "#06b6d4" },
  outsourcing: { label: "Sous-traitance", color: "#f97316" },
  marketing: { label: "Marketing", color: "#ec4899" },
  legal: { label: "Juridique", color: "#ef4444" },
  infra: { label: "Infrastructure", color: "#64748b" },
  revenue: { label: "Recettes", color: "#10b981" },
  misc: { label: "Divers", color: "#94a3b8" }
};

const STATUSES = {
  planned: { label: "Planifié", icon: Clock, className: "budget-status--planned" },
  paid: { label: "Payé", icon: CheckCircle2, className: "budget-status--paid" },
  cancelled: { label: "Annulé", icon: XCircle, className: "budget-status--cancelled" }
};

const MILESTONES = {
  vertical_slice: { label: "Vertical Slice", short: "VS", className: "budget-milestone--primary" },
  demo: { label: "Démo", short: "Démo", className: "budget-milestone--purple" },
  release: { label: "Release", short: "1.0", className: "budget-milestone--green" },
  general: { label: "Général", short: "Gén", className: "budget-milestone--slate" }
};

const formatCurrency = (value) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(Number(value) || 0);

function SegmentedOptions({ label, value, options, onChange }) {
  return (
    <div className="budget-field">
      <span>{label}</span>
      <div className="budget-segment-row">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            className={value === option.value ? "is-active" : ""}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function EntryForm({ entry, onClose, onSave }) {
  const [form, setForm] = useState(entry ? { ...entry } : {
    id: createAdminId("budget"),
    label: "",
    amount: "",
    type: "expense",
    category: "misc",
    status: "planned",
    date: "",
    vendor: "",
    invoice_url: "",
    notes: "",
    milestone: "general"
  });
  const [errors, setErrors] = useState({});

  function update(patch) {
    setForm((current) => ({ ...current, ...patch }));
  }

  function handleSave() {
    const nextErrors = {};
    if (!form.label.trim()) nextErrors.label = "Intitulé requis.";
    if (form.amount === "" || Number.isNaN(Number(form.amount))) nextErrors.amount = "Montant requis.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    onSave({
      ...form,
      label: form.label.trim(),
      amount: Number(form.amount)
    });
  }

  return (
    <div className="admin-modal-backdrop">
      <motion.div className="budget-modal" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
        <div className="budget-modal-head">
          <h2>{entry ? "Modifier l'entrée" : "Nouvelle entrée"}</h2>
          <button type="button" onClick={onClose} aria-label="Fermer">
            <X aria-hidden="true" />
          </button>
        </div>

        <div className="budget-form">
          <SegmentedOptions
            label="Type"
            value={form.type}
            onChange={(type) => update({ type })}
            options={[
              { value: "expense", label: "Dépense" },
              { value: "income", label: "Recette" }
            ]}
          />

          <div className="budget-form-grid">
            <label className="budget-field">
              <span>Intitulé *</span>
              <input value={form.label} onChange={(event) => update({ label: event.target.value })} placeholder="ex: Pack POLYGON Farm" autoFocus />
              {errors.label ? <small>{errors.label}</small> : null}
            </label>
            <label className="budget-field">
              <span>Montant (€) *</span>
              <input type="number" value={form.amount} onChange={(event) => update({ amount: event.target.value })} placeholder="0.00" min="0" step="0.01" />
              {errors.amount ? <small>{errors.amount}</small> : null}
            </label>
          </div>

          <SegmentedOptions
            label="Catégorie"
            value={form.category}
            onChange={(category) => update({ category })}
            options={Object.entries(CATEGORIES).map(([value, category]) => ({ value, label: category.label }))}
          />

          <SegmentedOptions
            label="Statut"
            value={form.status}
            onChange={(status) => update({ status })}
            options={Object.entries(STATUSES).map(([value, status]) => ({ value, label: status.label }))}
          />

          <SegmentedOptions
            label="Jalon"
            value={form.milestone}
            onChange={(milestone) => update({ milestone })}
            options={Object.entries(MILESTONES).map(([value, milestone]) => ({ value, label: milestone.label }))}
          />

          <div className="budget-form-grid">
            <label className="budget-field">
              <span>Date</span>
              <KanbanDatePicker value={form.date || ""} onChange={(date) => update({ date })} placeholder="JJ/MM/AA" />
            </label>
            <label className="budget-field">
              <span>Fournisseur / Source</span>
              <input value={form.vendor} onChange={(event) => update({ vendor: event.target.value })} placeholder="ex: Unity Asset Store" />
            </label>
          </div>

          <label className="budget-field">
            <span>Lien facture</span>
            <input value={form.invoice_url} onChange={(event) => update({ invoice_url: event.target.value })} placeholder="https://..." />
          </label>

          <label className="budget-field">
            <span>Notes</span>
            <textarea value={form.notes} onChange={(event) => update({ notes: event.target.value })} placeholder="Annotations libres..." />
          </label>
        </div>

        <div className="budget-modal-actions">
          <button className="admin-button admin-button--primary" type="button" onClick={handleSave}>
            <Save aria-hidden="true" /> {entry ? "Enregistrer" : "Créer"}
          </button>
          <button className="admin-button" type="button" onClick={onClose}>Annuler</button>
        </div>
      </motion.div>
    </div>
  );
}

function BudgetStatCard({ label, value, sub, tone, icon: Icon }) {
  return (
    <article className="budget-stat-card">
      <div>
        <span>{label}</span>
        <Icon className={`budget-stat-icon budget-stat-icon--${tone}`} aria-hidden="true" />
      </div>
      <strong className={`budget-text--${tone}`}>{value}</strong>
      {sub ? <small>{sub}</small> : null}
    </article>
  );
}

function EntryRow({ entry, onEdit, onDelete }) {
  const category = CATEGORIES[entry.category] || CATEGORIES.misc;
  const status = STATUSES[entry.status] || STATUSES.planned;
  const milestone = MILESTONES[entry.milestone] || MILESTONES.general;
  const StatusIcon = status.icon;

  return (
    <motion.article className="budget-row" layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => onEdit(entry)}>
      <span className="budget-row-dot" style={{ background: category.color }} aria-hidden="true" />
      <span className="budget-row-main">
        <span className="budget-row-title">
          <strong>{entry.label}</strong>
          {entry.vendor ? <em>{entry.vendor}</em> : null}
        </span>
        <span className="budget-row-meta">
          <span>{category.label}</span>
          <span className={`budget-milestone ${milestone.className}`}>{milestone.short}</span>
          {entry.date ? <span>{new Date(`${entry.date}T00:00:00`).toLocaleDateString("fr-FR")}</span> : null}
          {entry.invoice_url ? (
            <a href={entry.invoice_url} target="_blank" rel="noopener noreferrer" onClick={(event) => event.stopPropagation()}>
              Facture <ExternalLink aria-hidden="true" />
            </a>
          ) : null}
          {entry.notes ? <span>{entry.notes}</span> : null}
        </span>
      </span>
      <span className="budget-row-side">
        <span className={`budget-status ${status.className}`}>
          <StatusIcon aria-hidden="true" /> {status.label}
        </span>
        <strong className={entry.type === "income" ? "budget-amount--income" : ""}>
          {entry.type === "income" ? "+" : "-"}{formatCurrency(entry.amount)}
        </strong>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onDelete(entry.id);
          }}
          aria-label="Supprimer"
        >
          <Trash2 aria-hidden="true" />
        </button>
      </span>
    </motion.article>
  );
}

function FilterButton({ active, onClick, children }) {
  return (
    <button type="button" className={active ? "is-active" : ""} onClick={onClick}>
      {children}
    </button>
  );
}

export default function Budget() {
  const [entries, setEntries] = useStoredBudgetEntries();
  const deleteStoredBudgetEntry = useDeleteStoredBudgetEntry();
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterMilestone, setFilterMilestone] = useState("all");
  const [view, setView] = useState("list");

  const totalExpenses = entries.filter((entry) => entry.type === "expense" && entry.status !== "cancelled").reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
  const totalIncome = entries.filter((entry) => entry.type === "income" && entry.status !== "cancelled").reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
  const paidExpenses = entries.filter((entry) => entry.type === "expense" && entry.status === "paid").reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
  const planned = entries.filter((entry) => entry.type === "expense" && entry.status === "planned").reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
  const balance = totalIncome - totalExpenses;

  const byCategory = useMemo(() => {
    const categoryMap = {};
    entries
      .filter((entry) => entry.type === "expense" && entry.status !== "cancelled")
      .forEach((entry) => {
        categoryMap[entry.category] = (categoryMap[entry.category] || 0) + Number(entry.amount || 0);
      });
    return Object.entries(categoryMap).sort((a, b) => b[1] - a[1]);
  }, [entries]);

  const filteredEntries = entries.filter((entry) => {
    if (filterType !== "all" && entry.type !== filterType) return false;
    if (filterStatus !== "all" && entry.status !== filterStatus) return false;
    if (filterMilestone !== "all" && entry.milestone !== filterMilestone) return false;
    return true;
  });

  function saveEntry(form) {
    if (editingEntry) {
      setEntries((current) => current.map((entry) => entry.id === editingEntry.id ? { ...entry, ...form } : entry));
    } else {
      setEntries((current) => [{ ...form, id: form.id || createAdminId("budget") }, ...current]);
    }
    setShowForm(false);
    setEditingEntry(null);
  }

  async function deleteEntry(id) {
    setEntries((current) => current.filter((entry) => entry.id !== id));
    await deleteStoredBudgetEntry(id);
  }

  return (
    <main className="admin-shell budget-shell">
      <div className="admin-container">
        <header className="admin-page-head">
          <Link to="/equipe" className="admin-back-link" aria-label="Retour">
            <ChevronLeft aria-hidden="true" />
          </Link>
          <span className="admin-page-icon admin-tool-icon--green"><Wallet aria-hidden="true" /></span>
          <div>
            <h1>Budget & Dépenses</h1>
            <p>{entries.length} entrée{entries.length !== 1 ? "s" : ""}</p>
          </div>
          <div className="admin-head-actions">
            <button className={`budget-view-button ${view === "chart" ? "is-active" : ""}`} type="button" onClick={() => setView((current) => current === "list" ? "chart" : "list")} aria-label="Basculer la vue graphique">
              <BarChart3 aria-hidden="true" />
            </button>
            <button className="admin-button admin-button--primary" type="button" onClick={() => { setEditingEntry(null); setShowForm(true); }}>
              <Plus aria-hidden="true" /> Nouvelle entrée
            </button>
          </div>
        </header>

        <section className="budget-stats-grid">
          <BudgetStatCard label="Total dépenses" value={formatCurrency(totalExpenses)} sub={`dont ${formatCurrency(paidExpenses)} payés`} tone="red" icon={TrendingDown} />
          <BudgetStatCard label="Total recettes" value={formatCurrency(totalIncome)} tone="green" icon={TrendingUp} />
          <BudgetStatCard label="Balance" value={formatCurrency(balance)} tone={balance >= 0 ? "green" : "red"} icon={Wallet} />
          <BudgetStatCard label="À payer" value={formatCurrency(planned)} sub={`${entries.filter((entry) => entry.status === "planned").length} entrées`} tone="amber" icon={Clock} />
        </section>

        {view === "chart" ? (
          <section className="budget-chart-card">
            <h2>Répartition des dépenses par catégorie</h2>
            {byCategory.length ? (
              <div className="budget-chart-list">
                {byCategory.map(([categoryKey, amount]) => {
                  const category = CATEGORIES[categoryKey] || CATEGORIES.misc;
                  const percent = totalExpenses ? Math.round((amount / totalExpenses) * 100) : 0;
                  return (
                    <div className="budget-chart-row" key={categoryKey}>
                      <div>
                        <span>{category.label}</span>
                        <strong>{formatCurrency(amount)} <em>({percent}%)</em></strong>
                      </div>
                      <div className="budget-chart-track">
                        <motion.span initial={{ width: 0 }} animate={{ width: `${percent}%` }} style={{ background: category.color }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p>Aucune dépense enregistrée.</p>
            )}
          </section>
        ) : null}

        <section className="budget-filter-row">
          <Filter aria-hidden="true" />
          <FilterButton active={filterType === "all"} onClick={() => setFilterType("all")}>Tout</FilterButton>
          <FilterButton active={filterType === "expense"} onClick={() => setFilterType("expense")}>Dépenses</FilterButton>
          <FilterButton active={filterType === "income"} onClick={() => setFilterType("income")}>Recettes</FilterButton>
          <span>|</span>
          {Object.entries(STATUSES).map(([key, status]) => (
            <FilterButton key={key} active={filterStatus === key} onClick={() => setFilterStatus(filterStatus === key ? "all" : key)}>{status.label}</FilterButton>
          ))}
          <span>|</span>
          {Object.entries(MILESTONES).map(([key, milestone]) => (
            <FilterButton key={key} active={filterMilestone === key} onClick={() => setFilterMilestone(filterMilestone === key ? "all" : key)}>{milestone.label}</FilterButton>
          ))}
        </section>

        {filteredEntries.length ? (
          <section className="budget-list">
            <AnimatePresence>
              {filteredEntries.map((entry) => (
                <EntryRow key={entry.id} entry={entry} onEdit={(nextEntry) => { setEditingEntry(nextEntry); setShowForm(true); }} onDelete={deleteEntry} />
              ))}
            </AnimatePresence>
          </section>
        ) : (
          <div className="admin-empty-state">
            <Receipt aria-hidden="true" />
            <p>Aucune entrée trouvée</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showForm ? (
          <EntryForm entry={editingEntry} onClose={() => { setShowForm(false); setEditingEntry(null); }} onSave={saveEntry} />
        ) : null}
      </AnimatePresence>
    </main>
  );
}
