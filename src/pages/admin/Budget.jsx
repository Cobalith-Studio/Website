import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart3,
  CheckCircle2,
  ChevronLeft,
  Clock,
  Download,
  Eye,
  FileText,
  Filter,
  Plus,
  Receipt,
  RotateCcw,
  Save,
  Trash2,
  TrendingDown,
  TrendingUp,
  Upload,
  Wallet,
  X,
  XCircle,
  AlertTriangle
} from "lucide-react";
import { createBudgetInvoiceSignedUrl, deleteBudgetInvoice, uploadBudgetInvoice } from "../../admin/adminCloudStorage";
import { createAdminId } from "../../admin/adminStorage";
import { useDeleteStoredBudgetEntry, useStoredBudgetEntries } from "../../admin/useStoredAdminData";
import KanbanDatePicker from "../../components/kanban/KanbanDatePicker";

const EXPENSE_CATEGORIES = {
  assets_graphics: { label: "Assets et graphisme", color: "#3b82f6" },
  audio_music: { label: "Audio/Musique", color: "#8b5cf6" },
  software_license: { label: "Logiciel/Licence", color: "#06b6d4" },
  marketing: { label: "Marketing", color: "#ec4899" },
  legal: { label: "Juridique", color: "#ef4444" },
  infrastructure: { label: "Infrastructure", color: "#64748b" }
};

const INCOME_CATEGORIES = {
  donation: { label: "Don", color: "#10b981" },
  game_revenue: { label: "Revenu jeu", color: "#22c55e" },
  personal_capital: { label: "Capital personnel", color: "#f59e0b" },
  external_funding: { label: "Financement externe", color: "#14b8a6" },
  grant: { label: "Subvention", color: "#84cc16" }
};

const ALL_CATEGORIES = { ...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES };

const EXPENSE_STATUSES = {
  planned: { label: "Planifié", icon: Clock, className: "budget-status--planned" },
  paid: { label: "Payé", icon: CheckCircle2, className: "budget-status--paid" },
  cancelled: { label: "Annulé", icon: XCircle, className: "budget-status--cancelled" }
};

const INCOME_STATUSES = {
  pending: { label: "En attente", icon: Clock, className: "budget-status--planned" },
  received: { label: "Reçu", icon: CheckCircle2, className: "budget-status--paid" }
};

const PERSONAL_CAPITAL_STATUSES = {
  reimbursement_pending: { label: "En attente de remboursement", icon: Clock, className: "budget-status--planned" },
  refunded: { label: "Remboursé", icon: RotateCcw, className: "budget-status--refunded" }
};

const ALL_STATUSES = { ...EXPENSE_STATUSES, ...INCOME_STATUSES, ...PERSONAL_CAPITAL_STATUSES };

const DEFAULT_CATEGORY_BY_TYPE = {
  expense: "assets_graphics",
  income: "donation"
};

const LEGACY_CATEGORY_MAP = {
  assets_3d: "assets_graphics",
  audio: "audio_music",
  software: "software_license",
  outsourcing: "assets_graphics",
  infra: "infrastructure",
  revenue: "game_revenue",
  misc: "assets_graphics"
};

const formatCurrency = (value) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(Number(value) || 0);

const formatFileSize = (size) => {
  const value = Number(size) || 0;
  if (!value) return "";
  if (value < 1024 * 1024) return `${Math.round(value / 1024)} Ko`;
  return `${(value / (1024 * 1024)).toFixed(1)} Mo`;
};

function getCategoriesForType(type) {
  return type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
}

function getStatusesForEntry(type, category) {
  if (type === "income" && category === "personal_capital") {
    return PERSONAL_CAPITAL_STATUSES;
  }
  return type === "income" ? INCOME_STATUSES : EXPENSE_STATUSES;
}

function getDefaultStatus(type, category) {
  if (type === "income" && category === "personal_capital") {
    return "reimbursement_pending";
  }
  return type === "income" ? "pending" : "planned";
}

function normalizeStatus(type, category, status) {
  const statuses = getStatusesForEntry(type, category);
  if (statuses[status]) return status;
  if (type === "income" && category === "personal_capital") {
    return status === "refunded" ? "refunded" : "reimbursement_pending";
  }
  if (type === "income") {
    return status === "paid" || status === "received" ? "received" : "pending";
  }
  return EXPENSE_STATUSES[status] ? status : "planned";
}

