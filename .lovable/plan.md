## Problem

The dashboard shows a default ₹50,000 monthly budget with no obvious way to change it. The Settings page does have a budget field, but it's hidden behind a separate route, so it feels like the number is locked.

## Plan

1. **Add inline budget editing on the dashboard "Monthly budget" card**
   - Add an "Edit" (pencil) button next to the budget total.
   - Clicking it opens a small dialog with a single number input (₹) and Save/Cancel.
   - On save, update `profiles.monthly_budget` for the current user via Supabase and invalidate the `["profile", user.id]` query so the card, stat cards, and progress bar refresh immediately.
   - Show a success toast; show the error message on failure (so any RLS/0-row issues surface instead of silently doing nothing).

2. **First-run nudge**
   - If the user hasn't customized their budget yet (still equal to the default 50,000), show a subtle "Set your budget" hint on the budget card so it's discoverable.

3. **Keep Settings in sync**
   - Leave the existing Settings → Monthly budget field as-is; both entry points write to the same column, so changing it in either place reflects everywhere.

## Technical notes

- Only frontend changes in `src/routes/_app/dashboard.tsx` (and a tiny reuse of the existing Dialog + Input components).
- Mutation pattern mirrors the existing `addMut` in the same file, using `supabase.from("profiles").update({ monthly_budget }).eq("id", user.id)`.
- No schema or RLS changes — the existing "update own profile" policy already permits this.

## Out of scope

- Per-category budgets, budget history, currency switching — can be added later.
