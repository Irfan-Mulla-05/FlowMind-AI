import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import PageHeader from "../components/common/PageHeader";
import Card from "../components/common/Card";
import { dashboardApi } from "../api/dashboardApi";

const AnalyticsPage = () => {
  const [weekly, setWeekly] = useState([]);
  const [insights, setInsights] = useState(null);

  useEffect(() => {
    dashboardApi.weekly().then((data) => setWeekly(data.analytics));
    dashboardApi.insights().then(setInsights);
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Analytics"
        title="Performance trends, consistency, and AI signal"
        description="Track execution patterns across time slots, categories, and overdue behavior without losing the human side of planning."
      />

      <div className="grid gap-5 xl:grid-cols-2">
        <Card>
          <h3 className="mb-4 text-lg font-semibold text-white">Weekly performance</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weekly}>
                <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
                <XAxis dataKey="day" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="completed" fill="#1fa75c" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <h3 className="text-lg font-semibold text-white">Consistency analysis</h3>
          <div className="mt-4 space-y-4 text-sm text-slate-300">
            <p>Productivity score: {insights?.overview?.score ?? "--"}</p>
            <p>{insights?.overview?.summary}</p>
            <p>Best slot: {insights?.consistencyAnalysis?.bestSlot}</p>
            <p>{insights?.consistencyAnalysis?.recommendedAdjustment}</p>
          </div>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <Card>
          <h3 className="mb-4 text-lg font-semibold text-white">Category productivity</h3>
          <div className="space-y-3">
            {insights?.categoryProductivity?.map((item) => (
              <div key={item.name} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <span className="text-slate-300">{item.name}</span>
                <span className="text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h3 className="mb-4 text-lg font-semibold text-white">Completion by slot</h3>
          <div className="space-y-3">
            {insights?.completionByTimeSlot?.map((item) => (
              <div key={item.slot} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <span className="text-slate-300">{item.slot}</span>
                <span className="text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h3 className="mb-4 text-lg font-semibold text-white">Suggestions</h3>
          <div className="space-y-3">
            {insights?.overview?.suggestions?.map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-300">
                {item}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPage;
