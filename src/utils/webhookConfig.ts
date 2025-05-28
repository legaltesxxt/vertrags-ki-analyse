
export const WEBHOOK_CONFIG = {
  DEFAULT_URL: "https://vertrags.app.n8n.cloud/webhook-test/3277c1f9-d2d0-48e5-b4b8-2cb84381f86e",
  TIMEOUT_DURATION: 25 * 60 * 1000, // 25 minutes
  STORAGE_KEY: 'n8nWebhookUrl'
};

export function getWebhookUrl(): string {
  const storedWebhookUrl = localStorage.getItem(WEBHOOK_CONFIG.STORAGE_KEY);
  return storedWebhookUrl || WEBHOOK_CONFIG.DEFAULT_URL;
}
