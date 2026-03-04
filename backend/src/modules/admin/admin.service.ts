import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";
import { AppError } from "../../utils/appError.js";

export const adminService = {
  login: (password: string) => {
    if (password !== env.ADMIN_PASSWORD_HASH) {
      throw new AppError(401, "Credenciales inválidas");
    }
    return jwt.sign({ role: "admin" }, env.ADMIN_JWT_SECRET, { expiresIn: "12h" });
  }
};
