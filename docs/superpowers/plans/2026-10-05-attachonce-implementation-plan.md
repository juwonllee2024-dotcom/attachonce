# AttachOnce Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a local-first Chrome extension that attaches one explicitly selected file to one native upload control in the current tab, then forgets the file.

**Architecture:** A pure lease state machine and pure target-selection helpers sit below a browser content script. A popup injects the content script only after the user invokes the extension, and the content script uses a closed-shadow panel plus native file input. No remote service or AI API exists.

**Tech Stack:** TypeScript, Chrome MV3, esbuild, Vitest, ESLint, Node.js 20+.

**Spec:** `docs/superpowers/specs/2026-10-05-attachonce-design.md`

## Global Constraints

- Use only `activeTab` and `scripting` Chrome permissions.
- Limit to one file and 10 MiB per invocation.
- Never auto-submit, send, click, reload, persist, or transmit a file.
- Refuse zero or multiple file-input targets.
- Keep all tests and docs free of real private data.

## Review Focus

- A second attach after consumption must be rejected — Task 1 lease tests.
- Multiple upload controls must not receive a guessed file — Task 2 target tests.
- File-size boundary must reject files above 10 MiB — Task 1 lease tests.
- The popup must inject only the current tab after a user click — Task 4 source review and demo.
- The demo server must not serve paths outside the repository — Task 5 smoke test.

### Task 1: One-use lease state machine

**Files:**
- Create: `src/lease.ts`
- Test: `tests/lease.test.ts`

**Interfaces:**
- Produces `createLease()`, `selectFile(lease, meta)`, `canAttach(lease)`, and `consumeLease(lease)`.

- [ ] Write failing tests for selection, 10 MiB boundary, and one-time consumption.
- [ ] Run `npm test tests/lease.test.ts` and confirm missing-module RED.
- [ ] Implement immutable lease transitions with exact `10 * 1024 * 1024` limit.
- [ ] Run the focused test and full `npm test`; expect all pass.

### Task 2: Safe upload-target selection

**Files:**
- Create: `src/target.ts`
- Test: `tests/target.test.ts`

**Interfaces:**
- Produces `chooseUploadTarget(count)`, `isUploadLabel(label)`, and `describeUploadInput(input)`.

- [ ] Write failing tests for zero, one, and multiple candidate inputs plus common labels.
- [ ] Run focused test and confirm missing-module RED.
- [ ] Implement unique-only target policy and label normalization.
- [ ] Run focused and full tests; expect all pass.

### Task 3: Browser content flow

**Files:**
- Create: `src/content.ts`, `popup.html`, `src/popup.ts`, `manifest.json`
- Modify: none

**Interfaces:**
- Consumes the lease and target helpers.
- Produces a visible panel with select, preview, attach-once, and reset status.

- [ ] Implement closed-shadow UI and native file picker with no persistent handle.
- [ ] Implement one-target discovery and `DataTransfer` assignment.
- [ ] Clear the in-memory `File` reference and disable attach after success.
- [ ] Implement popup injection with `activeTab` and `scripting`.
- [ ] Run typecheck and lint.

### Task 4: Build, demo, and documentation

**Files:**
- Create: `scripts/build.mjs`, `scripts/demo-server.mjs`, `examples/demo.html`, `README.md`, `SECURITY.md`, `CONTRIBUTING.md`, `CHANGELOG.md`, `LICENSE`, `.github/workflows/ci.yml`

- [ ] Add demo server bound to `127.0.0.1` and traversal rejection.
- [ ] Add demo page that reports the selected file after native change event.
- [ ] Add safety-first README and release docs.
- [ ] Add Node 20/22 CI with test, typecheck, lint, build, and audit.

### Task 5: Verification and publication

**Files:**
- Create: `docs/verification/2026-10-05.md`

- [ ] Run `npm ci`, tests, typecheck, lint, build, audit, diff check, secret scan, and demo smoke checks.
- [ ] Run Codex Security Standard scan and record status/findings.
- [ ] Commit, create public `juwonllee2024-dotcom/attachonce`, push, watch CI, and create `v0.1.0`.
- [ ] Record URL, commits, CI run, release digest, and GitHub metrics; push verification update.
