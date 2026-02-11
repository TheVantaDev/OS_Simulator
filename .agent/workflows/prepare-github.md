---
description: Comprehensive preparation before pushing to GitHub
---

Follow these steps to ensure the codebase is clean, synchronized, and ready for a remote push.

### 1. Synchronization Check

Verify that the local branch is up to date and there are no unexpected conflicts.
// turbo

- Run `git fetch && git status`

### 2. Metadata & Documentation

Ensure high-level project information is accurate.

- Check `package.json`: verify `version`, `name`, and `description`.
- Check `README.md`: ensure it reflects recent major features or architectural changes.

### 3. Quality Assurance (QA)

Validate that the code meets project standards and performs as expected.
// turbo

- Run `npm run lint` to check for style issues.
  // turbo
- Run `npm run build` to ensure the project compiles correctly.
  // turbo
- Run `npm run test` to execute the test suite and ensure no regressions.

### 4. Internationalization (i18n)

Verify that all translation files are correct and synchronized.
// turbo

- Run `node .scripts/check-i18n.js` (Note: the `translations:validate` script in `package.json` is currently broken).

### 5. Context Synchronization

Ensure documentation for external AI agents is up to date.

- Execute the `/update-context` workflow.

### 6. Handover

Once all steps are completed successfully, notify the user that the workspace is ready for a manual commit and push.
