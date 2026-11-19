const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const root = path.resolve(__dirname, '..')
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8')

const css = html.match(/<link[^>]+href="([^"]+\.css(?:\?[^"]*)?)"/i)
assert.ok(css, 'index.html must link to the stylesheet')
assert.ok(css[1].startsWith('./'), 'GitHub Pages assets must use paths relative to the repository root')
assert.ok(fs.existsSync(path.join(root, css[1].split('?')[0])), 'stylesheet file must exist')

const scripts = [...html.matchAll(/<script[^>]+src="([^"]+\.js(?:\?[^"]*)?)"/gi)]
assert.ok(scripts.length >= 1, 'index.html must load JavaScript files')
for (const match of scripts) {
  const source = match[1]
  assert.ok(source.startsWith('./'), `Script path must be relative: ${source}`)
  assert.ok(fs.existsSync(path.join(root, source.split('?')[0])), `Script file must exist: ${source}`)
}

const pageBase = '/sample-repository/'
const assets = [css[1], ...scripts.map(match => match[1])]
for (const asset of assets) {
  const resolved = new URL(asset, `https://example.github.io${pageBase}`)
  assert.ok(resolved.pathname.startsWith(pageBase), `Asset must stay under the GitHub Pages repository path: ${resolved.pathname}`)
}

console.log('GitHub Pages relative asset paths: OK')
