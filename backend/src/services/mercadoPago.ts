import { MercadoPagoConfig, Preference } from "mercadopago";
import { env } from "../config/env.js";

const client = new MercadoPagoConfig({ accessToken: env.MERCADO_PAGO_ACCESS_TOKEN });
export const preferenceClient = new Preference(client);
