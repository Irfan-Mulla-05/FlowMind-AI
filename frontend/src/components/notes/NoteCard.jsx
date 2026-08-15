import { Pin, Trash2 } from "lucide-react";
import Card from "../common/Card";
import Button from "../common/Button";

const NoteCard = ({ note, onEdit, onDelete, onPin }) => (
  <Card className="space-y-4">
    <div className="flex items-start justify-between gap-3">
      <div>
        <h3 className="text-lg font-semibold text-white">{note.title}</h3>
        <div className="mt-2 flex flex-wrap gap-2">
          {note.tags?.map((tag) => (
            <span key={tag} className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-400">
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="flex gap-2">
        <Button variant="ghost" className="px-3 py-2" onClick={() => onPin(note._id)}>
          <Pin size={16} className={note.pinned ? "fill-brand-300 text-brand-300" : ""} />
        </Button>
        <Button variant="ghost" className="px-3 py-2 text-rose-300" onClick={() => onDelete(note._id)}>
          <Trash2 size={16} />
        </Button>
      </div>
    </div>
    <div className="prose prose-invert max-w-none text-sm text-slate-300" dangerouslySetInnerHTML={{ __html: note.content }} />
    <Button variant="secondary" onClick={() => onEdit(note)}>
      Edit note
    </Button>
  </Card>
);

export default NoteCard;
