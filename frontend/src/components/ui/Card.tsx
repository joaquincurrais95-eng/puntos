import { ReactNode } from "react";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={
        "rounded-2xl border bg-[var(--app-surface)] p-5 shadow-[0_10px_30px_var(--app-shadow)] app-border " +
        className
      }
    >
      {children}
    </div>
  );
}

