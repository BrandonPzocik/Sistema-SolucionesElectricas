const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";

const normalizeError = (error: unknown) => {
  if (error instanceof Error) {
    if (error.name === "TypeError") {
      return "No se pudo conectar con la API. Verificá que el backend esté corriendo en http://localhost:4000.";
    }
    return error.message;
  }
  return "Ocurrió un error inesperado";
};

const parseResponseError = async (res: Response) => {
  let detail = "";
  try {
    detail = await res.text();
  } catch {
    detail = "";
  }

  return detail || `Error HTTP ${res.status}`;
};

export const api = {
  get: async <T>(path: string, headers: Record<string, string> = {}) => {
    try {
      const res = await fetch(`${API_URL}${path}`, { headers });
      if (!res.ok) throw new Error(await parseResponseError(res));
      return (await res.json()) as T;
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },
  post: async <T>(path: string, body: unknown, headers: Record<string, string> = {}) => {
    try {
      const res = await fetch(`${API_URL}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...headers },
        body: JSON.stringify(body)
      });
      if (!res.ok) throw new Error(await parseResponseError(res));
      return res.status === 204 ? (undefined as T) : ((await res.json()) as T);
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },
  put: async <T>(path: string, body: unknown, headers: Record<string, string> = {}) => {
    try {
      const res = await fetch(`${API_URL}${path}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...headers },
        body: JSON.stringify(body)
      });
      if (!res.ok) throw new Error(await parseResponseError(res));
      return (await res.json()) as T;
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },
  delete: async (path: string, headers: Record<string, string> = {}) => {
    try {
      const res = await fetch(`${API_URL}${path}`, { method: "DELETE", headers });
      if (!res.ok) throw new Error(await parseResponseError(res));
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  }
};
