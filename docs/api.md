# API Documentation

Base URL: `/api`

## Health
- `GET /health`

## Media
- `POST /media/upload/request`
  - body: `filename`, `contentType`, `mediaType`, optional `capturedAt`, `location`
  - returns SAS upload URL + mediaId
- `POST /media/upload/finalize`
  - body: `mediaId`
  - runs AI enrichment + face grouping + video streaming metadata generation
- `GET /media/timeline`
  - returns media timeline sorted by create date
- `GET /media/search?q=<natural_language>`
  - semantic/natural language search against tags
- `GET /media/albums`
  - dynamic auto albums
- `GET /media/memories`
  - same-day previous-year memories

## People
- `GET /people`
  - list clustered people and face counts
- `PATCH /people/:personId`
  - body: `displayName`

## Auth and Headers
- Current sample uses `x-user-id` header for partitioning.
- In production, replace with Azure AD JWT middleware and map claim `oid` to `userId`.
