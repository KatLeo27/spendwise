import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Wallet,
  PieChart,
  Target,
  Sparkles,
  FileBarChart,
  Brain,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Github,
  Twitter,
  Linkedin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { formatINR } from "@/lib/format";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SpendWise — Track expenses, build smarter financial habits" },
      {
        name: "description",
        content:
          "SpendWise helps you track expenses, set budgets, and get AI-powered insights into your spending — all in one beautiful dashboard.",
      },
    ],
  }),
  component: Landing,
});

const features = [
  { icon: Wallet, title: "Expense Tracking", desc: "Log every rupee in seconds with quick-add and categories." },
  { icon: PieChart, title: "Analytics Dashboard", desc: "Beautiful charts that show where your money actually goes." },
  { icon: Target, title: "Budget Planning", desc: "Set monthly budgets and watch progress in real time." },
  { icon: Brain, title: "Smart Insights", desc: "Spot overspending patterns before they hurt your wallet." },
  { icon: FileBarChart, title: "Monthly Reports", desc: "Clear summaries of every month, ready to review." },
  { icon: Sparkles, title: "AI Spending Analysis", desc: "Personal nudges and savings suggestions powered by AI." },
];

const testimonials = [
  { name: "Aarav Mehta", role: "Product Designer", quote: "SpendWise made me finally stick to a budget. The dashboard is gorgeous." },
  { name: "Priya Sharma", role: "Software Engineer", quote: "I saved ₹18,000 in three months just by seeing my spending clearly." },
  { name: "Rohan Iyer", role: "Founder", quote: "Categorization is fast and the insights are scarily accurate." },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-primary text-primary-foreground shadow-soft">
              <Wallet className="h-4 w-4" />
            </span>
            SpendWise
          </Link>
          <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
            <a href="#about" className="hover:text-foreground transition-colors">About</a>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link to="/auth">
              <Button variant="ghost" size="sm">Login</Button>
            </Link>
            <Link to="/auth" className="hidden sm:block">
              <Button size="sm" className="bg-gradient-primary shadow-soft">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-2 lg:py-28">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-gold" /> AI-powered finance, made simple
            </span>
            <h1 className="mt-6 text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl">
              Spend with <span className="text-gradient-gold">intention.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              Track your expenses, manage your money, and build smarter financial habits — all in
              one beautifully designed dashboard.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/auth">
                <Button size="lg" className="bg-gradient-primary shadow-elegant">
                  Get Started <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/auth">
                <Button size="lg" variant="outline">Login</Button>
              </Link>
            </div>
            <div className="mt-10 flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> Bank-grade security</div>
              <div className="flex items-center gap-2"><TrendingUp className="h-4 w-4 text-primary" /> Real-time analytics</div>
            </div>
          </div>

          {/* Mockup */}
          <div className="relative">
            <div className="animate-float">
              <DashboardMockup />
            </div>
            <div className="absolute -left-6 bottom-6 hidden rounded-2xl glass p-4 shadow-soft md:block animate-fade-up">
              <p className="text-xs text-muted-foreground">This month saved</p>
              <p className="text-2xl font-bold text-primary">{formatINR(12450)}</p>
            </div>
            <div className="absolute -right-4 top-8 hidden rounded-2xl glass p-4 shadow-soft md:block animate-fade-up">
              <p className="text-xs text-muted-foreground">Top category</p>
              <p className="text-lg font-semibold">🍔 Food · 32%</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
            Everything you need to <span className="text-gradient-gold">master money</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            From quick logging to AI insights — SpendWise covers the full financial loop.
          </p>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="group rounded-2xl border border-border bg-card p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-elegant"
            >
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-soft">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="mx-auto max-w-5xl px-6 py-24">
        <div className="text-center">
          <h2 className="text-4xl font-bold tracking-tight md:text-5xl">Simple pricing</h2>
          <p className="mt-3 text-muted-foreground">Start free. Upgrade when you're ready.</p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {[
            { name: "Free", price: "₹0", perks: ["Unlimited expenses", "Monthly budget", "Basic charts"], cta: "Get Started" },
            { name: "Pro", price: "₹199/mo", perks: ["AI insights", "Recurring expenses", "Export PDF/CSV", "Multi-currency"], cta: "Go Pro", highlight: true },
          ].map((p) => (
            <div
              key={p.name}
              className={`rounded-3xl border p-8 shadow-soft ${
                p.highlight
                  ? "border-primary/40 bg-gradient-primary text-primary-foreground"
                  : "border-border bg-card"
              }`}
            >
              <p className="text-sm uppercase tracking-wider opacity-80">{p.name}</p>
              <p className="mt-2 text-4xl font-bold">{p.price}</p>
              <ul className="mt-6 space-y-2 text-sm">
                {p.perks.map((perk) => (
                  <li key={perk} className="flex items-center gap-2">
                    <span className={p.highlight ? "text-gold" : "text-primary"}>✓</span> {perk}
                  </li>
                ))}
              </ul>
              <Link to="/auth" className="mt-8 inline-block w-full">
                <Button
                  className={`w-full ${p.highlight ? "bg-gold text-gold-foreground hover:bg-gold/90" : ""}`}
                  variant={p.highlight ? "default" : "outline"}
                >
                  {p.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="text-center">
          <h2 className="text-4xl font-bold tracking-tight md:text-5xl">Loved by smart spenders</h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <div key={t.name} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <p className="text-foreground">"{t.quote}"</p>
              <div className="mt-6 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-primary text-sm font-semibold text-primary-foreground">
                  {t.name[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About / CTA */}
      <section id="about" className="mx-auto max-w-5xl px-6 pb-24">
        <div className="rounded-3xl bg-gradient-primary p-12 text-center text-primary-foreground shadow-elegant">
          <h2 className="text-4xl font-bold">Ready to take control?</h2>
          <p className="mt-3 opacity-90">Join SpendWise and turn financial chaos into clarity.</p>
          <Link to="/auth" className="mt-6 inline-block">
            <Button size="lg" className="bg-gold text-gold-foreground hover:bg-gold/90">
              Create your free account
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 py-10 md:flex-row">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="grid h-7 w-7 place-items-center rounded-md bg-gradient-primary text-primary-foreground">
              <Wallet className="h-3.5 w-3.5" />
            </span>
            © {new Date().getFullYear()} SpendWise. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground">Privacy</a>
            <a href="#" className="hover:text-foreground">Terms</a>
            <a href="#" className="hover:text-foreground">Contact</a>
            <a href="#" className="hover:text-foreground"><Github className="h-4 w-4" /></a>
            <a href="#" className="hover:text-foreground"><Twitter className="h-4 w-4" /></a>
            <a href="#" className="hover:text-foreground"><Linkedin className="h-4 w-4" /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function DashboardMockup() {
  const bars = [60, 90, 45, 75, 110, 55, 80];
  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-elegant">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">Spent this month</p>
          <p className="font-display text-3xl font-bold">{formatINR(37820)}</p>
        </div>
        <div className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          24% under budget
        </div>
      </div>
      <div className="mt-6 flex items-end gap-2 h-32">
        {bars.map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-t-md bg-gradient-primary"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
      <div className="mt-6 space-y-2">
        {[
          { c: "🍔", t: "Lunch at Cafe", a: 420 },
          { c: "🚗", t: "Uber home", a: 180 },
          { c: "🛒", t: "Groceries", a: 1240 },
        ].map((r) => (
          <div key={r.t} className="flex items-center justify-between rounded-lg bg-muted px-3 py-2 text-sm">
            <span>{r.c} {r.t}</span>
            <span className="font-semibold">{formatINR(r.a)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
