import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { formatINR } from "@/lib/format";
import { CATEGORIES } from "@/components/expense-form";

export const Route = createFileRoute("/_app/analytics")({
  component: Analytics,
});

function Analytics() {
  const { user } = useAuth();
  const { data: expenses = [] } = useQuery({
    queryKey: ["expenses", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase.from("expenses").select("*");
      if (error) throw error;
      return data ?? [];
    },
  });

  // Monthly trend last 6 months
  const months = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    const label = d.toLocaleDateString("en-IN", { month: "short" });
    const m = d.getMonth(), y = d.getFullYear();
    const total = expenses
      .filter((e) => { const ed = new Date(e.date); return ed.getMonth() === m && ed.getFullYear() === y; })
      .reduce((s, e) => s + Number(e.amount), 0);
    return { month: label, total };
  });

  const byCategory = CATEGORIES.map((c) => ({
    name: c.label,
    value: expenses.filter((e) => e.category === c.value).reduce((s, e) => s + Number(e.amount), 0),
    color: catColor(c.value),
  })).filter((c) => c.value > 0);

  const avgMonth = Math.round(months.reduce((s, m) => s + m.total, 0) / Math.max(months.filter(m => m.total > 0).length, 1));

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Analytics</h1>
        <p className="text-sm text-muted-foreground">Trends and breakdowns of your spending.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Total spent (all time)" value={formatINR(expenses.reduce((s, e) => s + Number(e.amount), 0))} />
        <StatCard label="Average per month" value={formatINR(avgMonth)} />
        <StatCard label="Transactions" value={String(expenses.length)} />
      </div>

      <Card className="shadow-soft">
        <CardHeader><CardTitle className="text-base">Spending trend — last 6 months</CardTitle></CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={months}>
              <defs>
                <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.45} />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.3} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} className="text-xs" />
              <YAxis tickLine={false} axisLine={false} className="text-xs" tickFormatter={(v) => `₹${v}`} />
              <Tooltip
                contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12 }}
                formatter={(v: any) => formatINR(Number(v))}
              />
              <Area type="monotone" dataKey="total" stroke="var(--primary)" strokeWidth={2} fill="url(#g)" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="shadow-soft">
        <CardHeader><CardTitle className="text-base">All-time category breakdown</CardTitle></CardHeader>
        <CardContent className="h-80">
          {byCategory.length === 0 ? (
            <div className="grid h-full place-items-center text-sm text-muted-foreground">No data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={byCategory} dataKey="value" nameKey="name" outerRadius={110} paddingAngle={2}>
                  {byCategory.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Legend />
                <Tooltip
                  contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12 }}
                  formatter={(v: any) => formatINR(Number(v))}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <Card className="shadow-soft">
      <CardContent className="p-5">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="mt-2 font-display text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}

function catColor(v: string) {
  const map: Record<string, string> = {
    food: "var(--chart-1)", transport: "var(--chart-2)", shopping: "var(--chart-3)",
    entertainment: "var(--chart-4)", bills: "var(--chart-5)", health: "var(--gold)",
    education: "var(--ring)", other: "var(--muted-foreground)",
  };
  return map[v] ?? "var(--primary)";
}
