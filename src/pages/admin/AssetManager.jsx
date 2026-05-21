import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  Copy,
  ExternalLink,
  ImageIcon,
  Package,
  Plus,
  Save,
  Search,
  Trash2,
  X
} from "lucide-react";
import {
  ASSET_CATEGORIES,
  MILESTONE_CONFIG,
  STATUS_CONFIG
} from "../../admin/adminConfig";
import { uploadAdminSprite } from "../../admin/adminCloudStorage";
import { createAdminId } from "../../admin/adminStorage";
import { useDeleteStoredAsset, useStoredAssets } from "../../admin/useStoredAdminData";

const CATEGORIES_ALL = ["Toutes", ...ASSET_CATEGORIES];
const STATUSES_ALL = ["Tous", "missing", "found_pack", "temporary", "done"];
const ASSET_SORTER = new Intl.Collator("fr", { numeric: true, sensitivity: "base" });

function normalizeSearch(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function sortAssets(left, right) {
  return (
    ASSET_SORTER.compare(left.category ?? "", right.category ?? "") ||
    ASSET_SORTER.compare(left.subcategory ?? "", right.subcategory ?? "") ||
    ASSET_SORTER.compare(left.name_en ?? "", right.name_en ?? "")
  );
}

function SpriteUploader({ value, assetId, onChange }) {
  const inputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [compressionInfo, setCompressionInfo] = useState(null);
  const [uploadError, setUploadError] = useState("");

  async function handleFileChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setCompressionInfo(null);
    setUploadError("");

    try {
      const upload = await uploadAdminSprite(file, assetId);
      onChange(upload);
      if (upload.sizeBefore && upload.sizeAfter) {
        const saved = Math.max(0, Math.round((1 - upload.sizeAfter / upload.sizeBefore) * 100));
        setCompressionInfo(`${Math.round(upload.sizeAfter / 1024)} Ko · -${saved}%`);
      }
    } catch (error) {
      console.error("Unable to process sprite", error);
      setUploadError(error.message || "Upload impossible.");
    } finally {
      setIsLoading(false);
      event.target.value = "";
    }
  }

  return (
    <div className="admin-sprite-uploader">
      <button className="admin-sprite-button" type="button" onClick={() => inputRef.current?.click()}>
        {isLoading ? (
          <span className="admin-sprite-loader" aria-hidden="true" />
        ) : value ? (
          <img src={value} alt="Sprite importé" />
        ) : (
          <ImageIcon aria-hidden="true" />
        )}
      </button>
      <div className="admin-sprite-copy">
        <button type="button" onClick={() => inputRef.current?.click()}>
          {value ? "Changer l'image" : "Uploader un sprite PNG"}
        </button>
        {value ? (
          <button className="admin-sprite-remove" type="button" onClick={() => onChange(null)}>
            Supprimer
          </button>
        ) : null}
        <p>{uploadError || compressionInfo || "PNG, JPG, WebP · compressé avant sauvegarde"}</p>
      </div>
      <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={handleFileChange} />
    </div>
  );
}

