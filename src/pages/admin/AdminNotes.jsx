import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, Edit2, Pin, Plus, Save, StickyNote, Trash2, X } from "lucide-react";
import { NOTE_CATEGORIES } from "../../admin/adminConfig";
import { createAdminId } from "../../admin/adminStorage";
import { useDeleteStoredNote, useStoredNotes } from "../../admin/useStoredAdminData";

function NoteForm({ note, onClose, onSave }) {
  const [form, setForm] = useState(note ?? { title: "", content: "", category: "general", pinned: false });

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  return (
    <div className="admin-modal-backdrop">
      <motion.div className="admin-modal admin-modal--narrow" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
        <div className="admin-modal-head">
          <h2>{note ? "Modifier la note" : "Nouvelle note"}</h2>
          <button type="button" onClick={onClose} aria-label="Fermer"><X aria-hidden="true" /></button>
        </div>
        <div className="admin-form-grid admin-form-grid--single">
          <label>
            <span>Titre</span>
            <input value={form.title} onChange={(event) => updateField("title", event.target.value)} placeholder="Titre de la note..." />
          </label>
          <label>
            <span>Contenu</span>
            <textarea value={form.content} onChange={(event) => updateField("content", event.target.value)} placeholder="Contenu..." />
          </label>
          <div className="admin-inline-fields">
            <label>
              <span>Catégorie</span>
              <select value={form.category} onChange={(event) => updateField("category", event.target.value)}>
                {Object.entries(NOTE_CATEGORIES).map(([key, value]) => <option key={key} value={key}>{value.label}</option>)}
              </select>
            </label>
            <label className="admin-checkbox">
              <input type="checkbox" checked={form.pinned} onChange={(event) => updateField("pinned", event.target.checked)} />
              <span>Épingler</span>
            </label>
          </div>
        </div>
        <div className="admin-modal-actions">
          <button className="admin-button admin-button--primary" type="button" onClick={() => onSave(form)}>
            <Save aria-hidden="true" /> {note ? "Enregistrer" : "Créer"}
          </button>
          <button className="admin-button" type="button" onClick={onClose}>Annuler</button>
        </div>
      </motion.div>
    </div>
  );
}

function NoteCard({ note, onEdit, onDelete }) {
  const category = NOTE_CATEGORIES[note.category] ?? NOTE_CATEGORIES.general;

  return (
    <motion.article className="admin-note-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="admin-note-head">
        <span className={`admin-badge ${category.className}`}>{category.label}</span>
        {note.pinned ? <Pin className="admin-pin-icon" aria-hidden="true" /> : null}
        <span className="admin-note-actions">
          <button type="button" onClick={() => onEdit(note)} aria-label="Modifier"><Edit2 aria-hidden="true" /></button>
          <button type="button" onClick={() => onDelete(note.id)} aria-label="Supprimer"><Trash2 aria-hidden="true" /></button>
        </span>
      </div>
      <h3>{note.title}</h3>
      <p>{note.content}</p>
      <small>{new Date(note.created_at).toLocaleDateString("fr-FR")}</small>
    </motion.article>
  );
}

export default function AdminNotes() {
  const [notes, setNotes] = useStoredNotes();
  const deleteStoredNote = useDeleteStoredNote();
  const [filterCat, setFilterCat] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  const filtered = useMemo(() => notes.filter((note) => filterCat === "all" || note.category === filterCat), [filterCat, notes]);
  const pinned = filtered.filter((note) => note.pinned);
  const unpinned = filtered.filter((note) => !note.pinned);

  function saveNote(form) {
    if (!form.title.trim() || !form.content.trim()) return;
    if (editingNote) {
      setNotes((current) => current.map((note) => note.id === editingNote.id ? { ...note, ...form } : note));
    } else {
      setNotes((current) => [{ ...form, id: createAdminId("note"), created_at: new Date().toISOString() }, ...current]);
    }
    setShowForm(false);
    setEditingNote(null);
  }

  async function deleteNote(id) {
    const result = await deleteStoredNote(id);
    if (result.ok) {
      setNotes((current) => current.filter((note) => note.id !== id));
    }
  }

  return (
    <main className="admin-shell">
      <div className="admin-container admin-container--narrow">
        <header className="admin-page-head">
          <Link to="/equipe" className="admin-back-link" aria-label="Retour">
            <ChevronLeft aria-hidden="true" />
          </Link>
          <span className="admin-page-icon admin-tool-icon--amber"><StickyNote aria-hidden="true" /></span>
          <div>
            <h1>Notes de production</h1>
            <p>{notes.length} note{notes.length > 1 ? "s" : ""}</p>
          </div>
          <div className="admin-head-actions">
            <select value={filterCat} onChange={(event) => setFilterCat(event.target.value)}>
              <option value="all">Toutes catégories</option>
              {Object.entries(NOTE_CATEGORIES).map(([key, category]) => <option key={key} value={key}>{category.label}</option>)}
            </select>
            <button className="admin-button admin-button--primary" type="button" onClick={() => { setEditingNote(null); setShowForm(true); }}>
              <Plus aria-hidden="true" /> Nouvelle note
            </button>
          </div>
        </header>

        {pinned.length ? (
          <section className="admin-notes-section">
            <h2 className="admin-group-title"><Pin aria-hidden="true" /> Épinglées</h2>
            <div className="admin-notes-grid admin-notes-grid--pinned">
              {pinned.map((note) => (
                <NoteCard key={note.id} note={note} onEdit={(nextNote) => { setEditingNote(nextNote); setShowForm(true); }} onDelete={deleteNote} />
              ))}
            </div>
          </section>
        ) : null}

        <section className="admin-notes-section">
          {pinned.length ? <h2 className="admin-group-title">Autres notes</h2> : null}
          {unpinned.length ? (
            <div className="admin-notes-grid">
              {unpinned.map((note) => (
                <NoteCard key={note.id} note={note} onEdit={(nextNote) => { setEditingNote(nextNote); setShowForm(true); }} onDelete={deleteNote} />
              ))}
            </div>
          ) : (
            <div className="admin-empty-state">
              <StickyNote aria-hidden="true" />
              <p>Aucune note pour l'instant</p>
            </div>
          )}
        </section>
      </div>

      <AnimatePresence>
        {showForm ? (
          <NoteForm note={editingNote} onClose={() => { setShowForm(false); setEditingNote(null); }} onSave={saveNote} />
        ) : null}
      </AnimatePresence>
    </main>
  );
}
