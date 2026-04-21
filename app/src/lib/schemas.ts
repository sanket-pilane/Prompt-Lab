import { z } from "zod";
import { AVAILABLE_FIELDS } from "./constants";

export const SelectFieldsRequestSchema = z.object({
  prompt: z.string().min(1, "Prompt is required"),
  images: z.array(z.string()).max(3, "Max 3 images allowed").optional(),
});

export const SelectFieldsResponseSchema = z.object({
  required_fields: z.array(z.enum(AVAILABLE_FIELDS as any)),
});

export const GenerateJsonRequestSchema = z.object({
  prompt: z.string().min(1, "Prompt is required"),
  required_fields: z.array(z.string()),
  images: z.array(z.string()).max(3, "Max 3 images allowed").optional(),
  aspect_ratio: z.string().default("1:1"),
});
