
export interface WebhookResponse {
  success: boolean;
  data?: any;
  error?: string;
  analysisResult?: any;
}

export interface WebhookConfig {
  url: string;
  timeoutDuration: number;
  defaultUrl: string;
}