function normalizeEntry(entry) {
  const type = entry?.type === "income" ? "income" : "expense";
  const categories = getCategoriesForType(type);
  const legacyCategory = LEGACY_CATEGORY_MAP[entry?.category] || entry?.category;
  const category = categories[legacyCategory] ? legacyCategory : DEFAULT_CATEGORY_BY_TYPE[type];
  const status = normalizeStatus(type, category, entry?.status);

  return {
    id: entry?.id || createAdminId("budget"),
    label: entry?.label || "",
    amount: entry?.amount ?? "",
    type,
    category,
    status,
    date: entry?.date || "",
    vendor: entry?.vendor || "",
    notes: entry?.notes || "",
    invoice_path: entry?.invoice_path || "",
    invoice_name: entry?.invoice_name || "",
    invoice_size: entry?.invoice_size || "",
    invoice_mime_type: entry?.invoice_mime_type || "",
    financed_expense_ids: Array.isArray(entry?.financed_expense_ids) ? entry.financed_expense_ids : []
  };
}

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

function InvoicePreviewModal({ invoice, onClose, onOpenBrowser }) {
  if (!invoice?.url) return null;

  return (
    <div className="admin-modal-backdrop">
      <motion.div className="budget-invoice-modal" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
        <div className="budget-modal-head">
          <div>
            <h2>{invoice.name || "Facture PDF"}</h2>
            <span className="budget-modal-subtitle">Aperçu du document</span>
          </div>
          <div className="budget-invoice-modal-actions">
            <button type="button" onClick={onOpenBrowser} aria-label="Ouvrir dans le navigateur">
              <Download aria-hidden="true" />
            </button>
            <button type="button" onClick={onClose} aria-label="Fermer">
              <X aria-hidden="true" />
            </button>
          </div>
        </div>
        <iframe className="budget-invoice-frame" src={invoice.url} title={invoice.name || "Facture PDF"} />
      </motion.div>
    </div>
  );
}

function InvoiceUploader({ file, form, error, isRequired, onFileChange, onRemove, onPreview, onOpenBrowser }) {
  const inputRef = useRef(null);
  const hasInvoice = Boolean(file || form.invoice_path);
  const name = file?.name || form.invoice_name;
  const size = file?.size || form.invoice_size;

  return (
    <div className={`budget-invoice-uploader ${isRequired && !hasInvoice ? "is-missing" : ""}`}>
      <button className="budget-invoice-tile" type="button" onClick={() => inputRef.current?.click()} aria-label={hasInvoice ? "Remplacer la facture" : "Ajouter une facture"}>
        {hasInvoice ? <FileText aria-hidden="true" /> : <Upload aria-hidden="true" />}
      </button>
      <div className="budget-invoice-copy">
        <strong>{hasInvoice ? name : "Aucune facture PDF"}</strong>
        <p>{hasInvoice ? (formatFileSize(size) || "PDF enregistré") : (isRequired ? "Ajoute une facture pour compléter le suivi." : "PDF optionnel pour cette entrée.")}</p>
        <span className="budget-invoice-actions">
          <button type="button" onClick={() => inputRef.current?.click()}>{hasInvoice ? "Remplacer" : "Ajouter"}</button>
          {hasInvoice ? <button type="button" onClick={onPreview}>Visualiser</button> : null}
          {form.invoice_path ? <button type="button" onClick={onOpenBrowser}>Ouvrir dans le navigateur</button> : null}
          {hasInvoice ? <button className="budget-invoice-remove" type="button" onClick={onRemove}>Supprimer</button> : null}
        </span>
        {error ? <small>{error}</small> : null}
      </div>
      <input ref={inputRef} type="file" accept="application/pdf,.pdf" onChange={(event) => onFileChange(event.target.files?.[0] || null, event)} />
    </div>
  );
}

