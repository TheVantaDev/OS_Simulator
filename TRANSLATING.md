# Translation Guide for Aurora OS

Welcome! This guide will help you contribute translations to Aurora OS, even if you're not a developer.

## 🌍 Quick Start for Translators

### Option A: Edit on GitHub (Easiest)

1. **Find your language file** in `src/i18n/locales-json/`
   - Example: `zh.json` for Chinese, `es.json` for Spanish
   
2. **Click the edit button** (pencil icon) on GitHub

3. **Translate the text** on the right side of each line:
   ```json
   "game.mainMenu.continue.label": "Continue"
   ```
   becomes:
   ```json
   "game.mainMenu.continue.label": "继续"
   ```

4. **Keep these unchanged:**
   - Text before the colon (`"game.mainMenu.continue.label":`)
   - Template variables like `{{username}}`, `{{count}}`
   - Special characters in values

5. **Create a Pull Request** - GitHub will guide you through this

### Option B: Using Crowdin (Coming Soon)

We're setting up Crowdin for a better translation experience. Stay tuned!

---

## 📝 Translation Rules

### ✅ DO Translate:
- User interface text
- Button labels
- Error messages
- Menu items
- Tooltips and hints

### ❌ DON'T Translate:
- Application names (Finder, Safari, Terminal, etc.)
- Brand names (Aurora OS)
- File extensions (.ts, .json, .md)
- Template variables: `{{username}}`, `{{count}}`, `{{filename}}`
- HTML/Code-like content in mock apps

### 🔧 Keep These Intact:
```json
"notifications.items.newEmail.message": "You have {{count}} unread messages"
```
Becomes:
```json
"notifications.items.newEmail.message": "您有 {{count}} 条未读消息"
```
Notice `{{count}}` stays exactly the same!

---

## 📂 File Structure

Translations are stored in two places:

```
src/i18n/
├── locales/              # TypeScript files (main source)
│   ├── en.ts            # English (reference)
│   ├── zh.ts            # Chinese
│   └── ...
├── locales-json/        # JSON files (for translators) ← YOU EDIT THESE
│   ├── en.json
│   ├── zh.json
│   └── ...
```

**You only need to edit files in `locales-json/`!**

---

## 🚀 For Developers

### 1. Generate JSON from TypeScript

After adding new strings to `en.ts`, generate JSON files:

```bash
npm run translations:generate
```

This creates/updates all JSON files with the latest keys from TypeScript.

### 2. Validate Translations

Check if translations are complete and valid:

```bash
npm run translations:validate
```

This verifies:
- ✓ All keys from `en.ts` are present
- ✓ No extra keys exist
- ✓ No empty values
- ✓ Valid JSON format

### 3. Build TypeScript from JSON

After translators update JSON files:

```bash
npm run translations:build
```

This validates and converts JSON → TypeScript, ensuring sync.

---

## 🔄 Complete Workflow

### Adding New Strings (Developer)

1. **Add strings to `en.ts`** (Main source)
   ```typescript
   browser: {
     menu: {
       newTab: 'New Tab',
       newFeature: 'My New Feature'  // ← Added
     }
   }
   ```

2. **Generate JSON for all locales**
   ```bash
   npm run translations:generate
   ```
   
3. **English defaults appear in en.json:**
   ```json
   {
     "browser.menu.newTab": "New Tab",
     "browser.menu.newFeature": "My New Feature"
   }
   ```
   Note: New keys appear only in src/i18n/locales-json/en.json. Other language JSON files won't automatically get these keys — translators need to add them manually, or you need to add them to each language's .ts file first and then run npm run translations:generate. The translations:generate script converts existing .ts files to JSON; it does not backfill missing keys in other locales.

4. **Notify translators** or wait for community PRs

### Translating (Non-Developer)

1. **Navigate to** `src/i18n/locales-json/[your-locale].json`
2. **Find the keys** you want to translate
3. **Replace English** text with your translation
4. **Submit** via GitHub Pull Request

### Merging Translations (Developer)