function AssetForm({ asset, onClose, onSave }) {
  const [form, setForm] = useState(
    asset
      ? { ...asset }
      : {
          id: createAdminId("asset"),
          name_en: "",
          name_fr: "",
          category: "Basics",
          subcategory: "",
          status: "missing",
          milestone: "vertical_slice",
          pack_url: "",
          pack_name: "",
          notes: "",
          icon_name: "",
          icon_path: ""
        }
  );
  const [errors, setErrors] = useState({});

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function updateFields(fields) {
    setForm((current) => ({ ...current, ...fields }));
  }

  function handleSave() {
    const nextErrors = {};
    if (!form.name_en.trim()) nextErrors.name_en = "Nom requis.";
    if (!form.milestone) nextErrors.milestone = "Jalon requis.";
    if (form.status === "found_pack" && !form.pack_url.trim()) nextErrors.pack_url = "Lien requis pour un pack trouvé.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    onSave(form);
  }

  return (
    <div className="admin-modal-backdrop">
      <motion.div className="admin-modal" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
        <div className="admin-modal-head">
          <h2>{asset ? "Modifier l'asset" : "Nouvel asset"}</h2>
          <button type="button" onClick={onClose} aria-label="Fermer">
            <X aria-hidden="true" />
          </button>
        </div>

        <div className="admin-form-grid">
          <label>
            <span>Nom anglais *</span>
            <input value={form.name_en} onChange={(event) => updateField("name_en", event.target.value)} placeholder="ex: Basket Press" />
            {errors.name_en ? <small>{errors.name_en}</small> : null}
          </label>
          <label>
            <span>Nom français</span>
            <input value={form.name_fr} onChange={(event) => updateField("name_fr", event.target.value)} placeholder="ex: Pressoir à panier" />
          </label>
          <label>
            <span>Catégorie</span>
            <select value={form.category} onChange={(event) => updateField("category", event.target.value)}>
              {ASSET_CATEGORIES.map((category) => <option key={category}>{category}</option>)}
            </select>
          </label>
          <label>
            <span>Sous-catégorie</span>
            <input value={form.subcategory} onChange={(event) => updateField("subcategory", event.target.value)} placeholder="ex: Pressing" />
          </label>
          <label>
            <span>Statut</span>
            <select value={form.status} onChange={(event) => updateField("status", event.target.value)}>
              {Object.entries(STATUS_CONFIG).map(([key, value]) => <option key={key} value={key}>{value.label}</option>)}
            </select>
          </label>
          <label>
            <span>Jalon *</span>
            <select value={form.milestone} onChange={(event) => updateField("milestone", event.target.value)}>
              {Object.entries(MILESTONE_CONFIG).map(([key, value]) => <option key={key} value={key}>{value.fullLabel}</option>)}
            </select>
            {errors.milestone ? <small>{errors.milestone}</small> : null}
          </label>
          <label className="admin-form-wide">
            <span>Image / Sprite</span>
            <SpriteUploader
              value={form.icon_name}
              assetId={form.id}
              onChange={(upload) => {
                if (!upload) {
                  updateFields({ icon_name: "", icon_path: "" });
                  return;
                }

                updateFields({ icon_name: upload.url, icon_path: upload.path ?? "" });
              }}
            />
          </label>
          <label>
            <span>Nom du pack</span>
            <input value={form.pack_name} onChange={(event) => updateField("pack_name", event.target.value)} placeholder="ex: Synty POLYGON Farm" />
          </label>
          <label>
            <span>Lien pack</span>
            <input value={form.pack_url} onChange={(event) => updateField("pack_url", event.target.value)} placeholder="https://..." />
            {errors.pack_url ? <small>{errors.pack_url}</small> : null}
          </label>
          <label className="admin-form-wide">
            <span>Notes</span>
            <textarea value={form.notes} onChange={(event) => updateField("notes", event.target.value)} placeholder="Annotations libres..." />
          </label>
        </div>

        <div className="admin-modal-actions">
          <button className="admin-button admin-button--primary" type="button" onClick={handleSave}>
            <Save aria-hidden="true" /> {asset ? "Enregistrer" : "Créer"}
          </button>
          <button className="admin-button" type="button" onClick={onClose}>Annuler</button>
        </div>
      </motion.div>
    </div>
  );
}

