/**
 * Central API client — matches docs/03-api-design.md and internal/auth.
 *
 * Base URL carries the /v1 version prefix. Set EXPO_PUBLIC_API_URL to the
 * origin only (no trailing slash); the /v1 is appended here.
 *   e.g.  EXPO_PUBLIC_API_URL=http://localhost:8080
 */
const ORIGIN = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:8080";
export const API_BASE_URL = `${ORIGIN}/v1`;

// This app is a mobile client. The backend keys refresh-token delivery off
// this header: with "mobile" the refresh token is returned in the JSON body;
// without it the server tries to set an httpOnly cookie instead (web flow).
export const CLIENT_TYPE = "mobile";

export const ENDPOINTS = {
  signup: "/auth/signup",
  login: "/auth/login",
  refresh: "/auth/refresh",
  logout: "/auth/logout",
  me: "/me",
} as const;

/**
 * Error envelope per docs/03-api-design.md §2.4:
 *   { "error": { "code", "message", "details" }, "request_id" }
 */
export class ApiError extends Error {
  status: number;
  /** Stable, machine-readable code (e.g. "invalid_credentials"). */
  code: string;
  details: unknown;
  requestId?: string;
  constructor(
    status: number,
    code: string,
    message: string,
    details?: unknown,
    requestId?: string
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
    this.requestId = requestId;
  }
}

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  /** Bearer access token, attached as `Authorization: Bearer <token>`. */
  token?: string | null;
};

/**
 * Thin fetch wrapper: JSON in/out, sends the mobile client header, attaches the
 * bearer token, and turns the error envelope into a typed ApiError.
 */
export async function apiFetch<T = unknown>(
  path: string,
  { body, token, headers, ...init }: RequestOptions = {}
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      "X-Client-Type": CLIENT_TYPE,
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 204) return undefined as T; // e.g. logout

  const text = await res.text();
  const data = text ? safeJsonParse(text) : null;

  if (!res.ok) {
    const env = (data ?? {}) as {
      error?: { code?: string; message?: string; details?: unknown };
      request_id?: string;
    };
    throw new ApiError(
      res.status,
      env.error?.code ?? "unknown",
      env.error?.message ?? `Request failed (${res.status})`,
      env.error?.details,
      env.request_id
    );
  }

  return data as T;
}

function safeJsonParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
