import Card from "../common/Card";
import { formatDate, priorityTone } from "../../utils/format";

const FocusTasks = ({ tasks = [] }) => (
  <Card>
    <div className="mb-4 flex items-center justify-between">
      <h3 className="text-lg font-semibold text-white">Suggested Focus Tasks</h3>
      <span className="text-xs uppercase tracking-[0.2em] text-slate-500">Today</span>
    </div>
    <div className="space-y-3">
      {tasks.map((task) => (
        <div key={task._id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h4 className="font-medium text-white">{task.title}</h4>
              <p className="mt-1 text-sm text-slate-400">{task.category}</p>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs ${priorityTone[task.priority] || priorityTone.medium}`}>
              {task.priority}
            </span>
          </div>
          <div className="mt-3 text-xs text-slate-500">Due {formatDate(task.dueDate)}</div>
        </div>
      ))}
    </div>
  </Card>
);

export default FocusTasks;
