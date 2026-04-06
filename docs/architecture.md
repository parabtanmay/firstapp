# Azure Smart Photos Architecture

## Services
- **Azure Blob Storage**
  - `media` container for originals (images/videos)
  - `thumbnails` container for generated previews
- **Azure Cosmos DB**
  - `mediaItems` container: tags, captions, faces, geo/time metadata, stream links
  - `people` container: face-group identity map and optional person names
- **Azure AI Services**
  - Computer Vision Image Analysis: auto-tags + captions
  - Face API: face detection and person grouping bootstrap
- **Azure CDN**
  - Front-door acceleration for media/thumbnail delivery
- **Azure AD**
  - OAuth2/OpenID Connect for identity and token exchange

## Upload Flow
1. Frontend asks backend for upload SAS.
2. Backend returns constrained per-blob SAS URL.
3. Frontend uploads directly to blob storage.
4. Frontend calls finalize endpoint.
5. Backend runs AI pipeline and stores normalized metadata in Cosmos DB.

## Search Flow
1. User submits natural language query.
2. Backend extracts semantic terms.
3. Backend scores matching media tags/captions and returns ranked timeline cards.

## Dynamic Albums
- **Events**: clustered by timestamp proximity and same-location heuristics.
- **Trips**: scene/tag driven clustering for travel/outdoor assets.
- **People**: based on face IDs and user-managed display labels.
