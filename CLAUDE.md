# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Multi-editor language support for Wispy Templates (`.wsp` files). The project provides syntax highlighting and editor integration across VS Code (Phase 1, implemented), Neovim, and Zed (Phase 2, stubs).

## Build Commands

### VS Code Extension
```bash
cd vscode && npm install
# Package into .vsix:
npx @vscode/vsce package --out wispy-templates.vsix --no-update-package-json
# Or use the build script:
./scripts/build-vscode.sh
```

### Tree-sitter Grammar (Phase 2 — parser not yet generated)
```bash
cd tree-sitter && npm install
npx tree-sitter generate   # generates src/parser.c from grammar.js
npx tree-sitter test        # runs tests if tree-sitter/test/ exists
# Or use the build script:
./scripts/build-tree-sitter.sh
```

No test infrastructure exists yet for either component.

## Architecture

- **`vscode/`** — Self-contained VS Code extension using a **TextMate regex grammar** (`syntaxes/wispy.tmLanguage.json`). Scope name: `text.html.wispy`, extends `text.html.basic`.
- **`tree-sitter/`** — **Tree-sitter AST grammar** (`grammar.js`) + highlight queries (`queries/highlights.scm`). Shared foundation for Neovim and Zed. Independent of the VS Code extension.
- **`neovim/`** and **`zed/`** — Stub configurations that will consume the tree-sitter grammar.
- **`scripts/`** — Bash build scripts for packaging each component.
- **`plan-8-editor-plugins.md`** — Full design specification covering syntax edge cases, keyword lists, and acceptance criteria.

The two grammars (TextMate and Tree-sitter) define the same language in parallel — TextMate for VS Code, Tree-sitter for Neovim/Zed. They share no code.

## Key Design Decisions

### TextMate scope alignment with HTML
The VS Code TextMate grammar (`wispy.tmLanguage.json`) must use scopes that match the built-in HTML grammar so that themes color Wispy tokens consistently with surrounding HTML. The mapping:

| Wispy token | Scope (must match HTML equivalent) |
|---|---|
| `{%` `%}` `{{` `}}` delimiters | `punctuation.definition.tag.begin/end` (like `<` `>`) |
| Tag keywords (`if`, `for`, `block`, etc.) | `entity.name.tag` (like `div`, `span`) |
| Variables/identifiers | `entity.other.attribute-name` (like HTML attributes) |
| `=` assignment | `punctuation.separator.key-value` (like HTML `=`) |
| Strings | `string.quoted.double/single` (already standard) |
| Filters | `support.function.filter` |

Do not use `keyword.control.*` or `variable.other.*` for these tokens — those scopes cause color mismatches with HTML in most themes.
