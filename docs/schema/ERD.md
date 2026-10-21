# Entity Relationship Diagram

```mermaid
erDiagram
    TENANT ||--o{ USER : has
    TENANT ||--o{ SERVICE : offers
    TENANT ||--o{ CUSTOMER : serves
    TENANT ||--o{ BOOKING : receives
    CUSTOMER ||--o{ BOOKING : places
    SERVICE ||--o{ BOOKING : "is booked as"

    TENANT {
        string id PK
        string slug UK
        string businessName
        string phone
        string email
        string stripeCustomerId UK
        string subscriptionStatus
        datetime trialEndsAt
        datetime createdAt
    }
    USER {
        string id PK
        string tenantId FK
        string email
        string passwordHash
        string name
        string role
    }
    SERVICE {
        string id PK
        string tenantId FK
        string name
        int duration
        boolean active
    }
    CUSTOMER {
        string id PK
        string tenantId FK
        string name
        string email
        string phone
    }
    BOOKING {
        string id PK
        string tenantId FK
        string customerId FK
        string serviceId FK
        datetime scheduledAt
        string status
        string notes
        datetime createdAt
    }