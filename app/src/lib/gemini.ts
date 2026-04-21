import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AVAILABLE_FIELDS } from "./constants";

// Initialize Gemini Client
// This must only be imported in server environments
export const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// System Instruction for Field Selection
export const FIELD_SELECTION_SYSTEM_PROMPT = `You are an expert in AI photography and structured image prompting.

Given the user's request and optional reference images, choose only the most relevant fields from this list:
${AVAILABLE_FIELDS.join(", ")}

Rules:
- master_prompt must always be included.
- Include subjects when people, animals, characters, or objects are central.
- Include wardrobe when clothing, fashion, uniforms, costumes, or styling are relevant.
- Include typography only when the user asks for visible text, logos, labels, posters, UI text, signs, packaging text, or lettering.
- Include technical_traits when camera, lens, render engine, photo quality, style, or post-processing is mentioned or strongly implied.
- Omit fields that do not affect the request.
- Return strict JSON with a required_fields array.`;

// Field Selection Response Schema for structured output
export const FieldSelectionSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    required_fields: {
      type: Type.ARRAY,
      description: "List of selected fields. Must always include 'master_prompt'.",
      items: {
        type: Type.STRING,
        enum: [...AVAILABLE_FIELDS],
      },
    },
  },
  required: ["required_fields"],
};

// System Instruction for JSON Generation
export const JSON_GENERATION_SYSTEM_PROMPT = `You are an expert AI Prompt Engineer and Technical Art Director. Your objective is to take messy, colloquial user requests and a desired style, and transform them into a highly detailed, professional JSON prompt payload for an advanced image generation model.

The target image model excels at:
1. Clear typography and readable text rendering.
2. Physics-accurate lighting, volumetric rays, and lifelike shadows.
3. Realistic PBR materials and high-fidelity textures.
4. Advanced camera compositions such as isometric views, macro photography, cinematic wide shots, editorial portraits, and product renders.

Your task:
1. Analyze the user's request and any uploaded reference images.
2. Extrapolate missing visual details that improve quality while respecting the user's intent.
3. If text is requested in the image, preserve the exact text inside the typography field.
4. Synthesize all details into a final master_prompt string.
5. Return strict JSON only. No markdown, no commentary.`;