1. **Review** the JSON changes in PR
2. **Run validation and build:**
   ```bash
   npm run translations:build
   ```
3. **Commit** both JSON and generated TypeScript files
4. **Merge** the PR

---

## 🎯 Examples

### Simple Translation
**English (`en.json`):**
```json
{
  "login.enterSystem": "Enter System",
  "login.switchAccount": "Switch Account"
}
```

**Chinese (`zh.json`):**
```json
{
  "login.enterSystem": "进入系统",
  "login.switchAccount": "切换账户"
}
```

### With Variables
**English:**
```json
{
  "notifications.items.newEmail.message": "You have {{count}} unread messages"
}
```

**Chinese:**
```json
{
  "notifications.items.newEmail.message": "您有 {{count}} 条未读消息"
}
```

### With Special Characters
**English:**
```json
{
  "settings.danger.hardResetWarning": "⚠️ All custom files will be permanently deleted"
}
```

**Chinese:**
```json
{
  "settings.danger.hardResetWarning": "⚠️ 所有自定义文件和文件夹将被永久删除"
}
```

---

## 🔍 Available Commands

| Command | Purpose | Who Uses |
|---------|---------|----------|
| `npm run translations:generate` | Create/update JSON from `.ts` files | Developer |
| `npm run translations:validate` | Check JSON validity | Developer/CI |
| `npm run translations:build` | Validate + Convert JSON → TypeScript | Developer |

---

## 💡 Tips

### For Translators
- **Use a JSON validator** to check your syntax before submitting
- **Ask questions** in PR comments if something is unclear
- **Keep consistent terminology** across the translation
- **Test locally** if possible to see your translations in context

### For Developers
- **Run `translations:generate` regularly** to keep JSON files updated
- **Add validation to CI/CD** to catch issues early
- **Document context** for difficult-to-translate strings
- **Keep `en.ts` clean** - it's the source of **EVERYTHING**

---

## ❓ FAQ

**Q: I don't know TypeScript, can I still help?**  
A: Yes! Just edit the `.json` files. They're plain text and easy to understand.

**Q: What if I make a mistake?**  
A: The validation script will catch errors before merging. Don't worry!

**Q: Can I translate only some strings?**  
A: No, all keys must have values. If unsure, leave it in English temporarily.

**Q: What about regional variants (zh-CN vs zh-TW)?**  
A: Create separate files like `zh-CN.json` and `zh-TW.json`.

**Q: How do I test my translations?**  
A: Build the project locally and change the language in settings.

**Q: Where can I ask questions?**  
A: Open a [GitHub Discussion](https://github.com/mental-os/Aurora-OS.js/discussions/105)

**Q: The JSON files don't exist yet. What should I do?**  
A: JSON files are auto-generated from `.ts` files and should be committed to the repository. If they're missing, a developer needs to run `npm run translations:generate` to create them from the TypeScript source files. The JSON files in `locales-json/` are kept in sync with `locales/` and should always be available for translators.

---

## 🌐 Current Languages

- 🇬🇧 **English** (en) - Base language
- 🇨🇳 **Chinese** (zh)
- 🇪🇸 **Spanish** (es)
- 🇫🇷 **French** (fr)
- 🇵🇹 **Portuguese** (pt)
- 🇷🇴 **Romanian** (ro)
- 🇩🇪 **German** (de)

**Want to add a new language?**
1. Copy `src/i18n/locales-json/en.json` to your language code (e.g., `ja.json` for Japanese)
2. Translate all strings in the new file
3. Submit a Pull Request with your translated JSON file
4. A developer will run `translations:build` to generate the TypeScript file

---

## 🙏 Thank You!

Your contributions help make Aurora OS accessible to users worldwide. Every translation matters!

---

## 📚 Related Resources

- [GitHub Discussion #105](https://github.com/mental-os/Aurora-OS.js/discussions/105) - Original proposal
- [CONTRIBUTING.md](./CONTRIBUTING.md) - General contribution guide
- [Translation Types](./src/i18n/types.ts) - TypeScript interface for translations

---

**Happy Translating! 🌍**
