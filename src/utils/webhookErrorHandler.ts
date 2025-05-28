
export interface WebhookError {
  message: string;
  timestamp: number;
}

export function createWebhookError(error: unknown, timeoutDuration: number): string {
  let errorMsg = String(error);
  
  if (error instanceof Error) {
    if (error.name === 'AbortError') {
      errorMsg = `Die Analyse dauerte länger als ${timeoutDuration / 60000} Minuten und wurde abgebrochen. Dies kann bei sehr komplexen Verträgen vorkommen. Bitte versuchen Sie es erneut oder kontaktieren Sie den Support.`;
      console.error("=== TIMEOUT ERROR ===");
      console.error(`Analysis timed out after ${timeoutDuration / 1000} seconds`);
    } else if (error.message.includes('fetch') || error.message.includes('network')) {
      errorMsg = "Netzwerkfehler beim Verbinden zum Analyse-Server. Bitte überprüfen Sie Ihre Internetverbindung und versuchen Sie es erneut.";
      console.error("=== NETWORK ERROR ===");
    } else if (error.message.includes('Failed to fetch')) {
      errorMsg = "Verbindung zum Server unterbrochen. Dies kann bei sehr langen Analysen vorkommen. Bitte versuchen Sie es erneut.";
      console.error("=== FETCH ERROR ===");
    }
  }
  
  console.error("=== WEBHOOK ERROR ===");
  console.error("Error details:", error);
  console.error("Error type:", error instanceof Error ? error.name : typeof error);
  console.error("Error message:", error instanceof Error ? error.message : error);
  
  return errorMsg;
}

export function canResetError(errorTimeStamp: number | null): boolean {
  if (!errorTimeStamp) return true;
  
  const minTimeMs = 300000; // 5 minutes in milliseconds
  const currentTime = Date.now();
  const timeElapsed = currentTime - errorTimeStamp;
  
  return timeElapsed >= minTimeMs;
}

export function getRemainingErrorTime(errorTimeStamp: number | null): number {
  if (!errorTimeStamp) return 0;
  
  const minTimeMs = 300000; // 5 minutes in milliseconds
  const currentTime = Date.now();
  const timeElapsed = currentTime - errorTimeStamp;
  const remainingMs = Math.max(0, minTimeMs - timeElapsed);
  
  return Math.ceil(remainingMs / 1000); // Return remaining time in seconds
}
