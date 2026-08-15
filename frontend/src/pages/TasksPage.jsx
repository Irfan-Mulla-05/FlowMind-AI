import { useEffect, useMemo, useState } from "react";
import { DndContext, PointerSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import PageHeader from "../components/common/PageHeader";
import Button from "../components/common/Button";
import QuickTaskBar from "../components/tasks/QuickTaskBar";
import TaskCard from "../components/tasks/TaskCard";
import TaskFormDrawer from "../components/tasks/TaskFormDrawer";
import EmptyState from "../components/common/EmptyState";
import { taskApi } from "../api/taskApi";

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const loadTasks = async () => {
    const data = await taskApi.getAll();
    setTasks(data.tasks);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const passesFilter =
        filter === "all" ? true : filter === "completed" ? task.status === "completed" : task.status !== "completed";
      const passesSearch = task.title.toLowerCase().includes(search.toLowerCase());
      return passesFilter && passesSearch;
    });
  }, [tasks, filter, search]);

  const upsertTask = async (values) => {
    if (selectedTask) {
      const data = await taskApi.update(selectedTask._id, values);
      setTasks((current) => current.map((task) => (task._id === data.task._id ? data.task : task)));
      setSelectedTask(null);
      return;
    }
    const data = await taskApi.create(values);
    setTasks((current) => [data.task, ...current]);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = tasks.findIndex((task) => task._id === active.id);
    const newIndex = tasks.findIndex((task) => task._id === over.id);
    const reordered = arrayMove(tasks, oldIndex, newIndex);
    setTasks(reordered);
    await taskApi.reorder(reordered.map((task) => task._id));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Execution"
        title="Your task system, from frictionless to power-user"
        description="Stay fast in basic mode, then expand into AI-assisted scheduling, prioritization, and planner behavior when you want more control."
        action={
          <Button
            onClick={() => {
              setSelectedTask(null);
              setDrawerOpen(true);
            }}
          >
            <Plus size={16} className="mr-2" />
            New task
          </Button>
        }
      />

      <QuickTaskBar
        onSubmit={async (payload) => {
          const data = await taskApi.create(payload);
          setTasks((current) => [data.task, ...current]);
        }}
      />

      <div className="glass-panel flex flex-col gap-3 rounded-[28px] p-4 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-2">
          {["all", "completed", "pending"].map((item) => (
            <button
              key={item}
              className={`rounded-full px-4 py-2 text-sm ${filter === item ? "bg-brand-500 text-white" : "bg-white/5 text-slate-300"}`}
              onClick={() => setFilter(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search tasks"
          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
        />
      </div>

      {filteredTasks.length ? (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={filteredTasks.map((task) => task._id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-4">
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onToggleComplete={async (id) => {
                    const data = await taskApi.toggleComplete(id);
                    setTasks((current) => current.map((item) => (item._id === id ? data.task : item)));
                  }}
                  onToggleImportant={async (id) => {
                    const data = await taskApi.toggleImportant(id);
                    setTasks((current) => current.map((item) => (item._id === id ? data.task : item)));
                  }}
                  onDelete={async (id) => {
                    await taskApi.remove(id);
                    setTasks((current) => current.filter((item) => item._id !== id));
                  }}
                  onEdit={(taskItem) => {
                    setSelectedTask(taskItem);
                    setDrawerOpen(true);
                  }}
                  onDuplicate={async (id) => {
                    const data = await taskApi.duplicate(id);
                    setTasks((current) => [data.task, ...current]);
                  }}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <EmptyState title="No tasks yet" description="Start with the quick-add bar above, or open the advanced drawer when you want richer task metadata." />
      )}

      <TaskFormDrawer
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedTask(null);
        }}
        task={selectedTask}
        onSubmit={upsertTask}
      />
    </div>
  );
};

export default TasksPage;
