# Contributing

AttachOnce should remain a narrow, explicit permission primitive.

## Rules

1. Keep the one-file, one-tab, one-use contract visible.
2. Do not add telemetry, cloud storage, provider keys, clipboard history, or automatic Send behavior.
3. Refuse ambiguous upload targets rather than guessing.
4. Use fake files in tests and demos.

## Checks

```powershell
npm ci
npm test
npm run typecheck
npm run lint
npm run build
npm audit
```

New behavior starts with a failing test. Run RED, add the smallest implementation, then run the complete suite GREEN. Describe browser limitations honestly in the pull request.
