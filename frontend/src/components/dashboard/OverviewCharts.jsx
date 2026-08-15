import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import Card from "../common/Card";

const colors = ["#1fa75c", "#38bdf8", "#f59e0b", "#f43f5e", "#8b5cf6"];

const OverviewCharts = ({ charts }) => (
  <div className="grid gap-5 xl:grid-cols-3">
    <Card className="xl:col-span-2">
      <h3 className="mb-4 text-lg font-semibold text-white">Weekly Productivity</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={charts.weeklyProductivity}>
            <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
            <XAxis dataKey="day" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#1fa75c" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
    <Card>
      <h3 className="mb-4 text-lg font-semibold text-white">Priority Split</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={charts.priorityDistribution} dataKey="value" nameKey="name" innerRadius={55} outerRadius={88}>
              {charts.priorityDistribution.map((entry, index) => (
                <Cell key={entry.name} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
    <Card className="xl:col-span-3">
      <h3 className="mb-4 text-lg font-semibold text-white">Task Trend</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={charts.taskTrend}>
            <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
            <XAxis dataKey="date" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="#38bdf8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  </div>
);

export default OverviewCharts;
