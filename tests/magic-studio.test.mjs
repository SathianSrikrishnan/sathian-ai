import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { Buffer } from "node:buffer"
import { describe, it } from "node:test"
import ts from "typescript"

const source = readFileSync("src/lib/toothfairy/magic-studio.ts", "utf8")
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ES2022,
    target: ts.ScriptTarget.ES2022,
  },
})
const moduleUrl = `data:text/javascript;base64,${Buffer.from(
  compiled.outputText
).toString("base64")}`

const {
  MAGIC_GENERATION_COST_USD,
  MAGIC_STYLES,
  STARTER_MAGIC_CREDITS,
  buildMagicPrompt,
  getMagicStyle,
  normalizeMagicStyles,
  projectMagicCost,
} = await import(moduleUrl)

describe("Magic Studio style rules", () => {
  it("offers three starter credits at the current provider cost", () => {
    assert.equal(STARTER_MAGIC_CREDITS, 3)
    assert.equal(MAGIC_GENERATION_COST_USD, 0.04)
    assert.equal(projectMagicCost(STARTER_MAGIC_CREDITS), 0.12)
  })

  it("ships the MVP style set without the seasonal card style", () => {
    const ids = MAGIC_STYLES.map((style) => style.id)

    assert.deepEqual(ids, [
      "tanda-glow",
      "storybook-ink",
      "watercolor-memory",
      "pencil-charm",
      "cartoon-3d",
      "tradition-magic",
    ])
    assert.equal(ids.includes("mothers-day-card"), false)
  })

  it("normalizes selected styles to unique valid ids and caps them by credits", () => {
    assert.deepEqual(
      normalizeMagicStyles(
        ["cartoon-3d", "unknown", "cartoon-3d", "tanda-glow", "storybook-ink"],
        2
      ),
      ["cartoon-3d", "tanda-glow"]
    )
  })

  it("builds transform prompts that preserve the child's original drawing", () => {
    const prompt = buildMagicPrompt({
      style: getMagicStyle("cartoon-3d"),
      tradition: "anka",
    }).toLowerCase()

    assert.match(prompt, /preserve/)
    assert.match(prompt, /child/)
    assert.match(prompt, /same overall composition/)
    assert.match(prompt, /transform/)
    assert.match(prompt, /3d cartoon/)
    assert.match(prompt, /amazon|jungle|emerald/)
  })
})