function EntryForm({ entry, entries, onClose, onSave }) {
  const [form, setForm] = useState(() => normalizeEntry(entry));
  const [invoiceFile, setInvoiceFile] = useState(null);
  const [previewInvoice, setPreviewInvoice] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const categories = getCategoriesForType(form.type);
  const isPersonalCapital = form.type === "income" && form.category === "personal_capital";
  const expenseOptions = useMemo(() => entries
    .map(normalizeEntry)
    .filter((item) => item.type === "expense" && item.id !== form.id), [entries, form.id]);
  const statusOptions = Object.entries(getStatusesForEntry(form.type, form.category))
    .map(([value, status]) => ({ value, label: status.label }));

  function update(patch) {
    setForm((current) => ({ ...current, ...patch }));
  }

  function updateType(type) {
    const category = DEFAULT_CATEGORY_BY_TYPE[type];
    update({
      type,
      category,
      status: getDefaultStatus(type, category),
      vendor: type === "income" && category === "personal_capital" ? "" : form.vendor,
      financed_expense_ids: type === "income" && category === "personal_capital" ? form.financed_expense_ids : []
    });
  }

  function updateCategory(category) {
    update({
      category,
      status: normalizeStatus(form.type, category, form.status),
      vendor: form.type === "income" && category === "personal_capital" ? "" : form.vendor,
      financed_expense_ids: form.type === "income" && category === "personal_capital" ? form.financed_expense_ids : []
    });
  }

  function toggleFinancedExpense(expenseId) {
    setForm((current) => {
      const ids = new Set(current.financed_expense_ids || []);
      if (ids.has(expenseId)) {
        ids.delete(expenseId);
      } else {
        ids.add(expenseId);
      }
      return { ...current, financed_expense_ids: Array.from(ids) };
    });
  }

  function handleInvoiceFile(file, event) {
    setErrors((current) => ({ ...current, invoice: "" }));
    setInvoiceFile(file);
    if (event) event.target.value = "";
  }

  function removeInvoice() {
    setInvoiceFile(null);
    update({
      invoice_path: "",
      invoice_name: "",
      invoice_size: "",
      invoice_mime_type: ""
    });
  }

  async function previewCurrentInvoice() {
    setErrors((current) => ({ ...current, invoice: "" }));
    if (invoiceFile) {
      const url = URL.createObjectURL(invoiceFile);
      setPreviewInvoice({ url, name: invoiceFile.name, isLocal: true });
      return;
    }

    try {
      const url = await createBudgetInvoiceSignedUrl(form.invoice_path);
      if (url) setPreviewInvoice({ url, name: form.invoice_name || "Facture PDF", isLocal: false });
    } catch (error) {
      setErrors((current) => ({ ...current, invoice: error.message || "Facture inaccessible." }));
    }
  }

  async function openInvoiceInBrowser() {
    if (invoiceFile) {
      window.open(URL.createObjectURL(invoiceFile), "_blank", "noopener,noreferrer");
      return;
    }

    try {
      const url = await createBudgetInvoiceSignedUrl(form.invoice_path);
      if (url) window.open(url, "_blank", "noopener,noreferrer");
    } catch (error) {
      setErrors((current) => ({ ...current, invoice: error.message || "Facture inaccessible." }));
    }
  }

  function closePreview() {
    if (previewInvoice?.isLocal) {
      URL.revokeObjectURL(previewInvoice.url);
    }
    setPreviewInvoice(null);
  }

  useEffect(() => () => {
    if (previewInvoice?.isLocal) {
      URL.revokeObjectURL(previewInvoice.url);
    }
  }, [previewInvoice]);

  async function handleSave() {
    const nextErrors = {};
    if (!form.label.trim()) nextErrors.label = "Intitulé requis.";
    if (form.amount === "" || Number.isNaN(Number(form.amount))) nextErrors.amount = "Montant requis.";
    if (invoiceFile && invoiceFile.type !== "application/pdf") nextErrors.invoice = "La facture doit être un PDF.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setIsSaving(true);
    try {
      const invoiceData = invoiceFile ? await uploadBudgetInvoice(invoiceFile, form.id) : {};
      onSave({
        ...form,
        ...invoiceData,
        label: form.label.trim(),
        amount: Number(form.amount),
        vendor: isPersonalCapital ? "" : form.vendor,
        financed_expense_ids: isPersonalCapital ? form.financed_expense_ids : []
      });
    } catch (error) {
      setErrors({ invoice: error.message || "Upload de la facture impossible." });
      setIsSaving(false);
    }
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
            onChange={updateType}
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
            onChange={updateCategory}
            options={Object.entries(categories).map(([value, category]) => ({ value, label: category.label }))}
          />

          <SegmentedOptions
            label="Statut"
            value={form.status}
            onChange={(status) => update({ status })}
            options={statusOptions}
          />

          <div className={`budget-form-grid ${isPersonalCapital ? "budget-form-grid--single" : ""}`}>
            <label className="budget-field">
              <span>Date</span>
              <KanbanDatePicker value={form.date || ""} onChange={(date) => update({ date })} placeholder="JJ/MM/AA" />
            </label>
            {!isPersonalCapital ? (
              <label className="budget-field">
                <span>Fournisseur / Source</span>
                <input value={form.vendor} onChange={(event) => update({ vendor: event.target.value })} placeholder="ex: Unity Asset Store" />
              </label>
            ) : null}
          </div>

          <div className="budget-field">
            <span>Facture PDF</span>
            <InvoiceUploader
              file={invoiceFile}
              form={form}
              error={errors.invoice}
              isRequired={form.type === "expense"}
              onFileChange={handleInvoiceFile}
              onRemove={removeInvoice}
              onPreview={previewCurrentInvoice}
              onOpenBrowser={openInvoiceInBrowser}
            />
          </div>

          {isPersonalCapital ? (
            <div className="budget-field">
              <span>Dépenses financées</span>
              {expenseOptions.length ? (
                <div className="budget-linked-expenses">
                  {expenseOptions.map((expense) => (
                    <label className="budget-linked-expense" key={expense.id}>
                      <input
                        type="checkbox"
                        checked={(form.financed_expense_ids || []).includes(expense.id)}
                        onChange={() => toggleFinancedExpense(expense.id)}
                      />
                      <span>
                        <strong>{expense.label || "Dépense sans intitulé"}</strong>
                        <em>{formatCurrency(expense.amount)}{expense.vendor ? ` · ${expense.vendor}` : ""}</em>
                      </span>
                    </label>
                  ))}
                </div>
              ) : (
                <small className="budget-field-hint">Aucune dépense disponible à lier.</small>
              )}
            </div>
          ) : null}

          <label className="budget-field">
            <span>Notes</span>
            <textarea value={form.notes} onChange={(event) => update({ notes: event.target.value })} placeholder="Annotations libres..." />
          </label>
        </div>

        <div className="budget-modal-actions">
          <button className="admin-button admin-button--primary" type="button" onClick={handleSave} disabled={isSaving}>
            {isSaving ? <Upload aria-hidden="true" /> : <Save aria-hidden="true" />} {isSaving ? "Enregistrement..." : (entry ? "Enregistrer" : "Créer")}
          </button>
          <button className="admin-button" type="button" onClick={onClose} disabled={isSaving}>Annuler</button>
        </div>
      </motion.div>
      <AnimatePresence>
        {previewInvoice ? (
          <InvoicePreviewModal invoice={previewInvoice} onClose={closePreview} onOpenBrowser={openInvoiceInBrowser} />
        ) : null}
      </AnimatePresence>
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

function EntryRow({ entry, entries, onEdit, onDelete }) {
  const normalizedEntry = normalizeEntry(entry);
  const expenseLookup = useMemo(() => new Map(entries.map(normalizeEntry).filter((item) => item.type === "expense").map((item) => [item.id, item])), [entries]);
  const category = ALL_CATEGORIES[normalizedEntry.category] || EXPENSE_CATEGORIES.assets_graphics;
  const status = ALL_STATUSES[normalizedEntry.status] || EXPENSE_STATUSES.planned;
  const StatusIcon = status.icon;
  const isMissingInvoice = normalizedEntry.type === "expense" && !normalizedEntry.invoice_path;
  const financedExpenses = normalizedEntry.type === "income" && normalizedEntry.category === "personal_capital"
    ? (normalizedEntry.financed_expense_ids || []).map((id) => expenseLookup.get(id)).filter(Boolean)
    : [];
  const [invoiceError, setInvoiceError] = useState("");

  async function openInvoice(event) {
    event.stopPropagation();
    setInvoiceError("");
    const invoiceWindow = window.open("", "_blank", "noopener,noreferrer");
    try {
      const url = await createBudgetInvoiceSignedUrl(normalizedEntry.invoice_path);
      if (url && invoiceWindow) {
        invoiceWindow.location.href = url;
      } else if (url) {
        window.location.href = url;
      }
    } catch (error) {
      if (invoiceWindow) invoiceWindow.close();
      setInvoiceError(error.message || "Facture inaccessible.");
    }
  }

  return (
    <motion.article className={`budget-row ${isMissingInvoice ? "is-missing-invoice" : ""}`} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => onEdit(normalizedEntry)}>
      <span className="budget-row-dot" style={{ background: category.color }} aria-hidden="true" />
      <span className="budget-row-main">
        <span className="budget-row-title">
          {isMissingInvoice ? <AlertTriangle className="budget-row-alert" aria-label="Facture manquante" /> : null}
          <strong>{normalizedEntry.label}</strong>
          {normalizedEntry.vendor ? <em>{normalizedEntry.vendor}</em> : null}
        </span>
        <span className="budget-row-meta">
          <span>{category.label}</span>
          {normalizedEntry.date ? <span>{new Date(`${normalizedEntry.date}T00:00:00`).toLocaleDateString("fr-FR")}</span> : null}
          {normalizedEntry.invoice_path ? (
            <button className="budget-invoice-link" type="button" onClick={openInvoice}>
              Facture <Download aria-hidden="true" />
            </button>
          ) : isMissingInvoice ? (
            <span className="budget-missing-invoice-label">Facture manquante</span>
          ) : null}
          {financedExpenses.length ? (
            <span className="budget-financed-summary">
              Finance {financedExpenses.length} dépense{financedExpenses.length > 1 ? "s" : ""} · {formatCurrency(financedExpenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0))}
            </span>
          ) : null}
          {invoiceError ? <span className="budget-row-error">{invoiceError}</span> : null}
          {normalizedEntry.notes ? <span>{normalizedEntry.notes}</span> : null}
        </span>
      </span>
      <span className="budget-row-side">
        <span className={`budget-status ${status.className}`}>
          <StatusIcon aria-hidden="true" /> {status.label}
        </span>
        <strong className={normalizedEntry.type === "income" ? "budget-amount--income" : ""}>
          {normalizedEntry.type === "income" ? "+" : "-"}{formatCurrency(normalizedEntry.amount)}
        </strong>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onDelete(normalizedEntry);
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

function DeleteBudgetEntryDialog({ entry, onCancel, onConfirm, isDeleting }) {
  const normalizedEntry = normalizeEntry(entry);
  const category = ALL_CATEGORIES[normalizedEntry.category] || EXPENSE_CATEGORIES.assets_graphics;
  const status = ALL_STATUSES[normalizedEntry.status] || EXPENSE_STATUSES.planned;
  const StatusIcon = status.icon;

  return (
    <div className="admin-modal-backdrop">
      <motion.div className="admin-modal admin-modal--narrow" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
        <div className="admin-modal-head">
          <div>
            <h2>Supprimer l'entrée</h2>
            <span className="admin-modal-subtitle">Cette action retire l'entrée du cloud.</span>
          </div>
          <button type="button" onClick={onCancel} aria-label="Fermer">
            <X aria-hidden="true" />
          </button>
        </div>
        <div className="admin-delete-body">
          <span className="admin-delete-icon">
            <Trash2 aria-hidden="true" />
          </span>
          <div className="admin-delete-copy">
            <span>Entrée sélectionnée</span>
            <strong>{normalizedEntry.label || "Entrée sans intitulé"}</strong>
            <em>{normalizedEntry.type === "income" ? "+" : "-"}{formatCurrency(normalizedEntry.amount)}</em>
          </div>
        </div>
        <div className="admin-delete-meta">
          <span>{category.label}</span>
          <span className={`budget-status ${status.className}`}>
            <StatusIcon aria-hidden="true" /> {status.label}
          </span>
        </div>
        <div className="admin-modal-actions">
          <button className="admin-button admin-button--danger" type="button" onClick={onConfirm} disabled={isDeleting}>
            <Trash2 aria-hidden="true" /> {isDeleting ? "Suppression..." : "Supprimer"}
          </button>
          <button className="admin-button" type="button" onClick={onCancel} disabled={isDeleting}>Annuler</button>
        </div>
      </motion.div>
    </div>
  );
}

export default function Budget() {
  const [entries, setEntries] = useStoredBudgetEntries();
  const deleteStoredBudgetEntry = useDeleteStoredBudgetEntry();
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [entryToDelete, setEntryToDelete] = useState(null);
  const [isDeletingEntry, setIsDeletingEntry] = useState(false);
  const [filterType, setFilterType] = useState("all");
  const [view, setView] = useState("list");

  const normalizedEntries = useMemo(() => entries.map(normalizeEntry), [entries]);
  const totalExpenses = normalizedEntries.filter((entry) => entry.type === "expense" && entry.status !== "cancelled").reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
  const totalIncome = normalizedEntries.filter((entry) => entry.type === "income").reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
  const paidExpenses = normalizedEntries.filter((entry) => entry.type === "expense" && entry.status === "paid").reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
  const planned = normalizedEntries.filter((entry) => entry.type === "expense" && entry.status === "planned").reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
  const missingInvoices = normalizedEntries.filter((entry) => entry.type === "expense" && !entry.invoice_path).length;
  const personalCapitalDue = normalizedEntries
    .filter((entry) => entry.type === "income" && entry.category === "personal_capital" && entry.status === "reimbursement_pending")
    .reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
  const balance = totalIncome - totalExpenses;

  const byCategory = useMemo(() => {
    const categoryMap = {};
    normalizedEntries
      .filter((entry) => entry.type === "expense" && entry.status !== "cancelled")
      .forEach((entry) => {
        categoryMap[entry.category] = (categoryMap[entry.category] || 0) + Number(entry.amount || 0);
      });
    return Object.entries(categoryMap).sort((a, b) => b[1] - a[1]);
  }, [normalizedEntries]);

  const filteredEntries = normalizedEntries.filter((entry) => {
    if (filterType !== "all" && entry.type !== filterType) return false;
    return true;
  });

  function saveEntry(form) {
    if (editingEntry) {
      setEntries((current) => current.map((entry) => entry.id === editingEntry.id ? { ...entry, ...form } : entry));
      if (editingEntry.invoice_path && editingEntry.invoice_path !== form.invoice_path) {
        deleteBudgetInvoice(editingEntry.invoice_path);
      }
    } else {
      setEntries((current) => [{ ...form, id: form.id || createAdminId("budget") }, ...current]);
    }
    setShowForm(false);
    setEditingEntry(null);
  }

  async function deleteEntry(id) {
    const entry = normalizedEntries.find((item) => item.id === id);
    setEntries((current) => current.filter((entry) => entry.id !== id));
    if (entry?.invoice_path) {
      await deleteBudgetInvoice(entry.invoice_path);
    }
    await deleteStoredBudgetEntry(id);
  }

  async function confirmDeleteEntry() {
    if (!entryToDelete) return;
    setIsDeletingEntry(true);
    await deleteEntry(entryToDelete.id);
    setIsDeletingEntry(false);
    setEntryToDelete(null);
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
            <p>{normalizedEntries.length} entrée{normalizedEntries.length !== 1 ? "s" : ""}</p>
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
          <BudgetStatCard label="À payer" value={formatCurrency(planned)} sub={`${normalizedEntries.filter((entry) => entry.status === "planned").length} entrées`} tone="amber" icon={Clock} />
          <BudgetStatCard label="Factures manquantes" value={missingInvoices} sub={missingInvoices ? "Entrées à compléter" : "Suivi complet"} tone={missingInvoices ? "red" : "green"} icon={AlertTriangle} />
          <BudgetStatCard label="Capital à rembourser" value={formatCurrency(personalCapitalDue)} sub="Capital personnel non remboursé" tone="amber" icon={RotateCcw} />
        </section>

        {view === "chart" ? (
          <section className="budget-chart-card">
            <h2>Répartition des dépenses par catégorie</h2>
            {byCategory.length ? (
              <div className="budget-chart-list">
                {byCategory.map(([categoryKey, amount]) => {
                  const category = ALL_CATEGORIES[categoryKey] || EXPENSE_CATEGORIES.assets_graphics;
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
        </section>

        {filteredEntries.length ? (
          <section className="budget-list">
            <AnimatePresence>
              {filteredEntries.map((entry) => (
                <EntryRow key={entry.id} entry={entry} entries={normalizedEntries} onEdit={(nextEntry) => { setEditingEntry(nextEntry); setShowForm(true); }} onDelete={setEntryToDelete} />
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
          <EntryForm entry={editingEntry} entries={normalizedEntries} onClose={() => { setShowForm(false); setEditingEntry(null); }} onSave={saveEntry} />
        ) : null}
      </AnimatePresence>
      <AnimatePresence>
        {entryToDelete ? (
          <DeleteBudgetEntryDialog entry={entryToDelete} onCancel={() => setEntryToDelete(null)} onConfirm={confirmDeleteEntry} isDeleting={isDeletingEntry} />
        ) : null}
      </AnimatePresence>
    </main>
  );
}
