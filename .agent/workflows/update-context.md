---
description: Update and synchronize the project context for LLMs
---

Use this workflow after making significant architectural changes, adding new core features, or refactoring existing systems (e.g., VFS, User Auth, App Engine) to ensure future AI sessions remain accurate.

1. **Information Gathering**: Review the session memory, git diffs, and any new documentation created during the current task.
2. **Update Core Context**:
   - Modify `.agent/rules/context.md` to reflect the latest architectural truth.
   - Focus on the `<architecture_mechanics>` and `<critical_rules>` sections.
   - Keep it token-efficient and optimized for Gemini models.
3. **Mirror to Public Context**:
   - Update `public/llms-full.txt` to be an exact mirror of the updated `.agent/rules/context.md`.
4. **Update LLM Index**:
   - Check `public/llms.txt` (the entry point for external agents).
   - Ensure high-level descriptions and links to other documentation are still accurate.
5. **Verify Sync**: Briefly verify that documentation refers to the actual state of the code (e.g., ensure `useFileSystem` hooks or registry paths are correct).
