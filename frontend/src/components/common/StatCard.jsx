import Card from "./Card";

const StatCard = ({ label, value, hint }) => (
  <Card className="space-y-3">
    <p className="text-sm text-slate-400">{label}</p>
    <div className="text-3xl font-semibold text-white">{value}</div>
    {hint && <p className="text-xs text-slate-500">{hint}</p>}
  </Card>
);

export default StatCard;
