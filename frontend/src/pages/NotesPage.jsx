import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import PageHeader from "../components/common/PageHeader";
import Button from "../components/common/Button";
import NoteCard from "../components/notes/NoteCard";
import NoteEditorDrawer from "../components/notes/NoteEditorDrawer";
import { noteApi } from "../api/noteApi";

const NotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [search, setSearch] = useState("");

  const loadNotes = async () => {
    const data = await noteApi.getAll(search ? { search } : {});
    setNotes(data.notes);
  };

  useEffect(() => {
    loadNotes();
  }, [search]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Knowledge"
        title="Notes that stay close to the work"
        description="Capture ideas, pin references, and connect rich-text notes to your active execution system."
        action={
          <Button
            onClick={() => {
              setSelectedNote(null);
              setDrawerOpen(true);
            }}
          >
            <Plus size={16} className="mr-2" />
            New note
          </Button>
        }
      />

      <input
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search notes"
        className="w-full rounded-[28px] border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
      />

      <div className="grid gap-5 xl:grid-cols-2">
        {notes.map((note) => (
          <NoteCard
            key={note._id}
            note={note}
            onEdit={(item) => {
              setSelectedNote(item);
              setDrawerOpen(true);
            }}
            onDelete={async (id) => {
              await noteApi.remove(id);
              setNotes((current) => current.filter((item) => item._id !== id));
            }}
            onPin={async (id) => {
              const data = await noteApi.togglePin(id);
              setNotes((current) => current.map((item) => (item._id === id ? data.note : item)));
            }}
          />
        ))}
      </div>

      <NoteEditorDrawer
        open={drawerOpen}
        note={selectedNote}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedNote(null);
        }}
        onSubmit={async (payload) => {
          if (selectedNote) {
            const data = await noteApi.update(selectedNote._id, payload);
            setNotes((current) => current.map((item) => (item._id === data.note._id ? data.note : item)));
            return;
          }
          const data = await noteApi.create(payload);
          setNotes((current) => [data.note, ...current]);
        }}
      />
    </div>
  );
};

export default NotesPage;
