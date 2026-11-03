# v0.4.0 Google Drive uploader

This folder contains the Google Apps Script Web App used by the Vue frontend to upload submission images to Google Drive.

## Setup

1. Create or open a Google Apps Script project.
2. Add `Code.gs` to the project.
3. Set these Script Properties under **Project Settings**:
   - `SUPABASE_URL`: Supabase project URL
   - `SUPABASE_ANON_KEY`: Supabase anon key
   - `DRIVE_FOLDER_ID`: destination Google Drive folder ID
4. Deploy as a Web App:
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Copy the deployment `/exec` URL into `Frontend/.env` as `VITE_GAS_UPLOAD_URL`.

Do not put service-role keys or Drive credentials in the frontend. The Supabase anon key is only used by GAS when validating the submitted access token.

## Request contract

`POST` with JSON body:

```json
{
  "placeId": "place-id",
  "shotPointId": "shot-point-id",
  "capturedAt": "2026-09-18T12:00:00.000Z",
  "fileName": "photo.jpg",
  "mimeType": "image/jpeg",
  "data": "base64-without-data-url-prefix"
}
```

The frontend sends the Supabase access token as `accessToken` in the JSON body and also as `Authorization: Bearer <token>`. GAS validates it with `/auth/v1/user` before creating the Drive file.

Success:

```json
{
  "ok": true,
  "fileId": "drive-file-id",
  "url": "https://drive.google.com/uc?export=view&id=drive-file-id"
}
```

Images are limited to JPG, PNG, or WebP and 8 MB. The current implementation grants anyone-with-link view access so the image URL can be rendered in the user submission history. Review this policy before production launch.
