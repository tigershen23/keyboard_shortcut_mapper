# Human

specs/resources/2021-macbook-pro-keyboard.jpg

This set of work is going to be all about improving the UI of the keyboard so that it really, really closely mimics what a real MacBook keyboard looks like. In order to do that, please review, using your vision capability, the screenshot of a real keyboard here and focus in on the main part of the keyboard, which we are rendering in our application. Update the UI to be as close of a match as possible to the image and update the background to be similar to the space gray of the laptop while keeping something like the gradient based on the base, hyper, and command layer colors, which I think is quite nice. 
For font, let's use inter.

---

# Agent

## Summary

Transform the keyboard UI from the current light silver aesthetic to a realistic dark MacBook-style appearance with black keys on a space gray frame. The design should closely match the 2021 MacBook Pro reference image while preserving the layer-based color accents and animated gradient background.

## Key Design Decisions

Based on user input:
1. **Dark keys always** - Black/dark keys on all layers with white text and icons
2. **Animated gradient preserved** - Keep the warm animated background but blend with space gray tones
3. **Flat key aesthetic** - Match the reference's minimal depth/shadow style
4. **Subtle key glow for layers** - Keys get a colored outline/glow on Hyper/Command layers
5. **Keyboard only** - No chassis simulation, just the keyboard area

## Implementation Plan

### 1. Add Inter Font

**File: `src/index.html`**

Add Google Fonts import for Inter alongside existing fonts. Inter will be the primary font for key labels, replacing Geist Mono for most uses.

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" />
```

### 2. Update GlobalStyles.ts

**File: `src/styles/GlobalStyles.ts`**

Changes to make:

- **Root variables**: Add new CSS variables for the dark theme colors:
  - `--key-bg-dark`: Near-black key color (around `#1d1d1f` - Apple's dark gray)
  - `--key-text-light`: White/light gray for text on dark keys
  - `--frame-bg`: Space gray frame color (`#2d2d2f` or similar)

- **Background gradient**: Adjust the `.bg-gradient` colors to be more space-gray aligned while keeping the warm animated effect. The current warm orange/purple/rose tones should remain but shifted to work better against a dark keyboard. Consider:
  - Darken the base gradient (`#1a1410` → more neutral gray-black)
  - Keep the animated radial gradients but reduce their intensity slightly
  - The overall effect should feel like ambient warm lighting reflecting off a space gray laptop

### 3. Update Keyboard.tsx (KeyboardFrame)

**File: `src/components/Keyboard.tsx`**

Transform `KeyboardFrame` styled component:

- **Background**: Change from light silver gradient to space gray. Use a subtle dark gradient:
  ```
  linear-gradient(
    168deg,
    #3a3a3c 0%,
    #2d2d2f 50%,
    #252527 100%
  )
  ```
  This mimics the space gray aluminum with slight variation.

- **Border**: Change to a subtle dark edge, perhaps `rgba(255, 255, 255, 0.08)` for a hint of highlight on the top edge.

- **Box-shadow**: Simplify significantly. The reference shows a clean, flat look. Reduce the elaborate shadow stack to just:
  - A subtle drop shadow for depth
  - Keep the layer glow effect in the `::before` pseudo-element

- **Layer glow** (`::before`): Keep this mechanism but potentially adjust colors to work better against the dark aesthetic.

### 4. Update Key.tsx (Major Changes)

**File: `src/components/Key.tsx`**

This is the most significant change. The `StyledKey` component needs a complete color overhaul:

#### Base Key Styling

- **Background**: Change from white/light gradient to near-black. The reference shows almost completely flat black keys. Use something like:
  ```
  background: linear-gradient(
    180deg,
    #2c2c2e 0%,
    #1d1d1f 100%
  );
  ```
  Very subtle gradient, mostly flat.

- **Border**: Very subtle, something like `rgba(255, 255, 255, 0.05)` - barely visible edge highlight.

- **Box-shadow**: Dramatically reduce. The reference shows almost no visible shadow. Perhaps just:
  ```
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.3);
  ```
  Or even simpler.

- **Text color**: All `KeyLabel`, `KeyLabelSecondary`, `KeyLabelPrimary` need white/light gray colors instead of dark.

#### Hover State

- Subtle lightening of the key, perhaps `#3a3a3c` background
- Very minimal - the reference keyboard doesn't show dramatic hover states

#### Active/Pressed State

- Slightly darker than base, no translateY transform needed for flat aesthetic
- Or keep the subtle press-down effect if desired for interaction feedback

