# Contributing

Thanks for helping improve REAL Liquidations Explorer. Keep changes focused, explain the user-visible result, and use English for source comments, UI copy, documentation, issues, and pull requests.

## Local setup

1. Clone the repository or your fork and enter the project directory.
2. Use Node.js 24.22.1 and run `npm ci` to install the locked dependencies.
3. Run `npm run dev` and open the URL printed by Vite.
4. If needed, copy `.env.example` to `.env` and configure the public API base URL.

See the [README](README.md) for configuration and the [architecture guide](docs/ARCHITECTURE.md) for the source map.

## Making a change

- Follow the existing React and TypeScript conventions.
- Use small, meaningful commits, such as `fix: preserve account filter` or `docs: explain feed behavior`.
- Add or update relevant tests when changing calculation or filtering behavior. Existing test coverage is limited.
- Update documentation when behavior, configuration, or setup changes.
- Keep user-facing text in English, including explicit locale formatting where applicable.
- Do not commit local environment files, credentials, generated builds, or dependencies.
- Preserve the lockfile and use `npm ci` for reproducible installation. When intentionally changing dependencies, include the corresponding lockfile changes.

## Validation

Before submitting a code change, run:

```bash
npm test
npm run build
```

For UI changes, also inspect the result in a browser at desktop and mobile widths, and check keyboard navigation. Clearly distinguish API-backed data from demo fixtures when reporting verification.

For documentation-only changes, check accuracy against the implementation and verify relative links. Do not describe planned functionality as already available.

## Pull requests

Explain the problem, what changes for users, and how you verified the result. Include screenshots for visual changes when useful. Keep unrelated refactors out of the same pull request and disclose any checks you could not run.

## Bug reports

Include reproduction steps, expected and actual behavior, browser details, and whether the page showed `LIVE FEED` or `DEMO FEED`. If relevant, include a sanitized example API record. Never include credentials or other private information.

## License

By submitting a contribution, you agree that it may be distributed under the project's [MIT License](LICENSE). Only submit work you have the right to contribute, and preserve any applicable third-party notices.
