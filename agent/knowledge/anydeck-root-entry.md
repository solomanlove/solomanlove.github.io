# AnyDeck 官网根入口

## 需求与实现

访问 `https://solomanlove.github.io/` 时直接进入已发布的 AnyDeck 官网 `https://solomanlove.github.io/AnyDeckWeb/`。原 `index.html` 的个人测试文案、AppLink/Scheme 按钮和自动唤起 App 脚本已从首页移除。

根入口通过 `assets/js/redirect.js` 调用 `window.location.replace`，保留 URL 的 query 和 hash，避免浏览器返回时再次经过入口。`index.html` 提供零延时 meta refresh 和官网链接，作为 JavaScript 不可用时的回退；canonical 指向同一官网。

官网内容继续由 `solomanlove/AnyDeckWeb` 的 `main` 分支自动发布，根入口无需复制页面或资源。根入口自身位于 `solomanlove/solomanlove.github.io` 的 `master` 分支，由该仓库现有 GitHub Pages 发布源部署。

## 验证与回退

```bash
npm test
git push origin master
```

自动测试执行真实跳转脚本，覆盖普通访问、query、hash、query 与 hash 同时存在，以及无 JavaScript 时的回退入口。发布后检查根地址与脚本返回 HTTP 200，并在浏览器确认最终进入 AnyDeck 官网。

需要恢复旧首页时，对本次入口提交执行 `git revert <commit>`，再推送 `master`。
