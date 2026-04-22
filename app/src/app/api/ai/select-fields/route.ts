import { NextResponse } from "next/server";
import { SelectFieldsRequestSchema } from "@/lib/schemas";
import { ai, FIELD_SELECTION_SYSTEM_PROMPT, FieldSelectionSchema } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = SelectFieldsRequestSchema.parse(body);

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "Gemini API key is missing" }, { status: 500 });
    }

    const promptText = `User Request: ${parsed.prompt}`;

    // If there are images, we'd add them to the contents array as parts
    // But for select-fields, just text is often enough, or we can include images if provided
    const parts: any[] = [{ text: promptText }];

    if (parsed.images && parsed.images.length > 0) {
      for (const b64Image of parsed.images) {
        // Strip data prefix (e.g., "data:image/jpeg;base64,")
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

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ role: "user", parts }],
      config: {
        systemInstruction: FIELD_SELECTION_SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: FieldSelectionSchema,
        temperature: 0.1, // Low temperature for deterministic field selection
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("No text returned from Gemini");
    }

    const data = JSON.parse(responseText);

    // Make sure master_prompt is always there
    if (!data.required_fields.includes("master_prompt")) {
      data.required_fields.push("master_prompt");
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Select Fields Error:", error);
    return NextResponse.json(
      { error: "Failed to analyze request and select fields." },
      { status: 400 }
    );
  }
}