#### Ripple/Flash Animations

- Adjust `keyFlash` and `keyGlow` animations to work with dark keys
- The colored ripple should still be visible but adapted for dark background

#### Function and Modifier Keys

- The `$isFunction` and `$isModifier` variants should use similar dark styling
- In the reference, all keys appear uniformly dark

#### Dimmed State (`$isDimmed`)

- Instead of opacity reduction on light keys, use a darker/more muted appearance
- Perhaps slightly grayer text instead of fully dimmed opacity

#### Selected State (`$isSelected`)

- The colored outline should work well on dark keys
- May need to adjust the glow intensity for visibility

#### Editable State

- Cursor pointer stays, but any visual hover indicator should work on dark

### 5. Update Text Labels in Key.tsx

All text components need color updates:

- `KeyLabel`: Change `color: #2a2a2c` → `color: #ffffff` (or `rgba(255, 255, 255, 0.95)`)
- `KeyLabelSecondary`: Change `color: #707074` → `color: rgba(255, 255, 255, 0.6)` (light gray)
- `KeyLabelPrimary`: Change `color: #2a2a2c` → `color: #ffffff`
- `KeyMappingLabel`: Change `color: #3a3a3c` → `color: rgba(255, 255, 255, 0.9)`

### 6. Font Family Updates

Update font-family declarations throughout Key.tsx:

- Change `font-family: "Geist Mono", "SF Mono", monospace` to `font-family: "Inter", -apple-system, sans-serif` for main labels
- The reference MacBook keyboard uses SF Pro, and Inter is a close match
- Consider keeping monospace for certain elements if preferred, but Inter is requested

### 7. Icon Styling for Dark Background

**File: `src/components/Key.tsx`**

The `KeyMappingIcon` component may need adjustments:

- The `filter: drop-shadow()` should work fine on dark backgrounds
- May want to add a subtle light glow or border to make icons pop on dark keys
- Consider: `filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.2))`

### 8. Modifier Key Label Layouts

**Files: `src/data/macbook-layout.ts` and `src/types/index.ts`**

The reference image shows modifier keys have specific text layouts that differ from the current symbol-only approach. This requires extending the data model and updating rendering.

#### Type Changes (`src/types/index.ts`)

Extend `KeyDefinition` to support the MacBook modifier key label layout:

```typescript
export interface KeyDefinition {
  id: string;
  label: string;
  secondaryLabel?: string;
  textLabel?: string;        // NEW: Text name like "tab", "caps lock", "shift", etc.
  symbolLabel?: string;      // NEW: Symbol like ⌃, ⌥, ⌘ for bottom-row modifiers
  hasIndicator?: boolean;    // NEW: For caps lock LED indicator dot
  width?: number;
  height?: number;
  isModifier?: boolean;
  isFunction?: boolean;
}
```

#### Data Changes (`src/data/macbook-layout.ts`)

Update modifier key definitions to match the reference image exactly:

**Row 0 - Number Row:**
- `backspace`: Change label from "⌫" to "delete" (text only, right-aligned in key)

**Row 1 - QWERTY Row:**
- `tab`: Change from "⇥" symbol to `textLabel: "tab"` (bottom-left aligned)

**Row 2 - Home Row:**
- `caps`: Add `textLabel: "caps lock"`, `hasIndicator: true` (text bottom-left, indicator dot on left side of key)
- `return`: Change from "↵" to `textLabel: "return"` (right-aligned)

**Row 3 - ZXCV Row:**
- `shift-left`: Change from "⇧" to `textLabel: "shift"` (bottom-left aligned)
- `shift-right`: Change from "⇧" to `textLabel: "shift"` (bottom-right aligned)

**Row 4 - Modifier Row (most complex):**
- `fn`: Keep `label: "fn"`, add globe icon (🌐) above it - this key has two-line layout with globe on top, "fn" below
- `control`: Add `symbolLabel: "⌃"`, `textLabel: "control"` (symbol top, text bottom)
- `option-left`: Add `symbolLabel: "⌥"`, `textLabel: "option"` (symbol top, text bottom)
- `command-left`: Add `symbolLabel: "⌘"`, `textLabel: "command"` (symbol top, text bottom)
- `command-right`: Add `symbolLabel: "⌘"`, `textLabel: "command"` (symbol top, text bottom)
- `option-right`: Add `symbolLabel: "⌥"`, `textLabel: "option"` (symbol top, text bottom)

