const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024;

function doPost(event) {
  try {
    const request = parseRequest(event);
    const user = authenticate(request.accessToken);
    validatePayload(request.payload);

    const folder = DriveApp.getFolderById(requiredProperty("DRIVE_FOLDER_ID"));
    const bytes = Utilities.base64Decode(request.payload.data);
    const blob = Utilities.newBlob(
      bytes,
      request.payload.mimeType,
      buildFileName(request.payload.fileName, user.id),
    );
    const file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

    return jsonResponse({
      ok: true,
      fileId: file.getId(),
      url: `https://drive.google.com/uc?export=view&id=${file.getId()}`,
    });
  } catch (error) {
    return jsonResponse({
      ok: false,
      error: error instanceof Error ? error.message : "Upload failed",
    });
  }
}

function parseRequest(event) {
  if (!event || !event.postData || !event.postData.contents) {
    throw new Error("Request body is required");
  }

  const payload = JSON.parse(event.postData.contents);
  const authorization = event.parameter && event.parameter.authorization;
  const header =
    authorization ||
    event.headers?.Authorization ||
    event.headers?.authorization;
  const accessToken =
    payload.accessToken || (header && header.replace(/^Bearer\s+/i, ""));
  if (!accessToken) throw new Error("Authorization token is required");

  return {
    accessToken: accessToken,
    payload: payload,
  };
}

function authenticate(accessToken) {
  const supabaseUrl = requiredProperty("SUPABASE_URL");
  const response = UrlFetchApp.fetch(`${supabaseUrl}/auth/v1/user`, {
    method: "get",
    headers: {
      apikey: requiredProperty("SUPABASE_ANON_KEY"),
      Authorization: `Bearer ${accessToken}`,
    },
    muteHttpExceptions: true,
  });

  if (response.getResponseCode() !== 200)
    throw new Error("Invalid authorization token");
  return JSON.parse(response.getContentText());
}

function validatePayload(payload) {
  if (!payload || !payload.data || !payload.mimeType || !payload.fileName) {
    throw new Error("Image payload is incomplete");
  }
  if (!ALLOWED_MIME_TYPES.includes(payload.mimeType)) {
    throw new Error("Unsupported image type");
  }
  const estimatedSize = Math.ceil((payload.data.length * 3) / 4);
  if (estimatedSize > MAX_FILE_SIZE_BYTES)
    throw new Error("Image is larger than 8 MB");
  if (!payload.placeId || !payload.shotPointId || !payload.capturedAt) {
    throw new Error("Submission metadata is incomplete");
  }
}

function buildFileName(originalName, userId) {
  const safeName = String(originalName).replace(/[^a-zA-Z0-9._-]/g, "_");
  return `${new Date().toISOString()}_${userId}_${safeName}`;
}

function requiredProperty(name) {
  const value = PropertiesService.getScriptProperties().getProperty(name);
  if (!value) throw new Error(`Missing Apps Script property: ${name}`);
  return value;
}

function jsonResponse(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
