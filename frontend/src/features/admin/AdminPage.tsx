import { useEffect, useState } from "react";
import { api } from "../../lib/api";

export const AdminPage = () => {
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(localStorage.getItem("admin_token") || "");
  const [dashboard, setDashboard] = useState<any>(null);

  const login = async () => {
    const { data } = await api.post("/admin/login", { password });
    localStorage.setItem("admin_token", data.token);
    setToken(data.token);
  };

  useEffect(() => {
    if (!token) return;
    api.get("/admin/dashboard", { headers: { Authorization: `Bearer ${token}` } }).then((res) => setDashboard(res.data));
  }, [token]);

  if (!token) {
    return (
      <div className="mx-auto max-w-sm space-y-3 rounded border bg-white p-4">
        <h1 className="text-xl font-semibold">Admin privado</h1>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded border px-3 py-2" placeholder="Contraseña" />
        <button onClick={login} className="w-full rounded bg-brand-500 py-2 text-white">Ingresar</button>
      </div>
    );
  }

  return (
    <section>
      <h1 className="text-2xl font-bold">Panel de administración</h1>
      <pre className="mt-4 overflow-auto rounded border bg-white p-3 text-xs">{JSON.stringify(dashboard, null, 2)}</pre>
    </section>
  );
};
