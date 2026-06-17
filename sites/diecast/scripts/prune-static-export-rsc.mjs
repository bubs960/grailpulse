import { readdirSync, rmSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const outDir = fileURLToPath(new URL('../out/', import.meta.url))
let removed = 0

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry)
    const stat = statSync(path)
    if (stat.isDirectory()) {
      walk(path)
      continue
    }
    if (entry === 'index.txt') {
      rmSync(path)
      removed += 1
    }
  }
}

walk(outDir)
console.log(`Pruned ${removed} static export RSC payload files.`)
