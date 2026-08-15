import { useState } from "react";
import PageHeader from "../components/common/PageHeader";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import { aiApi } from "../api/aiApi";

const RoadmapPage = () => {
  const [goal, setGoal] = useState("");
  const [months, setMonths] = useState(6);
  const [result, setResult] = useState(null);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Future You"
        title="Simulate the path to your long-term goal"
        description="Generate milestones, recurring tasks, and habits that make your future state feel tangible and schedulable."
      />

      <Card className="space-y-4">
        <input
          value={goal}
          onChange={(event) => setGoal(event.target.value)}
          placeholder="What future outcome are you aiming for?"
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
        />
        <input
          value={months}
          onChange={(event) => setMonths(Number(event.target.value))}
          type="number"
          min="1"
          max="24"
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
        />
        <Button
          onClick={async () => {
            const data = await aiApi.futureRoadmap({ goal, months });
            setResult(data);
          }}
        >
          Generate roadmap
        </Button>
      </Card>

      {result && (
        <div className="grid gap-5 xl:grid-cols-3">
          <Card className="xl:col-span-2">
            <h3 className="mb-4 text-lg font-semibold text-white">Milestones</h3>
            <div className="space-y-3">
              {result.milestones.map((milestone) => (
                <div key={milestone.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="font-medium text-white">{milestone.title}</div>
                  <div className="mt-1 text-sm text-brand-300">{milestone.targetMonth}</div>
                  <div className="mt-2 text-sm text-slate-400">{milestone.description}</div>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <h3 className="mb-4 text-lg font-semibold text-white">Recurring support</h3>
            <div className="space-y-3">
              {result.recurringTasks.map((task) => (
                <div key={task} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-300">
                  {task}
                </div>
              ))}
              {result.habits.map((habit) => (
                <div key={habit} className="rounded-2xl border border-white/10 bg-brand-500/10 p-4 text-sm text-brand-100">
                  {habit}
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default RoadmapPage;
