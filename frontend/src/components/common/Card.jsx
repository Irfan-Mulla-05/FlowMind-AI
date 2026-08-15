import { cn } from "../../utils/cn";

const Card = ({ className, children }) => (
  <div className={cn("glass-panel rounded-[28px] p-5 shadow-soft", className)}>{children}</div>
);

export default Card;