function AssetRow({ asset, onEdit, onDuplicate, onDelete }) {
  const status = STATUS_CONFIG[asset.status] ?? STATUS_CONFIG.missing;
  const StatusIcon = status.icon;
  const milestone = asset.milestone ? MILESTONE_CONFIG[asset.milestone] : null;

  return (
    <motion.article className="admin-row" layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={onEdit}>
      <span className="admin-row-thumb">
        {asset.icon_name ? <img src={asset.icon_name} alt="" /> : <ImageIcon aria-hidden="true" />}
      </span>
      <span className="admin-row-main">
        <span className="admin-row-title-line">
          <strong>{asset.name_en}</strong>
          {asset.name_fr ? <em>({asset.name_fr})</em> : null}
        </span>
        <span className="admin-row-subline">
          <span>{asset.subcategory || asset.category}</span>
          {milestone ? <span className={`admin-badge admin-badge--compact ${milestone.className}`}>{milestone.label}</span> : null}
          {asset.pack_name && asset.pack_url ? (
            <a className="admin-pack-link" href={asset.pack_url} target="_blank" rel="noopener noreferrer" onClick={(event) => event.stopPropagation()}>
              {asset.pack_name} <ExternalLink aria-hidden="true" />
            </a>
          ) : null}
          {asset.notes ? <span className="admin-row-note">{asset.notes}</span> : null}
        </span>
      </span>
      <span className="admin-row-actions">
        <span className={`admin-badge ${status.className}`}>
          <StatusIcon aria-hidden="true" /> {status.label}
        </span>
        <button className="admin-row-tool" type="button" onClick={(event) => { event.stopPropagation(); onDuplicate(asset); }} aria-label="Dupliquer">
          <Copy aria-hidden="true" />
        </button>
        <button className="admin-row-tool admin-row-tool--danger" type="button" onClick={(event) => { event.stopPropagation(); onDelete(asset.id); }} aria-label="Supprimer">
          <Trash2 aria-hidden="true" />
        </button>
      </span>
    </motion.article>
  );
}

