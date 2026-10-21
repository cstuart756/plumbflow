# Multi-Tenancy Model

## Decision: Shared schema with `tenant_id` on every table

### Options considered

| Model | Pros | Cons | Verdict |
|-------|------|------|---------|
| **Shared schema + `tenant_id`** | One DB, one migration history, cheapest on Heroku Postgres, scales to thousands of tenants | Requires discipline: every query must filter by tenant | **CHOSEN** |
| Schema-per-tenant | Strong isolation, easy per-tenant backup | Migration runs N times, connection pool pressure, painful at scale | Rejected |
| Database-per-tenant | Maximum isolation | Cost prohibitive, operational nightmare solo | Rejected |

### Enforcement rules (non-negotiable)

1. Every tenant-scoped table has a `tenantId` column, indexed.
2. A Prisma middleware injects `where: { tenantId }` on every read and
   `data: { tenantId }` on every write.
3. Any query that bypasses the middleware requires an explicit code comment
   and a test.
4. Integration tests assert that Tenant A cannot read Tenant B's rows.

### Rationale

Heroku Postgres row limits and connection counts make schema-per-tenant
impractical below enterprise pricing. Shared schema with enforced scoping is
the industry default (used by Linear, Vercel, Cal.com) and remains correct up
to thousands of tenants.