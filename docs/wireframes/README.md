
*(Nested fences above are illustrative — in the actual file, use a single
triple-backtick `mermaid` block.)*

---

## Phase 2 — `docs/wireframes/README.md`

Low-fidelity, paper or Excalidraw is fine. Six screens to sketch:

| # | Screen | Route | Key elements |
|---|--------|-------|--------------|
| 1 | Marketing / landing | `/` | Value prop, pricing, CTA to signup |
| 2 | Signup + tenant creation | `/register` | Business name, slug preview, email, password |
| 3 | Onboarding (services) | `/app/onboarding` | Business phone, add 3 default services |
| 4 | Admin dashboard | `/app` | Booking list, status badges, filter by date |
| 5 | Public booking page | `/b/[slug]` | Business header, service select, date/time, contact fields |
| 6 | Billing | `/app/billing` | Trial countdown, Stripe portal link, plan card |

---

## Gate Checklist — Phase 1 & 2

- [ ] PRD approved — reply **"PRD approved"**
- [ ] MoSCoW backlog approved (60/20/20 compliant) — reply **"backlog approved"**
- [ ] Multi-tenancy decision approved — reply **"schema approved"**
- [ ] Wireframes sketched or consciously deferred — reply **"wireframes deferred"** if you'd rather sketch after scaffolding (acceptable, but note it in the repo)

---

## Git Commands — Commit Phase 1 & 2

Run from your PlumbFlow project root once the four files above are saved:

```powershell
git checkout -b chore/phase-1-2-discovery

git add PRD.md feature-backlog-moscow.md docs/schema/tenant-model.md docs/schema/ERD.md docs/wireframes/README.md
git commit -m "docs: add Phase 1 PRD and MoSCoW backlog, Phase 2 schema and wireframes" -m "- PRD covers problem, roles, value prop, business model, non-goals
- Backlog re-scoped to 60/20/20 rule (Must 36pts, Should 12pts, Could 12pts)
- Multi-tenancy decision documented: shared schema with enforced tenant_id
- Mermaid ERD for five core models
- Wireframe inventory for six primary screens"

git push -u origin chore/phase-1-2-discovery