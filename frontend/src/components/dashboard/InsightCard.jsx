import Card from "../common/Card";

const InsightCard = ({ title, summary }) => (
  <Card className="space-y-3">
    <div className="text-xs uppercase tracking-[0.24em] text-brand-300">AI Insight</div>
    <h3 className="text-lg font-semibold text-white">{title}</h3>
    <p className="text-sm leading-6 text-slate-400">{summary}</p>
  </Card>
);

export default InsightCard;
