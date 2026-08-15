import { motion } from "framer-motion";

const PageHeader = ({ eyebrow, title, description, action }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
  >
    <div className="space-y-2">
      {eyebrow && <p className="text-xs uppercase tracking-[0.25em] text-brand-300">{eyebrow}</p>}
      <h1 className="font-display text-3xl font-semibold text-white md:text-4xl">{title}</h1>
      {description && <p className="max-w-2xl text-sm text-slate-400">{description}</p>}
    </div>
    {action}
  </motion.div>
);

export default PageHeader;
