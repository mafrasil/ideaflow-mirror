# Ideaflow Editor

A powerful text editor built with ProseMirror, React, and TypeScript that features an intelligent autocomplete system.

Built as part of the Ideaflow technical assessment. Implementation inspired by modern text editors while maintaining a focus on clean code and user experience.

🔗 **Live Preview:** [https://ideaflow-mirror.vercel.app/](https://ideaflow-mirror.vercel.app/)

## Features

- **Smart Autocomplete**

  - Trigger with `<>` to access suggestions
  - Dynamic filtering as you type
  - Keyboard navigation (↑/↓ arrows, Enter/Tab to select)
  - Mouse interaction support

- **Multiple Suggestion Types**

  - 👤 People mentions (e.g., `@sarah`)
  - 🏷️ Tags (e.g., `#meeting`)
  - ✨ AI Commands (e.g., `✨joke`)

- **Rich Text Features**
  - Non-editable mentions
  - One-click deletion
  - Tooltips with descriptions
  - Color-coded suggestion types

## Getting Started

### Installation

```bash
git clone https://github.com/mafrasil/ideaflow-mirror.git
pnpm install
pnpm dev
```

### Usage

1. Click into the editor
2. Type `<>` to trigger autocomplete
3. Start typing to filter suggestions
4. Use arrow keys or mouse to select
5. Press Enter/Tab to insert selection

### Fun Tips! 🎮

Try these cool features:

- Type `<>joke` to get an AI-generated joke _(simulated but working!)_
- Use `<>@` to filter for people mentions
- Try `<>#` for tags

## Technical Stack

- React
- TypeScript
- ProseMirror
- Tailwind CSS
- Vite

## Development

```bash
npm run dev
npm run build
npm run preview
```
