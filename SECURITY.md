# Security Policy

## Scope

AttachOnce is a local Chrome extension and loopback demo server. It is not a security boundary for an AI provider or a website.

## Data boundaries

- The extension requests only `activeTab` and `scripting`.
- The user must invoke the extension on the current tab.
- The selected `File` exists in extension memory until the one explicit attachment succeeds or the tab is closed.
- After attachment, the extension drops its reference and cannot attach a second file without reinvocation.
- There is no network request, account, telemetry, clipboard read, persistent file handle, or file archive.
- The host page can upload the file after receiving it; users must trust the current page before attaching.
- The demo server binds to `127.0.0.1` and rejects paths outside the repository.

## Reporting

Do not publish security-sensitive details in a public issue. Use GitHub private vulnerability reporting for this repository, or contact `juwonllee2024-dotcom` through GitHub. Use fake data only; never include passwords, tokens, private files, or personal messages.
