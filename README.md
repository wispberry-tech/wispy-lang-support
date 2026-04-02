<p align="center">
  <img src="branding/grove-full-logo.png" alt="Wispy Grove" width="400">
</p>

<p align="center">
  Multi-editor language support for <strong>Wispy Grove</strong> templates (<code>.grov</code> files).
</p>

---

## Features

- Syntax highlighting for Grove template delimiters (`{{ }}`, `{% %}`, `{# #}`)
- Keyword recognition for control flow, loops, components, macros, and more
- Full HTML embedding — Grove tokens are highlighted alongside standard HTML
- File icons for `.grov` files
- Bracket matching and auto-closing pairs for Grove delimiters

## Supported Editors

| Editor | Status | Engine |
|--------|--------|--------|
| VS Code | Available | TextMate grammar |
| Neovim | Planned | Tree-sitter |
| Zed | Planned | Tree-sitter |

## Installation

### VS Code

**From `.vsix` file:**

1. Download or build the `.vsix` (see [Building](#building) below)
2. In VS Code, open the Command Palette and run **Extensions: Install from VSIX...**
3. Select the `.vsix` file
4. Reload the window

### Neovim / Zed

Coming soon — these editors will share a Tree-sitter grammar currently in development.

## Building

### VS Code Extension

```bash
cd vscode && npm install
npx @vscode/vsce package --out wispy-grove.vsix --no-update-package-json
```

Or use the build script:

```bash
./scripts/build-vscode.sh
```

### Tree-sitter Grammar (in progress)

```bash
cd tree-sitter && npm install
npx tree-sitter generate
npx tree-sitter test
```

## Grove Syntax Overview

Grove is an HTML template language. It adds three delimiter types on top of standard HTML:

```html
{# Comments #}

{% if user.logged_in %}
  <h1>Welcome, {{ user.name | capitalize }}</h1>
{% else %}
  <a href="/login">Log in</a>
{% endif %}

{% for item in cart.items %}
  <div class="item">{{ item.title }} - {{ item.price }}</div>
{% empty %}
  <p>Your cart is empty.</p>
{% endfor %}
```

### Tag Keywords

| Category | Keywords |
|----------|----------|
| Conditionals | `if`, `elif`, `else`, `endif`, `unless`, `endunless` |
| Loops | `for`, `in`, `empty`, `endfor` |
| Variables | `set`, `with`, `endwith`, `capture`, `endcapture` |
| Macros | `macro`, `endmacro`, `call`, `endcall` |
| Composition | `extends`, `block`, `endblock`, `include`, `render`, `import`, `as` |
| Components | `component`, `endcomponent`, `props`, `slot`, `endslot`, `fill`, `endfill` |
| Assets | `asset`, `endasset`, `meta`, `hoist`, `endhoist` |
| Raw output | `raw`, `endraw` |

### Filters

Filters transform output values using the pipe operator:

```
{{ name | downcase | truncate: 20 }}
```

Built-in filters include `upcase`, `downcase`, `capitalize`, `trim`, `escape`, `json`, `default`, `join`, `first`, `last`, `size`, `reverse`, `sort`, `map`, `where`, and many more.

## Project Structure

```
wispy-grove-lang-support/
├── vscode/              # VS Code extension (TextMate grammar)
│   ├── package.json
│   ├── language-configuration.json
│   ├── syntaxes/
│   │   └── grove.tmLanguage.json
│   └── images/
├── tree-sitter/         # Tree-sitter grammar (Neovim + Zed)
│   ├── grammar.js
│   └── queries/
│       └── highlights.scm
├── neovim/              # Neovim integration (planned)
├── zed/                 # Zed integration (planned)
├── scripts/             # Build scripts
└── branding/            # Logos and assets
```

## License

MIT — see [LICENSE](LICENSE) for details.
