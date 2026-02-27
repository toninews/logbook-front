import { API_ROUTES } from "~/utils/apiRoutes";

export class ApiError extends Error {
  constructor(message, status, details = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

function getWriteTokenHeader(writeToken) {
  const normalizedWriteToken = normalizeWriteToken(writeToken);

  if (!normalizedWriteToken) {
    return {};
  }

  return {
    "x-write-token": normalizedWriteToken,
  };
}

function normalizeWriteToken(writeToken) {
  if (typeof writeToken !== "string") {
    return "";
  }

  const trimmed = writeToken.trim();
  const withSingleQuotes = /^'.*'$/.test(trimmed);
  const withDoubleQuotes = /^".*"$/.test(trimmed);

  if (withSingleQuotes || withDoubleQuotes) {
    return trimmed.slice(1, -1).trim();
  }

  return trimmed;
}

async function readErrorDetails(response) {
  const rawBody = await response.text();

  try {
    return JSON.parse(rawBody);
  } catch {
    return rawBody;
  }
}

async function handleErrorResponse(response) {
  const details = await readErrorDetails(response);
  throw new ApiError("Request failed", response.status, details);
}

export async function fetchLogs({ apiBase, page = 1, search = "" }) {
  const queryParams = new URLSearchParams({
    page: String(page),
    search,
  });

  const response = await fetch(
    `${apiBase}${API_ROUTES.GET_LIST}?${queryParams.toString()}`,
  );

  if (!response.ok) {
    await handleErrorResponse(response);
  }

  return response.json();
}

export async function createLog({ apiBase, writeToken, registrationData }) {
  const response = await fetch(`${apiBase}${API_ROUTES.INSERT_TASK}`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      ...getWriteTokenHeader(writeToken),
    },
    body: JSON.stringify(registrationData),
  });

  if (!response.ok) {
    await handleErrorResponse(response);
  }

  return response.json();
}

export async function deleteLog({ apiBase, writeToken, id }) {
  const response = await fetch(`${apiBase}${API_ROUTES.DELETE_TASK(id)}`, {
    method: "DELETE",
    headers: {
      ...getWriteTokenHeader(writeToken),
    },
  });

  if (!response.ok) {
    await handleErrorResponse(response);
  }
}
