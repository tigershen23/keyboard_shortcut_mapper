# Phase 1: Initial Keyboard Layout

## Objective

Render an accurate, visually striking MacBook keyboard layout. No interactivity yet—just a static, pixel-perfect representation that serves as the foundation for layers and mappings.

## Design Directive

**Use the frontend-design skill** to create a distinctive, production-grade UI that avoids generic AI aesthetics. Go multiple layers deeper than the first instinct on colors, layout, and visual treatment to produce something truly stunning. The keyboard should feel premium, tactile, and immediately recognizable as a high-quality tool.

---

## MacBook Keyboard Layout Reference

### Row Structure (US ANSI Layout)

```
Row 0 (Function):  esc  F1  F2  F3  F4  F5  F6  F7  F8  F9  F10  F11  F12  ⏏
Row 1 (Number):    `  1  2  3  4  5  6  7  8  9  0  -  =  ⌫ (backspace)
Row 2 (Top):       ⇥ (tab)  Q  W  E  R  T  Y  U  I  O  P  [  ]  \
Row 3 (Home):      ⇪ (caps)  A  S  D  F  G  H  J  K  L  ;  '  ⏎ (return)
Row 4 (Bottom):    ⇧ (shift-L)  Z  X  C  V  B  N  M  ,  .  /  ⇧ (shift-R)
Row 5 (Modifiers): fn  ⌃  ⌥  ⌘  ␣ (space)  ⌘  ⌥  ◀  ▲▼  ▶
```

### Key Width Units

Standard key = 1 unit. Special keys:

| Key                          | Width (units)                 |
| ---------------------------- | ----------------------------- |
| Standard letter/number       | 1.0                           |
| Tab                          | 1.5                           |
| Caps Lock                    | 1.75                          |
| Left Shift                   | 2.25                          |
| Right Shift                  | 2.75                          |
| Backspace                    | 1.5                           |
| Return                       | 1.75                          |
| Backslash                    | 1.5                           |
| Space                        | 6.0                           |
| fn, Control, Option, Command | 1.25 each                     |
| Arrow keys                   | 1.0 (half-height for up/down) |

---

## Data Model

### `src/data/macbook-layout.ts`

```typescript
export interface KeyDefinition {
  id: string; // Unique identifier (e.g., "a", "shift-left", "f1")
  label: string; // Display label (e.g., "A", "⇧", "F1")
  width?: number; // Width in units, default 1
  height?: number; // Height in units, default 1 (0.5 for half-height arrows)
}

export interface KeyboardRow {
  keys: KeyDefinition[];
}

export type KeyboardLayout = KeyboardRow[];

export const macbookLayout: KeyboardLayout = [
  // Row 0: Function keys
  {
    keys: [
      { id: "esc", label: "esc", width: 1 },
      { id: "f1", label: "F1" },
      { id: "f2", label: "F2" },
      // ... etc
    ],
  },
  // ... remaining rows
];
```

### Key ID Conventions

- Letters: lowercase (`a`, `b`, `c`)
- Numbers: digit string (`1`, `2`, `0`)
- Function keys: `f1` through `f12`
- Modifiers: `shift-left`, `shift-right`, `control`, `option-left`, `option-right`, `command-left`, `command-right`, `fn`, `caps`
- Special: `esc`, `tab`, `backspace`, `return`, `space`
- Punctuation: `backtick`, `minus`, `equals`, `bracket-left`, `bracket-right`, `backslash`, `semicolon`, `quote`, `comma`, `period`, `slash`
- Arrows: `arrow-left`, `arrow-right`, `arrow-up`, `arrow-down`

---

## Component Architecture

### `src/components/Keyboard.tsx`

```typescript
interface KeyboardProps {
  layout: KeyboardLayout;
  className?: string;
}

export function Keyboard({ layout, className }: KeyboardProps) {
  return (
    <div className={`keyboard ${className ?? ""}`}>
      {layout.map((row, rowIndex) => (
        <div key={rowIndex} className="keyboard-row">
          {row.keys.map((key) => (
            <Key key={key.id} definition={key} />
          ))}
        </div>
      ))}
    </div>
  );
}
```

### `src/components/Key.tsx`

```typescript
interface KeyProps {
  definition: KeyDefinition;
}

