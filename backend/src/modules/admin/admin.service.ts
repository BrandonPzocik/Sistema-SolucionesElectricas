import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";
import { AppError } from "../../utils/appError.js";

export const adminService = {
  login: (password: string) => {
    const configuredPassword = env.ADMIN_PASSWORD ?? env.ADMIN_PASSWORD_HASH;

    if (!configuredPassword || password !== configuredPassword) {
      throw new AppError(401, "Credenciales inválidas");
    }

    return jwt.sign({ role: "admin" }, env.ADMIN_JWT_SECRET, { expiresIn: "12h" });
  }
};
