
export const WEBHOOK_CONFIG = {
  DEFAULT_URL: "https://n8n.srv975434.hstgr.cloud/webhook/ebcbe106-bb56-412f-ba8c-5871e3237eac",
  TIMEOUT_DURATION: 25 * 60 * 1000, // 25 minutes
  STORAGE_KEY: 'n8nWebhookUrl'
};

export function getWebhookUrl(): string {
  // Always use the current DEFAULT_URL and update localStorage
  localStorage.setItem(WEBHOOK_CONFIG.STORAGE_KEY, WEBHOOK_CONFIG.DEFAULT_URL);
  return WEBHOOK_CONFIG.DEFAULT_URL;
}
