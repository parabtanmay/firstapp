# Deployment Guide

## 1) Provision Azure Resources
1. Storage Account + Blob containers (`media`, `thumbnails`)
2. Cosmos DB account (SQL API), database `smartphotos`, containers `mediaItems`, `people`
3. Azure AI multi-service resource (Vision + Face)
4. Azure CDN profile and endpoint
5. App Service (backend) and Static Web App or Vercel/Azure Front Door (frontend)

## 2) Configure Backend App Settings
Set all variables from `backend/.env.example` in App Service configuration.

## 3) Build and Deploy
- Backend:
  - `npm install`
  - `npm run build:backend`
  - `npm --workspace backend run start`
- Frontend:
  - `npm run build:frontend`
  - `npm --workspace frontend run start`

## 4) Enable Security
- Protect APIs with Azure AD app registration.
- Use managed identity or Key Vault references for secrets.
- Restrict CORS and SAS token TTL; grant minimal permissions.

## 5) Production Hardening
- Add queue-based async AI processing (Service Bus + worker).
- Add retry/dead-letter policy for AI calls.
- Add observability (App Insights + OpenTelemetry).
