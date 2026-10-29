# Engineering Architecture & System Design Specification

This document details the software architecture, database design patterns, resource optimization algorithms, and infrastructure topologies governing the apparel multi-tenant e-commerce system.

---

## 1. System Topology & Architectural Design
The application utilizes an **isolated decoupled architecture** organized as a monorepo. This separates computing tasks clearly, ensuring that layout rendering engine loops do not run at the same time as database operations or heavy backend API tasks.

```text
       [ Clients / Browsers ]
                 │
                 ▼ (HTTPS / WebSockets)
       ┌───────────────────┐
       │     frontend/     │ ◄─── Next.js 15 (Edge Cache / SSR)
       └─────────┬─────────┘
                 │ (Internal Network Routing)
                 ▼
       ┌───────────────────┐
       │     backend/      │ ◄─── Stateless REST Services
       └─────────┬─────────┘
                 │ (Prisma Client Layer)
                 ▼
       ┌───────────────────┐
       │     database/     │ ◄─── PostgreSQL Engine (Indexed Data Matrix)
       └───────────────────┘
```

### Structural Design Pattern
- **frontend/**: Shifting interface calculation workloads away from the client browser to minimize RAM/CPU footprints on lower-end consumer hardware.
- **backend/**: Stateless service layout designed for uniform, predictable CPU profiles during concurrent task handling.
- **database/**: Centralized directory handling operational database mappings, migration ledgers, and structural indexing strategies.

---

## 2. Multi-Tenant Strategy & Brand Isolation
The system operates on a **Logical Multi-Tenancy model using single database isolation**. All core transactional tables possess a foreign key pointer referencing an explicit `Tenant` record.

### Security and Isolation Layer
- **Row-Level Tenancy Checks**: Every incoming query to the database layer must include a strict `tenantId` match constraint within the query modifier. This prevents cross-tenant data leaks.
- **URL Routing Strategy**: Tenants are isolated at the network level by subdomains or tenant slugs mapped to resource paths (e.g., `://platform.com` or `://platform.com`).

---

## 3. Apparel Variant Matrix Engine (Data Modeling)
Apparel inventory modeling encounters a multi-dimensional scaling problem due to the variable permutation matrix of sizes, colors, and materials.

### Relational Mapping Paradigm
To achieve flat, deterministic performance profiles, metadata is completely decoupled from the transactional stock inventory unit:

1. **`Product` Model**: Holds non-variant, static brand metadata (e.g., descriptions, design definitions, base marketing assets).
2. **`ProductVariant` Model**: Represents a concrete Stock Keeping Unit (SKU). It handles specific physical parameters (e.g., Size: L, Color: Indigo Denim) and its own localized pricing offsets and live inventory counts.

### Algorithmic Complexity Mapping
- **Naive Search (Unindexed)**: $O(N)$ scanning across every permutation, causing high CPU spikes as catalog items expand.
- **Optimized Strategy**: B-Tree indices applied across compound columns `(productId, size, color)` reduce database lookup delays to a flat **$O(\log N)$ or near-$O(1)$ cache hit profile**, protecting server performance during seasonal inventory refreshes.

---

## 4. Resource Optimization & Computational Safeguards
To guarantee clean operation on resource-limited host hardware (e.g., 8 GB RAM / 2-Core environments), specific engineering rules are strictly enforced:

### Memory Leak Prevention (Real-Time Tracking Layer)
- **State Cleanup Boundaries**: All real-time event listeners handling client logistics tracking must hook into lifecycle garbage collection controllers. When an order tracking interface goes out of scope, active socket loops are immediately unlinked to stop gradual memory build-up.

### Concurrency and Transactional Integrity
- **Optimistic Inventory Locking**: Inventory deductions during the cart checkout sequence execute immediate rows updates with strict matching conditions (`where: { stock: { gte: requestedQuantity } }`). This approach eliminates expensive, CPU-draining application-level task locks, offloading synchronization securely onto native database processes.
