# AttachOnce 📎

**Give the current AI tab one file. Once. Then forget it.**

AttachOnce is a local-first Chrome extension that lets you choose one local file inside the current browser tab and hand it to that page's native upload control exactly once.

It does not run an AI model. It does not upload to its own server. It does not build a document library. The AI website receives the file only through its own native input after you click **Attach once**.

## The invention

Most “AI context” tools turn files into a persistent library, provider integration, or background index. AttachOnce changes the permission boundary instead:

```text
one user gesture + one current tab + one file + one native attachment = extension memory cleared
```

Chrome's [`activeTab`](https://developer.chrome.com/docs/extensions/develop/concepts/activeTab) permission is temporary and user-gesture-bound. AttachOnce applies the same idea to file context. The browser still controls the final upload; AttachOnce never presses Send.

This matters because browser AI file workflows can fail at the upload boundary. See [Codex issue #38959](https://github.com/openai/codex/issues/38959) and [Codex issue #46585](https://github.com/openai/codex/issues/46585). Existing document-context extensions such as [context-fill](https://github.com/marcuscaum/context-fill) solve a broader indexing/provider problem; AttachOnce is intentionally narrower: one tab, one file, one time.

## Try it in 60 seconds

```powershell
npm ci
npm run demo
```

Open <http://127.0.0.1:4175>.

1. Build and load `dist/` from `chrome://extensions` with Developer mode enabled.
2. Open the demo page and click the AttachOnce toolbar action.
3. Choose a harmless fake file in the floating panel.
4. Click **Attach once**.
5. The demo page's native input reports the file. The extension disables itself and clears its in-memory file reference.

## Install locally

```powershell
npm ci
npm run build
```

1. Open `chrome://extensions`.
2. Enable **Developer mode**.
3. Select **Load unpacked** and choose this repository's `dist/` folder.
4. Open a page with exactly one file upload control.
5. Click AttachOnce, then choose **Enable on this tab**.

The MVP refuses to guess when a page has zero or multiple upload controls. This is deliberate: a false negative is safer than handing a private file to the wrong input.

## Safety contract

- **One file per invocation.** Maximum 10 MiB; directories are not accepted.
- **No persistent file handle.** Selection uses a native file picker; the extension stores the `File` object only in memory.
- **No cloud, AI API, account, telemetry, clipboard, or network request.**
- **No automatic submit, send, click, or reload.**
- **No page-wide host permission.** The extension requests only `activeTab` and `scripting`.
- **The host page may upload the file.** Once attached, that page controls what its native uploader does.

## Development

```powershell
npm test
npm run typecheck
npm run lint
npm run build
npm audit
```

TDD starts with the pure one-use lease and unique-target tests. See [CONTRIBUTING.md](CONTRIBUTING.md), [SECURITY.md](SECURITY.md), and the [verification record](docs/verification/2026-10-05.md).

## Validation hypothesis

The first ten users are developers and AI-heavy workers who upload the same small set of files repeatedly but do not want a permanent document index. The 7-day experiment: use AttachOnce on a real AI tab with fake/non-sensitive files and measure whether users prefer “one explicit attachment” over a persistent context tool.

## License

MIT © 2026 juwonllee2024-dotcom