**Arrow keys:** Keep current triangle symbols (◀ ▲ ▼ ▶) - these match the reference

#### Detailed Layout Specifications from Reference Image

| Key | Current | New Layout | Alignment |
|-----|---------|------------|-----------|
| delete | ⌫ | "delete" | Right-aligned, vertically centered |
| tab | ⇥ | "tab" | Bottom-left corner |
| caps lock | ⇪ | "caps lock" + dot | Text bottom-left, indicator dot left edge (green when active) |
| return | ↵ | "return" | Right-aligned, vertically centered |
| shift (L) | ⇧ | "shift" | Bottom-left corner |
| shift (R) | ⇧ | "shift" | Bottom-right corner |
| fn | fn | 🌐 above, "fn" below | Stacked vertically, centered |
| control | ⌃ | ⌃ above, "control" below | Stacked vertically, left-aligned |
| option | ⌥ | ⌥ above, "option" below | Stacked vertically, left-aligned |
| command | ⌘ | ⌘ above, "command" below | Stacked vertically, left-aligned |

#### Component Changes (`src/components/Key.tsx`)

Add new styled components and rendering logic for modifier key layouts:

1. **ModifierKeyLayout** - A flex container for stacked symbol + text layout (used by control, option, command)

2. **ModifierTextLabel** - Smaller text for modifier names, positioned appropriately:
   - Font: Inter, smaller than primary labels (~10px base)
   - Color: Same white as other labels
   - All lowercase (matching Apple's style)

3. **CapsLockIndicator** - Small circular dot for caps lock:
   - Positioned on left side of key
   - Default: Subtle gray/off appearance
   - Active state: Green glow (can hook into actual caps lock state later)

4. **FnKeyLayout** - Special two-line layout for fn key with globe icon on top

5. Update `renderBaseLabel` function to handle the new label types:
   - Check for `textLabel` and `symbolLabel` presence
   - Route to appropriate layout component based on key type
   - Handle alignment variations (left vs right vs centered)

#### Rendering Logic

```
if (key.symbolLabel && key.textLabel) {
  // Bottom-row modifiers: render stacked (symbol on top, text below)
  return <ModifierStackedLayout symbol={symbolLabel} text={textLabel} />
}

if (key.textLabel && !key.symbolLabel) {
  // Simple text modifiers: tab, caps lock, return, shift, delete
  return <ModifierTextOnly text={textLabel} alignment={...} hasIndicator={hasIndicator} />
}

if (key.id === 'fn') {
  // Special fn key with globe
  return <FnKeyLayout />
}

// Default: existing label rendering
```

### 9. CSS Variable Consolidation (Optional but Recommended)

Consider adding theme variables to GlobalStyles.ts for maintainability:

```css
:root {
  /* Dark theme colors */
  --color-key-bg: #1d1d1f;
  --color-key-bg-hover: #2c2c2e;
  --color-key-text: #ffffff;
  --color-key-text-secondary: rgba(255, 255, 255, 0.6);
  --color-frame-bg: #2d2d2f;
  --color-frame-border: rgba(255, 255, 255, 0.08);
}
```

This makes future theme adjustments easier.

## Files to Modify

1. `src/index.html` - Add Inter font import
2. `src/styles/GlobalStyles.ts` - Background adjustments, new CSS variables
3. `src/components/Keyboard.tsx` - KeyboardFrame dark styling
4. `src/components/Key.tsx` - Complete key styling overhaul + modifier key layouts (largest change)
5. `src/types/index.ts` - Extend KeyDefinition with textLabel, symbolLabel, hasIndicator
6. `src/data/macbook-layout.ts` - Update modifier keys with proper label data

## Testing Considerations

- Test all three layers (Base, Hyper, Command) to ensure text/icons are visible
- Verify layer accent colors still provide good contrast
- Check hover, active, selected states on dark keys
- Confirm mapped icons (app icons) display well on dark backgrounds
- Test the ripple/flash animations on dark keys
- Mobile responsiveness should be unaffected

## Visual Reference Summary

Target aesthetic from the MacBook Pro reference image:
- **Frame**: Dark space gray, almost black, subtle metallic gradient
- **Keys**: Pure black/near-black, extremely flat, white text
- **Gaps**: Very thin, uniform gaps between keys (current spacing should work)
- **Typography**: Clean sans-serif (Inter), white on black
- **Secondary labels**: Smaller, positioned above primary, light gray

The result should look like a photographed MacBook keyboard rendered in CSS, with the app's layer-switching and mapping features overlaid cleanly on this base.
