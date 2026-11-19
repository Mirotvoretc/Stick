'use strict'

const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const root = path.join(__dirname, '..')
const online = fs.readFileSync(path.join(root, 'js/online.js'), 'utf8')
const styles = fs.readFileSync(path.join(root, 'css/styles.css'), 'utf8')
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8')

assert.match(online, /function isPhoneDevice\(\)/)
assert.match(online, /mobileAgent\s*&&\s*coarse\s*&&\s*shortSide\s*<=\s*950/)
assert.match(online, /const active\s*=\s*phone\s*&&\s*\(onlinePlaying\s*\|\|\s*localPlaying\)/)
assert.match(styles, /html\.phone-device \.touch-controls\.show\s*\{\s*display:\s*block\s*!important/s)
assert.match(styles, /html:not\(\.phone-device\) \.touch-controls\s*\{\s*display:\s*none\s*!important/s)
assert.match(html, /id="touchControls"/)

console.log('Touch UI tests passed: phone-only detection, active-match visibility and forced PC hiding.')
