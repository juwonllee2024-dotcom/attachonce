# AttachOnce design

## Intent

AttachOnce changes the file-access boundary in a browser AI tab: the user chooses one local file inside the current tab, the extension attaches it to the page's native upload control once, then forgets the file. It does not call an AI API, parse the document, keep a library, or request access to the user's drive.

## Evidence and differentiation

- Chrome documents `activeTab` as temporary, user-gesture-bound access to the current tab: <https://developer.chrome.com/docs/extensions/develop/concepts/activeTab>.
- The File System Access API exposes a user picker, but persistent handles and broader file workflows add a permission surface: <https://developer.mozilla.org/en-US/docs/Web/API/Window/showOpenFilePicker>.
- Current browser AI workflows still report file-upload failures and permission gaps: <https://github.com/openai/codex/issues/38959> and <https://github.com/openai/codex/issues/46585>.
- Existing document-context extensions such as <https://github.com/marcuscaum/context-fill> focus on parsing, indexing, and provider workflows. AttachOnce deliberately stays a one-file, one-tab, native-upload bridge.

## Innovation hypothesis

If a user can grant a file to the current AI tab for exactly one native upload, without account integration or persistent file access, they will trust and reuse the flow more than a document library or cloud-connected context tool.

## MVP flow

1. User opens an AI or web app tab.
2. User invokes AttachOnce from the extension toolbar; this is the only permission grant.
3. A small in-page panel lets the user pick one file and previews only name, type, and size.
4. AttachOnce finds exactly one file upload control on the page.
5. User clicks **Attach once**.
6. The extension transfers the selected `File` to that native input, dispatches `input` and `change`, disables itself, and clears its in-memory reference.

## Safety boundaries

- Permissions: `activeTab` and `scripting` only.
- File selection: browser-native `<input type="file">`; no persistent file handle.
- Limits: one file, 10 MiB maximum, no directory selection.
- Ambiguous page: do nothing if zero or multiple file inputs exist.
- No automatic submit, send, click, network request, clipboard access, telemetry, or file archive.
- The host page may upload the file after the extension attaches it; the README states this clearly.

## Technical design

- `src/lease.ts`: pure one-use lease state machine.
- `src/target.ts`: pure file-input target selection and label helpers.
- `src/content.ts`: closed-shadow UI, native file picker, target detection, DataTransfer attachment, and memory cleanup.
- `src/popup.ts`: explicit current-tab injection.
- `scripts/build.mjs`: bundles content and popup scripts and copies MV3 assets.
- `scripts/demo-server.mjs`: loopback-only demo server with traversal rejection.
- `examples/demo.html`: one upload control and visible result after `change`.

## Success criteria

- A user can run the local demo, choose a fake file, attach it once, and see the native page input receive it.
- Second attach is impossible until the extension is explicitly reinvoked.
- Unit tests prove lease consumption and ambiguous-target refusal.
- `npm test`, typecheck, lint, build, audit, diff check, smoke test, and security scan pass.