export function Key({ definition }: KeyProps) {
  const { id, label, width = 1, height = 1 } = definition;

  const style = {
    "--key-width": width,
    "--key-height": height,
  } as React.CSSProperties;

  return (
    <div
      className={`key key-${id}`}
      style={style}
      data-key-id={id}
    >
      <span className="key-label">{label}</span>
    </div>
  );
}
```

---

## Styling Approach

### Use Tailwind CSS

Style with Tailwind utility classes. Bun's bundler supports Tailwind out of the box.

### Design Direction

- **Light theme**
- **Depth**: Soft shadows, slight 3D effect on keys
- **Typography**: SF Mono or system monospace for labels
- **Colors**: Neutral grays with potential for accent colors per layer (Phase 2)

### Tailwind Setup

```bash
bun add tailwindcss
```

Create `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,tsx,ts}"],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"SF Mono"', "Menlo", "Monaco", "monospace"],
      },
    },
  },
  plugins: [],
};
```

### Key Component with Tailwind

```typescript
export function Key({ definition }: KeyProps) {
  const { id, label, width = 1, height = 1 } = definition;

  // Dynamic width via inline style (Tailwind can't do arbitrary calc)
  const style = {
    width: `${width * 3.5}rem`,
    height: `${height * 3.5}rem`,
  };

  return (
    <div
      className={`
        flex items-center justify-center
        bg-gradient-to-b from-zinc-700 to-zinc-800
        border border-zinc-600
        rounded-md
        shadow-[0_2px_4px_rgba(0,0,0,0.3),0_1px_2px_rgba(0,0,0,0.2)]
        font-mono text-xs text-zinc-200
        select-none
        transition-all duration-150
        hover:from-zinc-600 hover:to-zinc-700
      `}
      style={style}
      data-key-id={id}
    >
      <span>{label}</span>
    </div>
  );
}
```

### Keyboard Container

```typescript
export function Keyboard({ layout }: KeyboardProps) {
  return (
    <div className="inline-flex flex-col gap-1 p-6 bg-zinc-900 rounded-2xl shadow-2xl">
      {layout.map((row, i) => (
        <div key={i} className="flex gap-1">
          {row.keys.map((key) => (
            <Key key={key.id} definition={key} />
          ))}
        </div>
      ))}
    </div>
  );
}
```

### Responsive Scaling

Use Tailwind's responsive prefixes or a CSS variable for the base unit:

```css
/* src/styles/keyboard.css */
@import "tailwindcss";

:root {
  --key-unit: 3.5rem;
}

@media (max-width: 1024px) {
  :root {
    --key-unit: 2.75rem;
  }
}

@media (max-width: 768px) {
  :root {
    --key-unit: 2rem;
  }
}
```

Then use `style={{ width: \`calc(${width} \* var(--key-unit))\` }}` in the Key component.

---

## File Structure

```
src/
├── index.html
├── index.ts                    # Bun.serve() entry
├── frontend.tsx                # React mount
├── components/
│   ├── Keyboard.tsx
│   └── Key.tsx
├── data/
│   └── macbook-layout.ts
├── styles/
│   └── main.css                # Tailwind imports + custom CSS vars
└── types/
    └── index.ts
tailwind.config.js
```

---

## Implementation Steps

### 1. Project Initialization

```bash
bun init
bun add react react-dom tailwindcss
bun add -d @types/react @types/react-dom typescript
```

### 2. Configure Tailwind

Create `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,tsx,ts}"],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"SF Mono"', "Menlo", "Monaco", "monospace"],
      },
    },
  },
  plugins: [],
};
```

Create `src/styles/main.css`:

```css
@import "tailwindcss";

:root {
  --key-unit: 3.5rem;
}
```

### 3. Create Entry Files

- `src/index.html` - HTML shell with React mount point, links to main.css
- `src/index.ts` - Bun.serve() with HTML import
- `src/frontend.tsx` - React app entry, imports main.css

### 4. Define Layout Data

Create `src/data/macbook-layout.ts` with complete MacBook keyboard:

- All 78 keys with correct IDs and labels
- Accurate width values for special keys
- Half-height arrow keys

### 5. Build Components

1. `Key.tsx` - Single key with Tailwind classes + dynamic sizing via style prop
2. `Keyboard.tsx` - Row-based layout container with Tailwind

### 6. Apply Frontend Skill

Use the `frontend-design` skill to refine the visual design:

- Go beyond basic Tailwind utility classes
- Add subtle animations, gradients, and depth
- Ensure the result is distinctive and polished

### 7. Test in Browser

```bash
bun --hot src/index.ts
```

And open accordingly, you have access to Claude in Chrome in order to accomplish what you need here

Verify:

- All keys render correctly
- Sizing matches real MacBook proportions
- Looks good at different viewport sizes
- Design is visually compelling

---

## Acceptance Criteria

- [ ] All 78 MacBook keys rendered
- [ ] Key sizes match real keyboard proportions
- [ ] Function row, number row, letter rows, modifier row all correct
- [ ] Arrow keys show half-height up/down correctly
- [ ] Light theme with polished visual appearance
- [ ] No interactivity yet (that's Phase 2)

---

## Visual Reference

For accurate proportions, reference Apple's keyboard documentation or measure a physical MacBook keyboard. The goal is recognizability—users should immediately see "that's my keyboard."
