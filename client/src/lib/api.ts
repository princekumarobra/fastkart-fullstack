/**
 * Core API fetch wrapper that automatically handles JWT authentication
 * reading from localStorage, and processes Zod responses.
 */

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem("auth_token");
  const headers = new Headers(options.headers);
  
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  // Auto-set Content-Type to JSON if not sending FormData
  if (!(options.body instanceof FormData)) {
    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
  } else {
    // If FormData, browser automatically sets Content-Type with boundary
    headers.delete("Content-Type");
  }

  const res = await fetch(url, { ...options, headers });

  if (!res.ok) {
    let errorMessage = res.statusText;
    try {
      const errorData = await res.json();
      errorMessage = errorData.message || errorMessage;
    } catch (e) {
      // Ignore parse error
    }
    throw new Error(errorMessage);
  }

  if (res.status === 204) return null;
  return res.json();
}
