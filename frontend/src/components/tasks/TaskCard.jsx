import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Star, Trash2, Copy, CheckCircle2 } from "lucide-react";
import { cn } from "../../utils/cn";
import { formatDate, priorityTone } from "../../utils/format";
import Button from "../common/Button";

const TaskCard = ({ task, onToggleComplete, onToggleImportant, onDelete, onEdit, onDuplicate }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task._id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4"
    >
      <div className="flex items-start gap-3">
        <button className="mt-1 text-slate-500" {...attributes} {...listeners}>
          <GripVertical size={18} />
        </button>
        <button className="mt-0.5 text-brand-300" onClick={() => onToggleComplete(task._id)}>
          <CheckCircle2 size={20} className={cn(task.status === "completed" && "fill-brand-400 text-brand-400")} />
        </button>
        <div className="flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className={cn("font-medium text-white", task.status === "completed" && "line-through text-slate-500")}>
                {task.title}
              </h3>
              {task.description && <p className="mt-1 text-sm text-slate-400">{task.description}</p>}
            </div>
            <span className={`rounded-full px-3 py-1 text-xs ${priorityTone[task.priority] || priorityTone.medium}`}>
              {task.priority}
            </span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
            <span>{task.category}</span>
            <span>{task.preferredSlot}</span>
            <span>{task.estimatedDuration} min</span>
            <span>Due {formatDate(task.dueDate)}</span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="ghost" className="px-3 py-2" onClick={() => onToggleImportant(task._id)}>
              <Star size={16} className={cn(task.important && "fill-amber-300 text-amber-300")} />
            </Button>
            <Button variant="ghost" className="px-3 py-2" onClick={() => onDuplicate(task._id)}>
              <Copy size={16} />
            </Button>
            <Button variant="ghost" className="px-3 py-2" onClick={() => onEdit(task)}>
              Edit
            </Button>
            <Button variant="ghost" className="px-3 py-2 text-rose-300" onClick={() => onDelete(task._id)}>
              <Trash2 size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
