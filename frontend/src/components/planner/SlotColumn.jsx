import Card from "../common/Card";

const SlotColumn = ({ title, items = [] }) => (
  <Card className="h-full">
    <div className="mb-4 flex items-center justify-between">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <span className="text-xs text-slate-500">{items.length} items</span>
    </div>
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={`${item.taskId}-${index}`} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <h4 className="font-medium text-white">{item.title}</h4>
          <p className="mt-1 text-sm text-slate-400">{item.reason}</p>
          <div className="mt-2 text-xs text-slate-500">{item.duration} minutes</div>
        </div>
      ))}
    </div>
  </Card>
);

export default SlotColumn;
