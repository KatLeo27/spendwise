import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, TrendingUp, TrendingDown, Wallet, PiggyBank, Pencil } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  PieChart as RePieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { formatINR, formatDate } from "@/lib/format";
import { ExpenseForm, CATEGORIES } from "@/components/expense-form";

export const Route = createFileRoute("/_app/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);

  const profileQ = useQuery({
    queryKey: ["profile", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", user!.id).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const expensesQ = useQuery({
    queryKey: ["expenses", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("expenses")
        .select("*")
        .order("date", { ascending: false })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const addMut = useMutation({
    mutationFn: async (v: any) => {
      const { error } = await supabase.from("expenses").insert({
        user_id: user!.id,
        title: v.title,
        amount: v.amount,
        category: v.category,
        payment_method: v.payment_method,
        date: v.date.toISOString().slice(0, 10),
        notes: v.notes || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["expenses", user?.id] });
      toast.success("Expense added");
      setOpen(false);
    },
    onError: (e: any) => toast.error(e.message),
  });

  const expenses = expensesQ.data ?? [];
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthExpenses = expenses.filter((e) => new Date(e.date) >= monthStart);
  const monthTotal = monthExpenses.reduce((s, e) => s + Number(e.amount), 0);
  const budget = Number(profileQ.data?.monthly_budget ?? 50000);
  const remaining = Math.max(budget - monthTotal, 0);
  const savingsPct = budget > 0 ? Math.max(0, Math.round((remaining / budget) * 100)) : 0;
  const lastMonth = expenses.filter((e) => {
    const d = new Date(e.date);
    return d < monthStart && d >= new Date(now.getFullYear(), now.getMonth() - 1, 1);
  });
  const lastMonthTotal = lastMonth.reduce((s, e) => s + Number(e.amount), 0);
  const trend = lastMonthTotal === 0 ? 0 : Math.round(((monthTotal - lastMonthTotal) / lastMonthTotal) * 100);

  // Category breakdown
  const byCategory = CATEGORIES.map((c) => ({
    name: c.label,
    value: monthExpenses.filter((e) => e.category === c.value).reduce((s, e) => s + Number(e.amount), 0),
    color: catColor(c.value),
  })).filter((c) => c.value > 0);

  // Last 7 days bar
  const days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const iso = d.toISOString().slice(0, 10);
    const total = expenses.filter((e) => e.date === iso).reduce((s, e) => s + Number(e.amount), 0);
    return { day: d.toLocaleDateString("en-IN", { weekday: "short" }), total };
  });

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Hello, {profileQ.data?.name ?? "there"} 👋</h1>
          <p className="text-sm text-muted-foreground">Here's your spending snapshot for {now.toLocaleDateString("en-IN", { month: "long", year: "numeric" })}.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary shadow-soft"><Plus className="mr-1 h-4 w-4" /> Add expense</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader><DialogTitle>New expense</DialogTitle></DialogHeader>
            <ExpenseForm onSubmit={(v) => addMut.mutateAsync(v)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Spent this month" value={formatINR(monthTotal)} icon={<Wallet />} accent />
        <StatCard label="Remaining budget" value={formatINR(remaining)} icon={<PiggyBank />} />
        <StatCard label="Savings rate" value={`${savingsPct}%`} icon={<TrendingUp />} />
        <StatCard
          label="vs last month"
          value={`${trend >= 0 ? "+" : ""}${trend}%`}
          icon={trend >= 0 ? <TrendingUp /> : <TrendingDown />}
          tone={trend > 0 ? "warn" : "good"}
        />
      </div>

      {/* Budget progress */}
      <Card className="shadow-soft">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-base">Monthly budget</CardTitle>
          <span className="text-sm text-muted-foreground">{formatINR(monthTotal)} / {formatINR(budget)}</span>
        </CardHeader>
        <CardContent>
          <Progress value={budget ? Math.min((monthTotal / budget) * 100, 100) : 0} className="h-3" />
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 shadow-soft">
          <CardHeader><CardTitle className="text-base">Spend — last 7 days</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={days}>
                <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.3} />
                <XAxis dataKey="day" tickLine={false} axisLine={false} className="text-xs" />
                <YAxis tickLine={false} axisLine={false} className="text-xs" tickFormatter={(v) => `₹${v}`} />
                <Tooltip
                  cursor={{ fill: "var(--accent)", opacity: 0.4 }}
                  contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12 }}
                  formatter={(v: any) => formatINR(Number(v))}
                />
                <Bar dataKey="total" fill="var(--primary)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader><CardTitle className="text-base">By category</CardTitle></CardHeader>
          <CardContent className="h-72">
            {byCategory.length === 0 ? (
              <div className="grid h-full place-items-center text-sm text-muted-foreground">No expenses yet</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie data={byCategory} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={3}>
                    {byCategory.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12 }}
                    formatter={(v: any) => formatINR(Number(v))}
                  />
                </RePieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent */}
      <Card className="shadow-soft">
        <CardHeader><CardTitle className="text-base">Recent transactions</CardTitle></CardHeader>
        <CardContent>
          {expenses.length === 0 ? (
            <div className="py-10 text-center text-sm text-muted-foreground">
              No expenses yet. Click "Add expense" to log your first one.
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {expenses.slice(0, 6).map((e) => {
                const cat = CATEGORIES.find((c) => c.value === e.category);
                return (
                  <li key={e.id} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <span className="grid h-10 w-10 place-items-center rounded-xl bg-muted text-lg">{cat?.icon}</span>
                      <div>
                        <p className="font-medium">{e.title}</p>
                        <p className="text-xs text-muted-foreground">{cat?.label} · {formatDate(e.date)}</p>
                      </div>
                    </div>
                    <span className="font-semibold">{formatINR(Number(e.amount))}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({
  label, value, icon, accent, tone,
}: { label: string; value: string; icon: React.ReactNode; accent?: boolean; tone?: "good" | "warn" }) {
  return (
    <Card className={`shadow-soft ${accent ? "bg-gradient-primary text-primary-foreground border-0" : ""}`}>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <p className={`text-xs ${accent ? "opacity-80" : "text-muted-foreground"}`}>{label}</p>
          <span className={`grid h-8 w-8 place-items-center rounded-lg ${accent ? "bg-white/15" : tone === "warn" ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"}`}>
            <span className="[&>svg]:h-4 [&>svg]:w-4">{icon}</span>
          </span>
        </div>
        <p className="mt-3 font-display text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}

function catColor(v: string) {
  const map: Record<string, string> = {
    food: "var(--chart-1)",
    transport: "var(--chart-2)",
    shopping: "var(--chart-3)",
    entertainment: "var(--chart-4)",
    bills: "var(--chart-5)",
    health: "var(--gold)",
    education: "var(--ring)",
    other: "var(--muted-foreground)",
  };
  return map[v] ?? "var(--primary)";
}
