import { cn } from "../../utils/cn";

const Button = ({ className, variant = "primary", ...props }) => {
  const variants = {
    primary: "bg-brand-500 text-white hover:bg-brand-400",
    secondary: "border border-white/10 bg-white/5 text-slate-100 hover:bg-white/10",
    ghost: "text-slate-300 hover:bg-white/5"
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-2xl px-4 py-2.5 text-sm font-medium transition",
        variants[variant],
        className
      )}
      {...props}
    />
  );
};

export default Button;
