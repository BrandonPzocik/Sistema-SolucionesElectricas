const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";

export const api = {
  get: async <T>(path: string, headers: Record<string, string> = {}) => {
    const res = await fetch(`${API_URL}${path}`, { headers });
    if (!res.ok) throw new Error(await res.text());
    return (await res.json()) as T;
  },
  post: async <T>(path: string, body: unknown, headers: Record<string, string> = {}) => {
    const res = await fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error(await res.text());
    return res.status === 204 ? (undefined as T) : ((await res.json()) as T);
  },
  put: async <T>(path: string, body: unknown, headers: Record<string, string> = {}) => {
    const res = await fetch(`${API_URL}${path}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error(await res.text());
    return (await res.json()) as T;
  },
  delete: async (path: string, headers: Record<string, string> = {}) => {
    const res = await fetch(`${API_URL}${path}`, { method: "DELETE", headers });
    if (!res.ok) throw new Error(await res.text());
  }
};
