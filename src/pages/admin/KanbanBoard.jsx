import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { ArrowUpDown, ChevronLeft, Layout, Plus, Settings, Trash2, X } from "lucide-react";
import { useDeleteStoredKanbanCard, useStoredKanbanCards, useStoredKanbanSettings } from "../../admin/useStoredAdminData";
import CardForm from "../../components/kanban/CardForm";
import KanbanCard from "../../components/kanban/KanbanCard";
import {
  KANBAN_COLUMNS,
  KANBAN_SORT_OPTIONS,
  sortKanbanCards
} from "../../components/kanban/kanbanConfig";
import KanbanSelect from "../../components/kanban/KanbanSelect";
import KanbanSettings from "../../components/kanban/KanbanSettings";

function KanbanColumn({ column, cards, priorities, tags, onAddCard, onEdit, onDelete, onQuickUpdate, onDropCard, draggingCardId, setDraggingCardId }) {
  return (
    <section
      className={`kanban-column ${draggingCardId ? "is-drop-ready" : ""}`}
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        const cardId = event.dataTransfer.getData("text/plain") || draggingCardId;
        onDropCard(cardId, column.id);
      }}
    >
      <header className="kanban-column-head">
        <span className={column.className} aria-hidden="true" />
        <strong>{column.label}</strong>
        <em>{cards.length}</em>
      </header>

      <div className="kanban-column-body">
        {cards.map((card) => (
          <KanbanCard
            key={card.id}
            card={card}
            priorities={priorities}
            tags={tags}
            onEdit={onEdit}
            onDelete={onDelete}
            onQuickUpdate={onQuickUpdate}
            onDragStart={(event, cardId) => {
              event.dataTransfer.effectAllowed = "move";
              event.dataTransfer.setData("text/plain", cardId);
              setDraggingCardId(cardId);
            }}
            onDragEnd={() => setDraggingCardId(null)}
          />
        ))}

        <button type="button" className="kanban-add-card" onClick={() => onAddCard(column.id)}>
          <Plus aria-hidden="true" /> Ajouter
        </button>
      </div>
    </section>
  );
}

function DeleteCardDialog({ card, onCancel, onConfirm, isDeleting }) {
  return (
    <div className="admin-modal-backdrop">
      <div className="admin-modal admin-modal--narrow">
        <div className="admin-modal-head">
          <div>
            <h2>Supprimer la carte</h2>
            <span className="admin-modal-subtitle">Cette action retire la carte du cloud.</span>
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
            <span>Carte sélectionnée</span>
            <strong>{card.title}</strong>
            {card.description ? <em>{card.description}</em> : null}
          </div>
        </div>
        <div className="admin-modal-actions">
          <button className="admin-button admin-button--danger" type="button" onClick={onConfirm} disabled={isDeleting}>
            <Trash2 aria-hidden="true" /> {isDeleting ? "Suppression..." : "Supprimer"}
          </button>
          <button className="admin-button" type="button" onClick={onCancel} disabled={isDeleting}>Annuler</button>
        </div>
      </div>
    </div>
  );
}

