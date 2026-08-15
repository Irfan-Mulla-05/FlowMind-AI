import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Button from "../common/Button";

const defaultValues = {
  title: "",
  description: "",
  priority: "medium",
  category: "General",
  dueDate: "",
  preferredSlot: "morning",
  energyLevel: "normal",
  estimatedDuration: 45,
  important: false
};

const TaskFormDrawer = ({ open, onClose, onSubmit, task }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { register, handleSubmit, reset } = useForm({ defaultValues });

  useEffect(() => {
    reset(
      task
        ? {
            ...task,
            dueDate: task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 16) : ""
          }
        : defaultValues
    );
  }, [task, reset]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-sm">
      <div className="h-full w-full max-w-xl overflow-y-auto border-l border-white/10 bg-slate-950 p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">{task ? "Edit task" : "Create task"}</h2>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
        <form
          className="space-y-4"
          onSubmit={handleSubmit(async (values) => {
            await onSubmit(values);
            onClose();
            reset(defaultValues);
          })}
        >
          <input
            {...register("title", { required: true })}
            placeholder="Task title"
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
          />
          <textarea
            {...register("description")}
            placeholder="Description"
            rows="4"
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
          />
          <button
            type="button"
            className="text-sm text-brand-300"
            onClick={() => setShowAdvanced((value) => !value)}
          >
            {showAdvanced ? "Hide advanced fields" : "Show advanced fields"}
          </button>

          {showAdvanced && (
            <div className="grid gap-4 md:grid-cols-2">
              <select {...register("priority")} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
              <input {...register("category")} placeholder="Category" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
              <input {...register("dueDate")} type="datetime-local" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
              <input
                {...register("estimatedDuration", { valueAsNumber: true })}
                type="number"
                min="15"
                step="15"
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white"
              />
              <select {...register("preferredSlot")} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white">
                <option value="morning">Morning</option>
                <option value="afternoon">Afternoon</option>
                <option value="evening">Evening</option>
                <option value="night">Night</option>
              </select>
              <select {...register("energyLevel")} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white">
                <option value="low">Low Energy</option>
                <option value="normal">Normal</option>
                <option value="high">High Energy</option>
              </select>
            </div>
          )}

          <Button type="submit" className="w-full">
            {task ? "Save changes" : "Create task"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default TaskFormDrawer;
