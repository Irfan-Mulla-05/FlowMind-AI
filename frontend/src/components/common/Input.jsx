import { forwardRef } from "react";

const Input = forwardRef(({ label, className = "", ...props }, ref) => (
  <label className="space-y-2">
    {label && <span className="text-sm text-slate-300">{label}</span>}
    <input
      ref={ref}
      className={`w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-brand-400 ${className}`}
      {...props}
    />
  </label>
));

Input.displayName = "Input";

export default Input;