export default function KanbanBoard() {
  const [cards, setCards] = useStoredKanbanCards();
  const [settings, setSettings] = useStoredKanbanSettings();
  const deleteStoredKanbanCard = useDeleteStoredKanbanCard();
  const [showForm, setShowForm] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [deletingCard, setDeletingCard] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [defaultColumn, setDefaultColumn] = useState("todo");
  const [showSettings, setShowSettings] = useState(false);
  const [sortBy, setSortBy] = useState("order");
  const priorities = settings.priorities;
  const tags = settings.tags;
  const [draggingCardId, setDraggingCardId] = useState(null);

  const byColumn = useMemo(() => KANBAN_COLUMNS.reduce((acc, column) => {
    const columnCards = cards.filter((card) => card.column === column.id);
    acc[column.id] = sortKanbanCards(columnCards, sortBy, priorities);
    return acc;
  }, {}), [cards, priorities, sortBy]);

  function openAdd(column) {
    setEditingCard(null);
    setDefaultColumn(column);
    setShowForm(true);
  }

  function openEdit(card) {
    setEditingCard(card);
    setShowForm(true);
  }

  function saveCard(form) {
    if (editingCard) {
      setCards((current) => current.map((card) => card.id === editingCard.id ? { ...card, ...form } : card));
    } else {
      setCards((current) => [{ ...form, order: form.order || Date.now() }, ...current]);
    }
    setShowForm(false);
    setEditingCard(null);
  }

  async function confirmDeleteCard() {
    if (!deletingCard) return;
    setIsDeleting(true);
    const result = await deleteStoredKanbanCard(deletingCard.id);
    if (result.ok) {
      setCards((current) => current.filter((card) => card.id !== deletingCard.id));
      setDeletingCard(null);
    }
    setIsDeleting(false);
  }

  function quickUpdate(id, patch) {
    setCards((current) => current.map((card) => card.id === id ? { ...card, ...patch } : card));
  }

  function dropCard(cardId, columnId) {
    if (!cardId) return;
    const columnCards = cards
      .filter((card) => card.column === columnId && card.id !== cardId)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
    const lastCard = columnCards[columnCards.length - 1];
    quickUpdate(cardId, {
      column: columnId,
      order: lastCard ? (lastCard.order || 0) + 500 : 1000
    });
    setDraggingCardId(null);
  }

  return (
    <main className="kanban-shell">
      <header className="kanban-topbar">
        <Link to="/equipe" className="admin-back-link" aria-label="Retour">
          <ChevronLeft aria-hidden="true" />
        </Link>

        <div className="kanban-title">
          <span className="admin-tool-icon admin-tool-icon--blue">
            <Layout aria-hidden="true" />
          </span>
          <div>
            <h1>Kanban</h1>
            <p>{cards.length} carte{cards.length !== 1 ? "s" : ""}</p>
          </div>
        </div>

        <div className="kanban-column-stats">
          {KANBAN_COLUMNS.map((column) => (
            <span key={column.id}>
              <i className={column.className} aria-hidden="true" />
              {byColumn[column.id]?.length || 0}
            </span>
          ))}
        </div>

        <div className="kanban-sort">
          <ArrowUpDown aria-hidden="true" />
          <KanbanSelect value={sortBy} onChange={setSortBy} options={KANBAN_SORT_OPTIONS} />
        </div>

        <button className="kanban-icon-button" type="button" onClick={() => setShowSettings(true)} aria-label="Paramètres">
          <Settings aria-hidden="true" />
        </button>
        <button className="admin-button admin-button--primary" type="button" onClick={() => openAdd("todo")}>
          <Plus aria-hidden="true" /> Nouvelle carte
        </button>
      </header>

      <div className="kanban-board-scroll">
        <div className="kanban-board">
          {KANBAN_COLUMNS.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              cards={byColumn[column.id] || []}
              priorities={priorities}
              tags={tags}
              onAddCard={openAdd}
              onEdit={openEdit}
              onDelete={(id) => setDeletingCard(cards.find((card) => card.id === id))}
              onQuickUpdate={quickUpdate}
              onDropCard={dropCard}
              draggingCardId={draggingCardId}
              setDraggingCardId={setDraggingCardId}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {showForm ? (
          <CardForm
            card={editingCard}
            defaultColumn={defaultColumn}
            priorities={priorities}
            tags={tags}
            onClose={() => {
              setShowForm(false);
              setEditingCard(null);
            }}
            onSave={saveCard}
          />
        ) : null}
        {showSettings ? (
          <KanbanSettings
            priorities={priorities}
            tags={tags}
            onSave={(nextPriorities, nextTags) => {
              setSettings((current) => ({
                ...current,
                priorities: nextPriorities,
                tags: nextTags
              }));
              setShowSettings(false);
            }}
            onClose={() => setShowSettings(false)}
          />
        ) : null}
        {deletingCard ? (
          <DeleteCardDialog
            card={deletingCard}
            onCancel={() => setDeletingCard(null)}
            onConfirm={confirmDeleteCard}
            isDeleting={isDeleting}
          />
        ) : null}
      </AnimatePresence>
    </main>
  );
}
