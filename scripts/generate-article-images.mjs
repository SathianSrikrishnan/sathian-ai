/**
 * Generate article images for sathian.ai
 * 1. Cypherpunk Manifesto — HTML screenshot via Playwright
 * 2. Ambassador car — Google Imagen API
 */

import { chromium } from "playwright";
import { writeFileSync, readFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const MEDIA_DIR = resolve(__dirname, "../public/media");
mkdirSync(MEDIA_DIR, { recursive: true });

// ─── 1. Cypherpunk Manifesto ───────────────────────────────────────────────

async function generateManifesto() {
  console.log("Generating Cypherpunk Manifesto image...");

  const html = `<!DOCTYPE html>
<html>
<head>
<style>
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    width: 1200px;
    height: 1600px;
    background: #0a0a0f;
    font-family: 'IBM Plex Mono', 'Courier New', monospace;
    color: #8b9bb4;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .container {
    width: 1000px;
    padding: 80px;
    position: relative;
  }

  /* Subtle scan lines */
  .container::before {
    content: '';
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(255,255,255,0.008) 2px,
      rgba(255,255,255,0.008) 4px
    );
    pointer-events: none;
    z-index: 10;
  }

  .header {
    font-size: 11px;
    color: #4a5568;
    margin-bottom: 40px;
    letter-spacing: 0.5px;
    line-height: 1.8;
  }

  .header .list { color: #06B6D4; opacity: 0.6; }
  .header .date { color: #6b7280; }

  .title {
    font-size: 28px;
    font-weight: 500;
    color: #06B6D4;
    margin-bottom: 48px;
    letter-spacing: -0.5px;
    text-shadow: 0 0 40px rgba(6, 182, 212, 0.15);
  }

  .body {
    font-size: 16px;
    line-height: 2;
    color: #9ca3af;
  }

  .body p {
    margin-bottom: 28px;
  }

  .highlight {
    color: #e2e8f0;
    background: rgba(6, 182, 212, 0.08);
    padding: 2px 6px;
    border-left: 2px solid rgba(6, 182, 212, 0.4);
  }

  .key-line {
    color: #06B6D4;
    font-weight: 500;
    text-shadow: 0 0 20px rgba(6, 182, 212, 0.1);
  }

  .fade {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 200px;
    background: linear-gradient(transparent, #0a0a0f);
    z-index: 5;
  }

  .glow {
    position: absolute;
    top: -100px;
    left: 50%;
    transform: translateX(-50%);
    width: 600px;
    height: 300px;
    background: radial-gradient(ellipse, rgba(6, 182, 212, 0.04), transparent 70%);
    z-index: 0;
  }
</style>
</head>
<body>
  <div class="container">
    <div class="glow"></div>

    <div class="header">
      <span class="list">cypherpunks@toad.com</span><br>
      <span class="date">March 9, 1993</span><br>
      <span class="date">From: Eric Hughes &lt;hughes@soda.berkeley.edu&gt;</span>
    </div>

    <div class="title">A Cypherpunk's Manifesto</div>

    <div class="body">
      <p><span class="key-line">Privacy is necessary for an open society in the electronic age.</span> Privacy is not secrecy. A private matter is something one doesn't want the whole world to know, but a secret matter is something one doesn't want anybody to know. <span class="highlight">Privacy is the power to selectively reveal oneself to the world.</span></p>

      <p>We cannot expect governments, corporations, or other large, faceless organizations to grant us privacy out of their beneficence. It is to their advantage to speak of us, and we should expect that they will speak.</p>

      <p>We the Cypherpunks are dedicated to building anonymous systems. We are defending our privacy with cryptography, with anonymous mail forwarding systems, with digital signatures, and with <span class="key-line">electronic money</span>.</p>

      <p>Cypherpunks write code. We know that someone has to write software to defend privacy, and since we can't get privacy unless we all do, we're going to write it.</p>
    </div>

    <div class="fade"></div>
  </div>
</body>
</html>`;

  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1200, height: 1600 });
  await page.setContent(html, { waitUntil: "networkidle" });

  const outputPath = resolve(MEDIA_DIR, "cypherpunk-manifesto.jpg");
  await page.screenshot({
    path: outputPath,
    type: "jpeg",
    quality: 92,
  });

  await browser.close();
  console.log(`Saved: ${outputPath}`);
  return outputPath;
}

