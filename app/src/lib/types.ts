export type Role = "user" | "assistant";

export type GenerationState = 
  | "idle"
  | "analyzing"
  | "writing"
  | "rendering"
  | "complete"
  | "error";

export interface Message {
  id: string;
  role: Role;
  content: string; // The user prompt or error message
  images: string[]; // Base64 data URIs for uploaded images
  
  // Assistant specific fields
  state?: GenerationState;
  jsonPayload?: any; // The structured JSON
  generatedImageUrl?: string; // Base64 or URL
  aspectRatio?: string;
  timestamp: number;
}
