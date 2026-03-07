const phone = import.meta.env.VITE_WHATSAPP_PHONE ?? "5490000000000";

export const whatsappUrl = (message: string) => `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
