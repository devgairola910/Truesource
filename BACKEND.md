# TrueSource Backend Guide

This document describes the backend APIs implemented for the MVP.

## Architecture

- Runtime: Next.js App Router route handlers in `app/api`.
- Data store: in-memory state managed in `lib/backend/store.ts`.
- Validation: centralized helpers in `lib/backend/validators.ts`.
- HTTP helpers and auth guard: `lib/backend/http.ts`.
- Contracts and domain types: `lib/backend/types.ts`.

## Authentication

Session model:
- Login and signup return a `sessionToken`.
- Protected APIs require `Authorization: Bearer <sessionToken>`.

Endpoints:
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/session`
- `DELETE /api/auth/session`

## Domain APIs

Protected endpoints:
- `GET /api/assets`
- `POST /api/assets`
- `GET /api/candidates`
- `GET /api/alerts`
- `PATCH /api/alerts/:alertId`
- `GET /api/whitelist`
- `POST /api/whitelist`
- `DELETE /api/whitelist?domain=<domain>`
- `GET /api/kpis`
- `GET /api/dashboard`
- `GET /api/contact`

Public endpoint:
- `POST /api/contact`

Health endpoint:
- `GET /api/health`

## Notes

- Current storage is process-memory only and resets on server restart.
- This is suitable for MVP/demo workflows and local development.
- For production, replace in-memory state with persistent DB storage and secure session cookies.
