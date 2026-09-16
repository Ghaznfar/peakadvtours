/**
 * Build a click-to-chat WhatsApp URL from a number and optional prefilled
 * message. Number may contain spaces/symbols — they are stripped.
 */
export function buildWhatsAppUrl(whatsappNumber: string, message?: string): string {
  const digits = whatsappNumber.replace(/\D/g, '');
  const base = `https://wa.me/${digits}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
