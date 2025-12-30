import { Card } from "./Card";

export function StatCard({
  label,
  value,
  helper,
}: {
  label: string;
  value: string;
  helper?: string;
}) {
  return (
    <Card>
      <div className="text-sm app-muted">{label}</div>
      <div className="mt-1 text-3xl font-semibold tracking-tight">{value}</div>
      {helper && <div className="mt-2 text-xs app-muted">{helper}</div>}
    </Card>
  );
}

