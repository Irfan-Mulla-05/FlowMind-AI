import { useEffect, useState } from "react";
import Button from "../common/Button";
import RichTextEditor from "./RichTextEditor";

const NoteEditorDrawer = ({ open, onClose, onSubmit, note }) => {
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [content, setContent] = useState("<p></p>");

  useEffect(() => {
    setTitle(note?.title || "");
    setTags(note?.tags?.join(", ") || "");
    setContent(note?.content || "<p></p>");
  }, [note]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-sm">
      <div className="h-full w-full max-w-2xl overflow-y-auto border-l border-white/10 bg-slate-950 p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">{note ? "Edit note" : "Create note"}</h2>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
        <div className="space-y-4">
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Note title"
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
          />
          <input
            value={tags}
            onChange={(event) => setTags(event.target.value)}
            placeholder="Tags, comma separated"
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
          />
          <RichTextEditor value={content} onChange={setContent} />
          <Button
            className="w-full"
            onClick={async () => {
              await onSubmit({
                title,
                content,
                tags: tags.split(",").map((tag) => tag.trim()).filter(Boolean)
              });
              onClose();
            }}
          >
            Save note
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NoteEditorDrawer;
