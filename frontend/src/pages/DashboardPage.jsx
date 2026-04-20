import { useEffect, useState } from "react";
import PageHeader from "../components/common/PageHeader";
import StatCard from "../components/common/StatCard";
import Loader from "../components/common/Loader";
import Card from "../components/common/Card";
import { dashboardApi } from "../api/dashboardApi";
import OverviewCharts from "../components/dashboard/OverviewCharts";
import InsightCard from "../components/dashboard/InsightCard";
import FocusTasks from "../components/dashboard/FocusTasks";

const DashboardPage = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    dashboardApi.summary().then(setData);
  }, []);

  if (!data) return <Loader />;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Overview"
        title="Your premium productivity cockpit"
        description="A role-aware dashboard that tracks execution, protects focus, and surfaces the right AI guidance without crowding the basics."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total tasks" value={data.stats.totalTasks} />
        <StatCard label="Completion rate" value={`${data.stats.completionPercentage}%`} />
        <StatCard label="Productivity score" value={data.stats.productivityScore} />
        <StatCard label="XP / Level / Streak" value={`${data.stats.xp} / ${data.stats.level} / ${data.stats.streak}`} />
      </div>

      <OverviewCharts charts={data.charts} />

      <div className="grid gap-5 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="grid gap-5 md:grid-cols-2">
          {data.aiInsights.map((insight) => (
            <InsightCard key={insight._id} title={insight.title} summary={insight.summary} />
          ))}
        </div>
        <FocusTasks tasks={data.suggestedFocusTasks} />
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <Card>
          <h3 className="mb-4 text-lg font-semibold text-white">Upcoming deadlines</h3>
          <div className="space-y-3">
            {data.upcomingDeadlines.map((task) => (
              <div key={task._id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="font-medium text-white">{task.title}</div>
                <div className="mt-1 text-sm text-slate-400">{task.category}</div>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h3 className="mb-4 text-lg font-semibold text-white">Activity timeline</h3>
          <div className="space-y-3">
            {data.activityTimeline.map((item) => (
              <div key={item._id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="font-medium text-white">{item.message}</div>
                <div className="mt-1 text-xs text-slate-500">{new Date(item.createdAt).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
