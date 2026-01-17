# LedaaS - Ledger as a Service

A modern double-entry bookkeeping system built with Go and React.

## Features

- Double-Entry Accounting - Ensures balanced debits and credits
- Event Sourcing - Complete audit trail with immutable events
- High Performance - Built with Go, PostgreSQL, and optimized queries
- Real-time Processing - Job queue with River for background tasks
- API Keys & Authentication - Secure API access with JWT
- RESTful API - Clean and well-documented endpoints
- Integration Tests - Testcontainers for reliable testing
- Docker Support - Full containerization with health checks

## Architecture

```mermaid
flowchart LR
    %% --- STYLE DEFINITIONS ---
    classDef client fill:#e6fcf5,stroke:#0ca678,stroke-width:2px;
    classDef component fill:#e7f5ff,stroke:#1c7ed6,stroke-width:2px;
    classDef storage fill:#f3f0ff,stroke:#7950f2,stroke-width:2px,shape:cylinder;
    classDef eventstore fill:#ffe3e3,stroke:#e03131,stroke-width:3px,shape:cylinder;
    classDef external fill:#fff9db,stroke:#f08c00,stroke-width:2px;
    classDef queue fill:#fff4e6,stroke:#fd7e14,stroke-width:2px,shape:c;

    %% --- CLIENT ---
    subgraph ClientLayer ["Client Side"]
        Dashboard["React Dashboard"]:::client
    end

    %% --- API SERVER (DETAILED LAYERS) ---
    subgraph APIServer ["API Server (Go) - Port 8080"]
        direction TB
        
        %% 1. Middleware Layer
        subgraph L_MW ["Layer 1: Middleware"]
            direction TB
            AuthMW["Auth Middleware<br/>(Check JWT/API Key)"]:::component
        end

        %% 2. Transport/Handler Layer
        subgraph L_Handler ["Layer 2: Transport"]
            direction TB
            Handlers["HTTP Handlers<br/>(Gin/Echo/Fiber)<br/>Parse Req & Validate"]:::component
        end

        %% 3. Business Logic Layer
        subgraph L_Service ["Layer 3: Business Logic"]
            direction TB
            Services["Services / Domain Logic<br/>(Rules, Cmd Handling)"]:::component
        end

        %% 4. Data Access Layer
        subgraph L_DAL ["Layer 4: Data Access"]
            direction TB
            Repo["Repositories / DAL<br/>(SQL Queries / ORM)"]:::component
        end

        %% Internal Flow
        AuthMW --> Handlers
        Handlers --> Services
        Services --> Repo
    end

    %% --- DATABASE ---
    subgraph Database ["PostgreSQL"]
        direction TB
        
        subgraph IAM ["IAM Tables"]
            APIKeys[(api_keys)]:::storage
            Users[(users)]:::storage
        end

        subgraph CoreData ["Write Side"]
            Events[("EVENTS<br/>(Event Store)")]:::eventstore
            RiverJobs{{"River Job<br/>(Queue)"}}:::queue
        end
        
        subgraph ReadModels ["Read Side"]
            Accounts[(accounts)]:::storage
            Transactions[(transactions)]:::storage
        end
        
         subgraph WH_Store ["Webhook Tables"]
            WebhookEP[(wh_endpoints)]:::storage
            WebhookDel[(wh_deliveries)]:::storage
        end
    end

    %% --- WORKERS ---
    subgraph Workers ["Async Workers"]
        direction TB
        Projector["Projector"]:::component
        WebhookWorker["Webhook Worker"]:::component
    end

    %% --- EXTERNAL ---
    CustomerWebhook["Customer Endpoints"]:::external

    %% --- CONNECTIONS ---

    %% 1. Ingress
    Dashboard ==>|HTTPS| AuthMW

    %% 2. Middleware Access
    AuthMW -.->|Read| APIKeys

    %% 3. DAL Access (The only layer touching DB)
    Repo -->|Insert| Events
    Repo -->|Enqueue| RiverJobs
    Repo -.->|Select| Accounts
    Repo -.->|Select| Transactions
    Repo -.->|Select| Users
    Repo -.->|Select| WebhookEP

    %% 4. Worker Flows
    Projector -->|Poll| Events
    Projector -->|Upsert| Accounts
    Projector -->|Upsert| Transactions

    WebhookWorker -->|Poll| RiverJobs
    WebhookWorker -->|Read| Events
    WebhookWorker -->|Log| WebhookDel
    WebhookWorker ==>|POST| CustomerWebhook
    
    %% Formatting
    linkStyle default interpolate basis

```

## Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 20+ (for local development)

### Running with Docker

```bash
# Start all services
docker compose up -d --build

# Run web frontend
cd web && npm run dev
```

Services will be available at:
- API: http://localhost:8080
- Web: http://localhost:5173
- PostgreSQL: localhost:5432

## Project Structure

```
LedaaS/
├── cmd/                 # Application entry points
│   ├── api/            # API server
│   ├── worker/         # Background job processor
│   └── migrate/        # Database migrations
├── internal/           # Private application code
│   ├── integration/    # Integration tests
│   ├── ledger/         # Core ledger logic
│   └── webhook/        # Webhook handling
├── migrations/         # SQL migration files
├── web/               # React frontend
└── docker-compose.yml # Service orchestration
```

## Database Schema

The system uses event sourcing with the following key tables:
- `events` - Immutable source of truth
- `accounts` - Current account balances
- `transactions` - Processed transactions
- `river_job` - Background job queue

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
