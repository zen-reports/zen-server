# @zen-reports/zen-server

[![License: FSL-1.1-MIT](https://img.shields.io/badge/License-FSL--1.1--MIT-red.svg)](LICENSE)

Backend ingestion and asset management service for [Zen Reports](https://github.com/zen-reports/zen-reports).

> **Restrictive License Notice (FSL-1.1-MIT)**:
> `@zen-reports/zen-server` is licensed under the **Functional Source License, Version 1.1, MIT Future License ([FSL-1.1-MIT](LICENSE))**.
>
> - **Permitted Purposes**: Internal company/enterprise use, testing infrastructure, non-commercial education, and non-commercial research.
> - **Competing Use Restriction**: You may **not** make the Software available to others in any commercial product or service that competes with, substitutes for, or offers substantially similar functionality as `@zen-reports/zen-server`.
> - **Change Date**: Two years after each release date, that version converts automatically to the standard MIT License.
>
> Note: The core test reporter and viewer packages ([`@zen-reports/zen-reporter-playwright`](https://github.com/zen-reports/zen-reports), `@zen-reports/zen-cli`, `@zen-reports/zen-core`, `@zen-reports/zen-ui`) are licensed under the permissive MIT License. `zen-server` is an optional, standalone ingestion service. Zen Reports functions completely standalone with embedded SQLite (`history.db`) without requiring `zen-server`.

---

## Overview

The Zen Reports backend server provides multi-tenant ingestion, reporting, and asset management for cross-run history persistence in CI/CD pipelines and hosted team dashboards:

- **High-Performance Ingestion**: Streaming ingestion API built with [Hono](https://hono.dev/) on Node.js.
- **Relational Run History**: Powered by PostgreSQL and [Drizzle ORM](https://orm.drizzle.team/).
- **Multi-Cloud Direct Binary Uploads**: Presigned PUT and SAS upload URLs allow Playwright test runners to upload traces, videos, and screenshots directly to **AWS S3** (or S3-compatible: MinIO, Cloudflare R2), **Google Cloud Storage (GCS)**, or **Microsoft Azure Blob Storage** without routing large payloads through the API server.
- **Multi-Tenant Security**: Tenant isolation enforced by hashed SHA-256 API keys.
- **Lazy Loading**: Enables the Zen Reports UI dashboard to lazily fetch heavy per-test details (step trees, console stdout/stderr, stack traces, and presigned asset URLs) on demand.

---

## Architecture

```mermaid
flowchart LR
    subgraph Clients["Clients"]
        A["Playwright Runner (RemoteHistoryStore)"]
        B["Browser Dashboard (zen-ui)"]
    end

    subgraph Server["zen-server (Hono + Node.js)"]
        C["Auth Middleware"]
        D["Ingestion & Run Routes"]
        E["Storage Service (S3 / GCS / Azure Provider)"]
    end

    subgraph Storage["Infrastructure"]
        F[("PostgreSQL")]
        G[("Object Storage Bucket / Container")]
    end

    A -- "POST /api/v1/runs" --> C
    A -- "POST /attachments/presign" --> C
    B -- "GET /api/v1/runs/:runId/tests/:testId" --> C
    C --> D
    D --> F
    D --> E
    E -- Presigned URLs / SAS --> G
    A -- Direct PUT (traces/screenshots) --> G
```

---

## Prerequisites

- **Node.js**: `>= 22.5.0` (LTS 22, 24, or 26 recommended)
- **PostgreSQL**: `>= 14`
- **Object Storage**: AWS S3, Google Cloud Storage, Azure Blob Storage, or local S3-compatible service (e.g. MinIO).

---

## Quick Start

### 1. Installation

```bash
git clone https://github.com/zen-reports/zen-server.git
cd zen-server
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
PORT=3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/zen_reporter
STORAGE_PROVIDER=s3

# S3 / MinIO Configuration
S3_ENDPOINT=http://localhost:9090
S3_BUCKET=zen-reports
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=mock_access_key
AWS_SECRET_ACCESS_KEY=mock_secret_key
```

### 3. Database Migrations

Apply database schemas and migrations via Drizzle Kit:

```bash
npm run db:migrate
```

### 4. Running the Server

#### Development Mode (with live reload)

```bash
npm run dev
```

#### Production Mode

```bash
npm run build
npm start
```

Upon initial startup in development mode, the server automatically bootstraps a default development tenant:

- **Tenant ID**: `default-tenant`
- **Development API Key**: `zr_live_dev_api_key_12345`

---

## Connecting Playwright (`playwright.config.ts`)

In your Playwright test repository configured with `@zen-reports/zen-reporter-playwright`:

```ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  reporter: [
    [
      '@zen-reports/zen-reporter-playwright',
      {
        history: {
          mode: 'remote',
          serverUrl: process.env.ZEN_SERVER_URL || 'http://localhost:3000',
          apiKey: process.env.ZEN_REPORTER_API_KEY || 'zr_live_dev_api_key_12345',
          projectId: 'my-e2e-project',
        },
      },
    ],
  ],
});
```

---

## REST API Reference

See the full API specification in [docs/api.md](docs/api.md):

- `GET /health`: Health status endpoint.
- `POST /api/v1/runs`: Ingest completed test run metadata and test cases.
- `GET /api/v1/runs`: Paginated run listing for the authenticated tenant.
- `GET /api/v1/runs/:runId`: Fetch run summary and lightweight test cases.
- `GET /api/v1/runs/:runId/tests/:testId`: Lazy-load execution details and presigned attachment URLs for a single test.
- `POST /api/v1/runs/:runId/attachments/presign`: Request presigned upload URL for direct attachment upload.

---

## License

This software is licensed under the **Functional Source License, Version 1.1, MIT Future License ([FSL-1.1-MIT](LICENSE))**.
See the [LICENSE](LICENSE) file for the complete terms and conditions.