// ─── 2. Ambassador Car (Google Imagen) ─────────────────────────────────────

async function generateAmbassador() {
  console.log("Generating Ambassador car image...");

  const ENV_PATH = "C:/Users/sathi/kai/.env";
  const envContent = readFileSync(ENV_PATH, "utf-8");
  const API_KEY = envContent.match(/GOOGLE_API_KEY=(.+)/)?.[1]?.trim();
  if (!API_KEY) {
    console.error("GOOGLE_API_KEY not found in " + ENV_PATH);
    return null;
  }

  const prompt = `Documentary photography, 1991 India. A white Hindustan Ambassador car parked on a dusty Delhi road. Early morning golden hour light. The car is slightly worn, paint faded by sun. In the background, a hazy Indian streetscape — auto-rickshaws, power lines, a hint of government buildings. Archival documentary style, warm muted earth tones, textured grain like a found photograph. Shot on film, Kodachrome palette. No text, no people in focus. The car dominates the frame — symbol of an era about to end.`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${API_KEY}`;

  const body = {
    contents: [
      {
        parts: [
          {
            text: `Generate an image: ${prompt}`,
          },
        ],
      },
    ],
    generationConfig: {
      responseModalities: ["TEXT", "IMAGE"],
    },
  };

  try {
    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!resp.ok) {
      const errText = await resp.text();
      console.error("API error:", resp.status, errText);

      // Try with imagen-3.0-generate-002
      console.log("Trying imagen-3.0-generate-002...");
      const imagenUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${API_KEY}`;
      const imagenBody = {
        instances: [{ prompt }],
        parameters: {
          sampleCount: 1,
          aspectRatio: "3:4",
        },
      };
      const imagenResp = await fetch(imagenUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(imagenBody),
      });

      if (!imagenResp.ok) {
        console.error(
          "Imagen API error:",
          imagenResp.status,
          await imagenResp.text()
        );
        return null;
      }

      const imagenData = await imagenResp.json();
      const b64 =
        imagenData.predictions?.[0]?.bytesBase64Encoded ||
        imagenData.predictions?.[0]?.image?.bytesBase64Encoded;
      if (b64) {
        const outputPath = resolve(MEDIA_DIR, "india-ambassador-1991.jpg");
        writeFileSync(outputPath, Buffer.from(b64, "base64"));
        console.log(`Saved: ${outputPath}`);
        return outputPath;
      }
      return null;
    }

    const data = await resp.json();
    // Extract image from Gemini response
    const parts = data.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
      if (part.inlineData?.mimeType?.startsWith("image/")) {
        const outputPath = resolve(MEDIA_DIR, "india-ambassador-1991.jpg");
        writeFileSync(
          outputPath,
          Buffer.from(part.inlineData.data, "base64")
        );
        console.log(`Saved: ${outputPath}`);
        return outputPath;
      }
    }
    console.error("No image in response:", JSON.stringify(data, null, 2).slice(0, 500));
    return null;
  } catch (err) {
    console.error("Error:", err.message);
    return null;
  }
}

// ─── Run ────────────────────────────────────────────────────────────────────

async function main() {
  const manifesto = await generateManifesto();
  const ambassador = await generateAmbassador();

  console.log("\n─── Results ───");
  console.log("Manifesto:", manifesto || "FAILED");
  console.log("Ambassador:", ambassador || "FAILED");

  if (manifesto && ambassador) {
    console.log("\nBoth images generated. Update articles.ts media arrays.");
  }
}

main().catch(console.error);
