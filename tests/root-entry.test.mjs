import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { runInNewContext } from 'node:vm';
import test from 'node:test';

const root = new URL('../', import.meta.url);
const html = readFileSync(new URL('index.html', root), 'utf8');
const script = readFileSync(new URL('assets/js/redirect.js', root), 'utf8');

// 执行真实跳转脚本，验证入口地址、分享参数、章节和返回行为。
for (const [search, hash] of [['', ''], ['?utm_source=github', ''], ['', '#quick-start'], ['?q=APK%20AAB', '#app-analysis']]) {
  test(`根入口使用 replace 进入官网并保留 ${search}${hash}`, () => {
    const targets = [];
    runInNewContext(script, {
      window: { location: { search, hash, replace: (target) => targets.push(target) } },
    });
    assert.deepEqual(targets, [`/AnyDeckWeb/${search}${hash}`]);
    assert.equal(new URL(targets[0], 'https://solomanlove.github.io/').origin, 'https://solomanlove.github.io');
  });
}

test('关闭 JavaScript 时仍可自动或手动进入相同官网', () => {
  assert.match(html, /<meta http-equiv="refresh" content="0;url=\/AnyDeckWeb\/">/);
  assert.match(html, /<a href="\/AnyDeckWeb\/">/);
  assert.match(html, /<link rel="canonical" href="https:\/\/solomanlove\.github\.io\/AnyDeckWeb\/">/);
  assert.match(html, /<html lang="zh-CN">/);
  const scripts = [...html.matchAll(/<script src="([^"]+)"/g)].map((match) => match[1]);
  assert.deepEqual(scripts, ['assets/js/redirect.js']);
  assert.ok(existsSync(fileURLToPath(new URL(scripts[0], root))));
  assert.doesNotMatch(html, /onload=|onclick=|<iframe|ubrmb|你好世杰|delayURL|alert\(/i);
});
