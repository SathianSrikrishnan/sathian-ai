#!/usr/bin/env node
/**
 * Migrate kai/context files to Supabase
 * Run this locally: node scripts/migrate-context.js
 */

const fs = require('fs')
const path = require('path')

const KAI_CONTEXT_PATH = 'C:/Users/sathi/kai/context'
const API_URL = process.env.API_URL || 'https://sathian.ai'

/**
 * Extract title from markdown content
 */
function extractTitle(content, filename) {
  const match = content.match(/^#\s+(.+)$/m)
  if (match) return match[1]
  return filename.replace('.md', '').replace(/-/g, ' ')
}

/**
 * Determine importance based on file location
 */
function determineImportance(filePath) {
  if (filePath.includes('universal')) return 10
  if (filePath.includes('biography') || filePath.includes('goals') || filePath.includes('preferences')) return 9
  if (filePath.includes('TELOS') || filePath.includes('knowledge')) return 8
  if (filePath.includes('tools/fobs')) return 7
  if (filePath.includes('projects') || filePath.includes('roadmap')) return 6
  if (filePath.includes('agents')) return 5
  return 5
}

/**
 * Categorize file based on path
 */
function categorizeFile(filePath) {
  const relativePath = filePath.replace(KAI_CONTEXT_PATH, '').replace(/^[/\\]/, '')

  if (relativePath.startsWith('knowledge')) {
    if (relativePath.includes('TELOS')) return { category: 'knowledge', subcategory: 'telos' }
    if (relativePath.includes('social-media')) return { category: 'knowledge', subcategory: 'social-media' }
    return { category: 'knowledge', subcategory: 'core' }
  }
  if (relativePath.startsWith('tools/fobs')) return { category: 'tools', subcategory: 'fobs' }
  if (relativePath.startsWith('tools')) return { category: 'tools', subcategory: 'commands' }
  if (relativePath.startsWith('agents')) return { category: 'agents', subcategory: null }
  if (relativePath.startsWith('projects')) return { category: 'projects', subcategory: 'planning' }
  if (relativePath.startsWith('roadmap')) return { category: 'roadmap', subcategory: null }
  if (relativePath.startsWith('telos')) return { category: 'telos', subcategory: null }
  if (relativePath.startsWith('substrate')) return { category: 'substrate', subcategory: null }
  if (relativePath.startsWith('storybook')) return { category: 'storybook', subcategory: null }
  if (relativePath.startsWith('fabric-workflows')) return { category: 'workflows', subcategory: 'fabric' }
  if (relativePath.startsWith('writings')) return { category: 'writings', subcategory: null }
  if (relativePath === 'universal.md') return { category: 'universal', subcategory: 'identity' }
  return { category: 'other', subcategory: null }
}

/**
 * Recursively get all markdown files
 */
function getAllMarkdownFiles(dir, files = []) {
  if (!fs.existsSync(dir)) return files

  const items = fs.readdirSync(dir, { withFileTypes: true })
  for (const item of items) {
    const fullPath = path.join(dir, item.name)
    if (item.isDirectory() && !item.name.startsWith('.') && item.name !== 'node_modules') {
      getAllMarkdownFiles(fullPath, files)
    } else if (item.isFile() && item.name.endsWith('.md')) {
      files.push(fullPath)
    }
  }
  return files
}

async function migrate() {
  console.log('Kai Context Migration')
  console.log('=====================')
  console.log(`Source: ${KAI_CONTEXT_PATH}`)
  console.log(`Target: ${API_URL}/api/setup/migrate`)
  console.log('')

  // Check if source exists
  if (!fs.existsSync(KAI_CONTEXT_PATH)) {
    console.error(`Error: Source path not found: ${KAI_CONTEXT_PATH}`)
    process.exit(1)
  }

  // Get all markdown files
  const files = getAllMarkdownFiles(KAI_CONTEXT_PATH)
  console.log(`Found ${files.length} markdown files`)

  // Build entries
  const entries = []
  for (const filePath of files) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8')
      if (!content || content.trim().length < 50) continue

      const { category, subcategory } = categorizeFile(filePath)
      const filename = path.basename(filePath)
      const title = extractTitle(content, filename)
      const importance = determineImportance(filePath)
      const source_file = filePath.replace(KAI_CONTEXT_PATH, '').replace(/^[/\\]/, '').replace(/\\/g, '/')

      entries.push({
        category,
        subcategory,
        title,
        content,
        source_file,
        importance,
      })
    } catch (e) {
      console.error(`Skipping ${filePath}: ${e.message}`)
    }
  }

  console.log(`Prepared ${entries.length} entries for migration`)
  console.log('')

  // Send to API in batches
  const BATCH_SIZE = 20
  let totalSuccess = 0
  let totalFailed = 0

  for (let i = 0; i < entries.length; i += BATCH_SIZE) {
    const batch = entries.slice(i, i + BATCH_SIZE)
    console.log(`Uploading batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(entries.length / BATCH_SIZE)}...`)

    try {
      const response = await fetch(`${API_URL}/api/setup/migrate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entries: batch }),
      })

      const result = await response.json()

      if (result.success) {
        totalSuccess += result.results.success
        totalFailed += result.results.failed
        if (result.results.errors?.length > 0) {
          console.log('  Errors:', result.results.errors.slice(0, 3).join(', '))
        }
      } else {
        console.error('  Batch failed:', result.error || result.details)
        totalFailed += batch.length
      }
    } catch (e) {
      console.error('  Network error:', e.message)
      totalFailed += batch.length
    }
  }

  console.log('')
  console.log('Migration Complete')
  console.log('==================')
  console.log(`Success: ${totalSuccess}`)
  console.log(`Failed: ${totalFailed}`)
  console.log('')
  console.log('Test the voice assistant at: https://sathian.ai/voice')
}

migrate().catch(console.error)
