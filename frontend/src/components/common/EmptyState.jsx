import Card from "./Card";

const EmptyState = ({ title, description }) => (
  <Card className="flex min-h-[220px] flex-col items-center justify-center text-center">
    <h3 className="text-lg font-semibold text-white">{title}</h3>
    <p className="mt-2 max-w-md text-sm text-slate-400">{description}</p>
  </Card>
);

export default EmptyState;
