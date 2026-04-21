import { NextResponse } from "next/server";
import { GenerateJsonRequestSchema } from "@/lib/schemas";
import { ai, JSON_GENERATION_SYSTEM_PROMPT } from "@/lib/gemini";
import { Type, Schema } from "@google/genai";

// A helper to dynamically build the schema constraint from required_fields
function buildDynamicSchema(requiredFields: string[]): Schema {
  const properties: Record<string, Schema> = {};

  if (requiredFields.includes("image_type")) properties.image_type = { type: Type.STRING };
  if (requiredFields.includes("overall_style")) properties.overall_style = { type: Type.STRING };

  if (requiredFields.includes("composition")) {
    properties.composition = {
      type: Type.OBJECT,
      properties: {
        framing: { type: Type.STRING },
        orientation: { type: Type.STRING },
        camera_angle: { type: Type.STRING },
        perspective: { type: Type.STRING },
        rule_of_thirds: { type: Type.STRING },
        depth: { type: Type.STRING }
      }
    };
  }

  if (requiredFields.includes("subjects")) {
    properties.subjects = {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          count: { type: Type.INTEGER },
          description: { type: Type.STRING },
          pose: { type: Type.STRING },
          expression: { type: Type.STRING },
          gaze: { type: Type.STRING },
          emotion: { type: Type.STRING }
        }
      }
    };
  }

  if (requiredFields.includes("appearance")) {
    properties.appearance = {
      type: Type.OBJECT,
      properties: {
        hair: { type: Type.OBJECT, properties: { color: { type: Type.STRING }, length: { type: Type.STRING }, texture: { type: Type.STRING } } },
        makeup: { type: Type.OBJECT, properties: { style: { type: Type.STRING }, details: { type: Type.STRING } } }
      }
    };
  }

  if (requiredFields.includes("wardrobe")) {
    properties.wardrobe = {
      type: Type.OBJECT,
      properties: {
        top: { type: Type.OBJECT, properties: { type: { type: Type.STRING }, color: { type: Type.STRING }, fit: { type: Type.STRING }, texture: { type: Type.STRING } } },
        bottom: { type: Type.OBJECT, properties: { type: { type: Type.STRING }, color: { type: Type.STRING }, fit: { type: Type.STRING }, texture: { type: Type.STRING } } }
      }
    };
  }

  if (requiredFields.includes("environment")) {
    properties.environment = {
      type: Type.OBJECT,
      properties: {
        setting: { type: Type.STRING },
        landscape: { type: Type.STRING },
        vegetation: { type: Type.STRING },
        season: { type: Type.STRING },
        sky: { type: Type.STRING }
      }
    };
  }

  if (requiredFields.includes("lighting")) {
    properties.lighting = {
      type: Type.OBJECT,
      properties: {
        type: { type: Type.STRING },
        direction: { type: Type.STRING },
        quality: { type: Type.STRING },
        highlights: { type: Type.STRING },
        shadows: { type: Type.STRING }
      }
    };
  }

  if (requiredFields.includes("color_palette")) {
    properties.color_palette = {
      type: Type.OBJECT,
      properties: {
        dominant_colors: { type: Type.ARRAY, items: { type: Type.STRING } },
        accent_colors: { type: Type.ARRAY, items: { type: Type.STRING } },
        overall_tone: { type: Type.STRING },
        saturation: { type: Type.STRING }
      }
    };
  }

  if (requiredFields.includes("background")) {
    properties.background = {
      type: Type.OBJECT,
      properties: {
        depth_of_field: { type: Type.STRING },
        focus: { type: Type.STRING },
        atmosphere: { type: Type.STRING }
      }
    };
  }

  if (requiredFields.includes("technical_traits")) {
    properties.technical_traits = {
      type: Type.OBJECT,
      properties: {
        lens_look: { type: Type.STRING },
        sharpness: { type: Type.STRING },
        noise: { type: Type.STRING },
        post_processing: { type: Type.STRING }
      }
    };
  }

  if (requiredFields.includes("artistic_elements")) {
    properties.artistic_elements = {
      type: Type.OBJECT,
      properties: {
        mood: { type: Type.STRING },
        aesthetic: { type: Type.STRING },
        storytelling: { type: Type.STRING },
        visual_style: { type: Type.STRING }
      }
    };
  }

  if (requiredFields.includes("typography")) {
    properties.typography = {
      type: Type.OBJECT,
      properties: {
        present: { type: Type.BOOLEAN },
        text_content: { type: Type.ARRAY, items: { type: Type.STRING } }
      }
    };
  }

  // Master Prompt is ALWAYS included
  properties.master_prompt = {
    type: Type.STRING,
    description: "The final, extremely detailed, standalone master prompt containing all visual instructions synthesised. No other parameters are needed to understand this scene."
  };

  return {
    type: Type.OBJECT,
    properties,
    required: ["master_prompt"],
  };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = GenerateJsonRequestSchema.parse(body);

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "Gemini API key is missing" }, { status: 500 });
    }

    const promptText = `Generate a detailed JSON prompt payload for this request: "${parsed.prompt}"
Please strictly follow the aspect ratio constraint: ${parsed.aspect_ratio}.`;

    const parts: any[] = [{ text: promptText }];

    if (parsed.images && parsed.images.length > 0) {
      for (const b64Image of parsed.images) {
        const base64Data = b64Image.split(",")[1];
        const mimeType = b64Image.match(/data:(.*?);base64/)?.[1] || "image/jpeg";
        parts.push({
          inlineData: {
            data: base64Data,
            mimeType: mimeType,
          }
        });
      }
    }

    const dynamicSchema = buildDynamicSchema(parsed.required_fields);

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ role: "user", parts }],
      config: {
        systemInstruction: JSON_GENERATION_SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: dynamicSchema,
        temperature: 0.7,
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("No text returned from Gemini");
    }

    const data = JSON.parse(responseText);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Generate JSON Error:", error);
    return NextResponse.json(
      { error: "Failed to generate structured JSON payload." },
      { status: 400 }
    );
  }
}
