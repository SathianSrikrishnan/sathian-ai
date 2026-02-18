/**
 * Generate Ambassador car image using Google Gemini (same as btc-atlas pipeline)
 */

import { writeFileSync, readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const ENV_PATH = "C:/Users/sathi/kai/.env";
const envContent = readFileSync(ENV_PATH, "utf-8");
const API_KEY = envContent.match(/GOOGLE_API_KEY=(.+)/)?.[1]?.trim();
if (!API_KEY) throw new Error("GOOGLE_API_KEY not found in " + ENV_PATH);

const MODEL = "gemini-3-pro-image-preview";
const OUTPUT = resolve(__dirname, "../public/media/india-ambassador-1991.jpg");

const STYLE = `Archival documentary style. Muted earth tones, warm sepia hints, textured grain. Feels like a found photograph or museum exhibition print. Thoughtful composition, reverent mood. Like a Ken Burns documentary frame or Magnum Photos editorial. Historical weight without being dusty.`;

const SCENE = `A white Hindustan Ambassador car — India's iconic sedan — on a dusty Delhi road in 1991. Early morning golden hour light cutting through haze. The car is slightly worn, paint softened by decades of sun. Background: a hazy Indian streetscape with auto-rickshaws, tangled power lines, and the outline of government buildings. The car dominates the frame — symbol of the License Raj, an era about to end. A billion people are about to enter the global economy. Shot on film, Kodachrome palette.`;

const fullPrompt = `Generate an image. Style: ${STYLE}\n\nScene: ${SCENE}\n\nAspect ratio: 3:4 portrait orientation. High resolution, editorial quality. No text or watermarks in the image.`;

async function main() {
  console.log("Generating Ambassador car image...");
  console.log("Model:", MODEL);

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: fullPrompt }] }],
        generationConfig: { responseModalities: ["TEXT", "IMAGE"] },
      }),
    }
  );

  const data = await res.json();

  if (data.error) {
    console.error("API Error:", JSON.stringify(data.error, null, 2));
    process.exit(1);
  }

  const parts = data.candidates?.[0]?.content?.parts || [];
  for (const part of parts) {
    if (part.inlineData?.mimeType?.startsWith("image/")) {
      writeFileSync(OUTPUT, Buffer.from(part.inlineData.data, "base64"));
      console.log("Saved:", OUTPUT);
      return;
    }
  }

  console.error("No image in response. Parts:", parts.map(p => p.text || `[${p.inlineData?.mimeType}]`));
}

main().catch(console.error);
