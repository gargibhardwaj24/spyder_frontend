/**
 * Auth service — consumes internal/auth (docs/03-api-design.md §3.1–3.2).
 *
 * Response shapes (snake_case) come straight from the backend's tokenResponse
 * and userView structs:
 *   tokenResponse: { user, access_token, expires_in, refresh_token }
 *   userView:      { id, email, full_name }
 *
 * The refresh token is only present in the body because we send
 * X-Client-Type: mobile (see services/api.ts).
 */
import * as SecureStore from "expo-secure-store";

import { apiFetch, ENDPOINTS } from "./api";

export type User = {
  id: string;
  email: string;
  full_name: string;
};

/** Backend tokenResponse, as-is. */
type TokenResponse = {
  user: User;
  access_token: string;
  expires_in: number;
  refresh_token: string;
};

export type AuthSession = {
  user: User;
  accessToken: string;
  refreshToken: string;
  /** Absolute epoch-ms when the access token expires (from expires_in). */
  expiresAt: number;
};

// Secure keychain/keystore keys.
const ACCESS_KEY = "spyder.accessToken";
const REFRESH_KEY = "spyder.refreshToken";

// ── Token persistence ──────────────────────────────────────────────────────

async function persist(res: TokenResponse): Promise<AuthSession> {
  await SecureStore.setItemAsync(ACCESS_KEY, res.access_token);
  await SecureStore.setItemAsync(REFRESH_KEY, res.refresh_token);
  return {
    user: res.user,
    accessToken: res.access_token,
    refreshToken: res.refresh_token,
    expiresAt: Date.now() + res.expires_in * 1000,
  };
}

export async function getAccessToken(): Promise<string | null> {
  return SecureStore.getItemAsync(ACCESS_KEY);
}

export async function getRefreshToken(): Promise<string | null> {
  return SecureStore.getItemAsync(REFRESH_KEY);
}

export async function clearTokens(): Promise<void> {
  await SecureStore.deleteItemAsync(ACCESS_KEY);
  await SecureStore.deleteItemAsync(REFRESH_KEY);
}

// ── Auth calls ─────────────────────────────────────────────────────────────

/** POST /auth/login → 200 tokenResponse. */
export async function login(
  email: string,
  password: string
): Promise<AuthSession> {
  const res = await apiFetch<TokenResponse>(ENDPOINTS.login, {
    method: "POST",
    body: { email, password },
  });
  return persist(res);
}

/** POST /auth/signup → 201 tokenResponse. Password must be ≥ 12 chars. */
export async function signup(
  fullName: string,
  email: string,
  password: string
): Promise<AuthSession> {
  const res = await apiFetch<TokenResponse>(ENDPOINTS.signup, {
    method: "POST",
    body: { email, password, full_name: fullName },
  });
  return persist(res);
}

/**
 * POST /auth/refresh → 200 tokenResponse, rotating the refresh token.
 * The backend revokes the whole token family if a revoked token is replayed,
 * so on any failure we clear local tokens and force re-login.
 */
export async function refresh(): Promise<AuthSession | null> {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) return null;
  try {
    const res = await apiFetch<TokenResponse>(ENDPOINTS.refresh, {
      method: "POST",
      body: { refresh_token: refreshToken },
    });
    return persist(res);
  } catch {
    await clearTokens();
    return null;
  }
}

/** GET /me → 200 userView. Refreshes once on token expiry, then retries. */
export async function me(): Promise<User | null> {
  let token = await getAccessToken();
  if (!token) return null;
  try {
    return await apiFetch<User>(ENDPOINTS.me, { token });
  } catch {
    const session = await refresh();
    if (!session) return null;
    token = session.accessToken;
    try {
      return await apiFetch<User>(ENDPOINTS.me, { token });
    } catch {
      return null;
    }
  }
}

/** POST /auth/logout → 204. Best-effort server revoke, always clears locally. */
export async function logout(): Promise<void> {
  const refreshToken = await getRefreshToken();
  try {
    if (refreshToken) {
      await apiFetch(ENDPOINTS.logout, {
        method: "POST",
        body: { refresh_token: refreshToken },
      });
    }
  } catch {
    // ignore — local clear below is what matters
  }
  await clearTokens();
}
