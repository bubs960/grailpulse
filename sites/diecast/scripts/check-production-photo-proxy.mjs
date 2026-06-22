import { execFileSync } from 'node:child_process'

const site = process.env.DIECAST_SITE_URL || 'https://diecast.grailpulse.com'
const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'
const curlBase = ['--ssl-no-revoke', '--noproxy', '*', '-sS', '-L', '-A', userAgent]
const html = execFileSync('curl.exe', [...curlBase, `${site}/`], { encoding: 'utf8', maxBuffer: 4 * 1024 * 1024 })
const paths = [...new Set([...html.matchAll(/(?:src|href)="(\/photo\?src=[^"]+)"/g)].map(match => match[1].replaceAll('&amp;', '&')))]

if (!paths.length) throw new Error('No proxied photos found on the production homepage.')

const results = []
for (const path of paths) {
  const headers = execFileSync('curl.exe', [
    ...curlBase,
    '-D', '-',
    '-o', 'NUL',
    '-e', `${site}/`,
    '-H', 'Accept: image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
    `${site}${path}`,
  ], {
    encoding: 'utf8',
    maxBuffer: 1024 * 1024,
  })
  const statusMatches = [...headers.matchAll(/^HTTP\/\S+\s+(\d+)/gmi)]
  const contentTypeMatches = [...headers.matchAll(/^content-type:\s*([^\r\n]+)/gmi)]
  results.push({
    path,
    status: Number(statusMatches.at(-1)?.[1] || 0),
    contentType: contentTypeMatches.at(-1)?.[1]?.trim() || '',
  })
}

const failures = results.filter(result => result.status !== 200 || !result.contentType.toLowerCase().startsWith('image/'))
if (failures.length) {
  console.error(JSON.stringify({ site, checked: results.length, failures }, null, 2))
  process.exit(1)
}

console.log(`Production photo proxy passed: ${results.length} homepage images returned HTTP 200 image responses.`)