function DeleteAssetDialog({ asset, onCancel, onConfirm, isDeleting }) {
  const status = STATUS_CONFIG[asset.status] ?? STATUS_CONFIG.missing;
  const StatusIcon = status.icon;

  return (
    <div className="admin-modal-backdrop">
      <motion.div className="admin-modal admin-modal--narrow" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
        <div className="admin-modal-head">
          <div>
            <h2>Supprimer l'asset</h2>
            <span className="admin-modal-subtitle">Cette action retire l'asset du cloud.</span>
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
            <span>Asset sélectionné</span>
            <strong>{asset.name_en}</strong>
            {asset.name_fr ? <em>{asset.name_fr}</em> : null}
          </div>
        </div>
        <div className="admin-delete-meta">
          <span>{asset.subcategory || asset.category}</span>
          <span className={`admin-badge admin-badge--compact ${status.className}`}>
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

export default function AssetManager() {
  const [assets, setAssets] = useStoredAssets();
  const deleteStoredAsset = useDeleteStoredAsset();
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("Toutes");
  const [filterStatus, setFilterStatus] = useState("Tous");
  const [filterMilestone, setFilterMilestone] = useState("all");
  const [editingAsset, setEditingAsset] = useState(null);
  const [deletingAsset, setDeletingAsset] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const filtered = useMemo(() => assets.filter((asset) => {
    const query = normalizeSearch(search.trim());
    const searchable = normalizeSearch([
      asset.name_en,
      asset.name_fr,
      asset.category,
      asset.subcategory
    ].filter(Boolean).join(" "));
    const matchSearch = !query || searchable.includes(query);
    const matchCat = filterCat === "Toutes" || asset.category === filterCat;
    const matchStatus = filterStatus === "Tous" || asset.status === filterStatus;
    const matchMilestone = filterMilestone === "all" || asset.milestone === filterMilestone;
    return matchSearch && matchCat && matchStatus && matchMilestone;
  }).sort(sortAssets), [assets, filterCat, filterMilestone, filterStatus, search]);

  const grouped = filtered.reduce((acc, asset) => {
    const key = asset.subcategory || asset.category;
    if (!acc[key]) acc[key] = [];
    acc[key].push(asset);
    return acc;
  }, {});
  const done = assets.filter((asset) => asset.status === "done").length;
  const progress = assets.length ? Math.round((done / assets.length) * 100) : 0;

  function saveAsset(form) {
    if (editingAsset) {
      setAssets((current) => current.map((asset) => asset.id === editingAsset.id ? { ...asset, ...form } : asset));
    } else {
      setAssets((current) => [{ ...form, id: form.id ?? createAdminId("asset") }, ...current]);
    }
    setShowForm(false);
    setEditingAsset(null);
  }

  function duplicateAsset(asset) {
    const nextAsset = {
      ...asset,
      id: createAdminId("asset"),
      name_en: `${asset.name_en || "Asset"} copy`,
      name_fr: asset.name_fr ? `${asset.name_fr} copie` : "",
      icon_path: asset.icon_path ?? ""
    };

    setAssets((current) => [nextAsset, ...current]);
  }

  async function confirmDeleteAsset() {
    if (!deletingAsset) return;

    setIsDeleting(true);
    const result = await deleteStoredAsset(deletingAsset.id);

    if (result.ok) {
      setAssets((current) => current.filter((asset) => asset.id !== deletingAsset.id));
      setDeletingAsset(null);
    }

    setIsDeleting(false);
  }

  return (
    <main className="admin-shell">
      <div className="admin-container">
        <header className="admin-page-head">
          <Link to="/equipe" className="admin-back-link" aria-label="Retour">
            <ChevronLeft aria-hidden="true" />
          </Link>
          <span className="admin-page-icon admin-tool-icon--blue"><Package aria-hidden="true" /></span>
          <div>
            <h1>Asset Manager</h1>
            <p>{assets.length} assets · {progress}% terminés</p>
          </div>
          <button className="admin-button admin-button--primary admin-head-action" type="button" onClick={() => { setEditingAsset(null); setShowForm(true); }}>
            <Plus aria-hidden="true" /> Nouvel asset
          </button>
        </header>

        <section className="admin-progress-card">
          <div className="admin-progress-head">
            <span>Progression globale</span>
            <strong>{done}/{assets.length} terminés</strong>
          </div>
          <div className="admin-progress-track">
            <motion.span initial={{ width: 0 }} animate={{ width: `${progress}%` }} />
          </div>
          <div className="admin-status-row">
            {Object.entries(STATUS_CONFIG).map(([key, status]) => (
              <span className={`admin-badge ${status.className}`} key={key}>
                {assets.filter((asset) => asset.status === key).length} {status.label}
              </span>
            ))}
          </div>
        </section>

        <section className="admin-filter-row">
          <label className="admin-search">
            <Search aria-hidden="true" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Rechercher..." />
          </label>
          <select value={filterCat} onChange={(event) => setFilterCat(event.target.value)}>
            {CATEGORIES_ALL.map((category) => <option key={category}>{category}</option>)}
          </select>
          <select value={filterStatus} onChange={(event) => setFilterStatus(event.target.value)}>
            {STATUSES_ALL.map((status) => <option key={status} value={status}>{status === "Tous" ? "Tous statuts" : STATUS_CONFIG[status]?.label}</option>)}
          </select>
          <select value={filterMilestone} onChange={(event) => setFilterMilestone(event.target.value)}>
            <option value="all">Tous jalons</option>
            {Object.entries(MILESTONE_CONFIG).map(([key, milestone]) => <option key={key} value={key}>{milestone.fullLabel}</option>)}
          </select>
        </section>

        <section className="admin-list-stack">
          {Object.keys(grouped).length ? Object.entries(grouped).map(([group, items]) => (
            <div key={group}>
              <h2 className="admin-group-title">{group} <span>({items.length})</span></h2>
              <div className="admin-list-stack">
                {items.map((asset) => (
                  <AssetRow
                    key={asset.id}
                    asset={asset}
                    onEdit={() => { setEditingAsset(asset); setShowForm(true); }}
                    onDuplicate={duplicateAsset}
                    onDelete={() => setDeletingAsset(asset)}
                  />
                ))}
              </div>
            </div>
          )) : (
            <div className="admin-empty-state">
              <Package aria-hidden="true" />
              <p>Aucun asset trouvé</p>
            </div>
          )}
        </section>
      </div>

      <AnimatePresence>
        {showForm ? (
          <AssetForm asset={editingAsset} onClose={() => { setShowForm(false); setEditingAsset(null); }} onSave={saveAsset} />
        ) : null}
        {deletingAsset ? (
          <DeleteAssetDialog
            asset={deletingAsset}
            onCancel={() => setDeletingAsset(null)}
            onConfirm={confirmDeleteAsset}
            isDeleting={isDeleting}
          />
        ) : null}
      </AnimatePresence>
    </main>
  );
}
