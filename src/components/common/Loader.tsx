import { cn } from "@/utils/cn";

interface LoaderProps {
  className?: string;
  label?: string;
}

export default function Loader({ className, label = "Loading" }: LoaderProps) {
  return (
    <div className={cn("inline-flex items-center gap-3 text-sm font-semibold text-slate-500", className)}>
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900" />
      {label}
    </div>
  );
}