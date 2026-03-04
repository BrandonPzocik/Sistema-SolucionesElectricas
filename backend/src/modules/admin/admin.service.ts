import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";

export const adminService = {
  login: (password: string) => {
    if (password !== env.ADMIN_PASSWORD_HASH) {
      throw new Error("Credenciales inválidas");
    }
    return jwt.sign({ role: "admin" }, env.ADMIN_JWT_SECRET, { expiresIn: "12h" });
  }
};
