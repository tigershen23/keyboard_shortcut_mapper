# Human

specs/resources/2021-macbook-pro-keyboard.jpg

This set of work is going to be all about improving the UI of the keyboard so that it really, really closely mimics what a real MacBook keyboard looks like. In order to do that, please review, using your vision capability, the screenshot of a real keyboard here and focus in on the main part of the keyboard, which we are rendering in our application. Update the UI to be as close of a match as possible to the image and update the background to be similar to the space gray of the laptop while keeping something like the gradient based on the base, hyper, and command layer colors, which I think is quite nice.
For font, let's use inter.

Updates after nap!!

- Top Left opt/cmd/etc
- Globe key
- Shorten all the rows: tilde is normal sized, adjust accordingly by making the right side keys same size. Also the backslash key is normal sized
- Bit more space on number keys
- Closer opacity between 1 and !
- More padding for English labels
- Overall background, space gray #1D1D1F
- Size of arrows

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

### 1. Font Strategy

**File: `src/index.html`**

Use the Apple system font (SF Pro) as the primary font, with Inter as a cross-platform fallback. SF Pro is the actual font used on MacBook keyboards and is available on macOS/iOS devices. Inter serves as a high-quality fallback for Windows/Linux users.

Add Inter as a fallback:

```html
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap"
/>
```

The font stack should be:

```css
font-family:
  -apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", sans-serif;
```

This ensures:

- macOS users see SF Pro (the authentic MacBook font)
- Other platforms fall back to Inter (visually similar)
- Final fallback to system sans-serif

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

- Change `font-family: "Geist Mono", "SF Mono", monospace` to the system font stack:
  ```css
  font-family:
    -apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", sans-serif;
  ```
- This prioritizes SF Pro (the actual MacBook keyboard font) on Apple devices
- Inter serves as a cross-platform fallback for Windows/Linux
- Remove monospace fonts - the real keyboard uses proportional sans-serif

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
  textLabel?: string; // NEW: Text name like "tab", "caps lock", "shift", etc.
  symbolLabel?: string; // NEW: Symbol like ⌃, ⌥, ⌘ for bottom-row modifiers
  hasIndicator?: boolean; // NEW: For caps lock LED indicator dot
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

**Arrow keys:**

- Keep current triangle symbols (◀ ▲ ▼ ▶)
- **CRITICAL**: Change left and right arrows to half-height (`height: 0.5`)
- All four arrows form an inverted-T cluster, all half-height

#### Detailed Layout Specifications from Reference Image

| Key       | Current | New Layout               | Alignment                                                     |
| --------- | ------- | ------------------------ | ------------------------------------------------------------- |
| delete    | ⌫       | "delete"                 | Right-aligned, vertically centered                            |
| tab       | ⇥       | "tab"                    | Bottom-left corner                                            |
| caps lock | ⇪       | "caps lock" + dot        | Text bottom-left, indicator dot left edge (green when active) |
| return    | ↵       | "return"                 | Right-aligned, vertically centered                            |
| shift (L) | ⇧       | "shift"                  | Bottom-left corner                                            |
| shift (R) | ⇧       | "shift"                  | Bottom-right corner                                           |
| fn        | fn      | 🌐 above, "fn" below     | Stacked vertically, centered                                  |
| control   | ⌃       | ⌃ above, "control" below | Stacked vertically, left-aligned                              |
| option    | ⌥       | ⌥ above, "option" below  | Stacked vertically, left-aligned                              |
| command   | ⌘       | ⌘ above, "command" below | Stacked vertically, left-aligned                              |

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

### 9. Arrow Cluster Layout Fix

**File: `src/components/Keyboard.tsx`**

The current implementation has only up/down arrows as half-height. In the reference image, ALL FOUR arrow keys are half-height, forming an inverted-T cluster.

#### Data Change (`src/data/macbook-layout.ts`)

Update the arrow key definitions:

```typescript
{ id: "arrow-left", label: "◀", width: 1, height: 0.5 },   // Add height: 0.5
{ id: "arrow-up", label: "▲", width: 1, height: 0.5 },
{ id: "arrow-down", label: "▼", width: 1, height: 0.5 },
{ id: "arrow-right", label: "▶", width: 1, height: 0.5 },  // Add height: 0.5
```

#### Component Change (`ArrowCluster` in Keyboard.tsx)

The current `ArrowCluster` and `ArrowVertical` styled components need restructuring:

Current behavior:

- Left arrow: Full height
- Up/Down: Stacked vertically (half-height each)
- Right arrow: Full height

Required behavior:

- Left arrow: Half-height, bottom-aligned
- Up/Down: Stacked vertically in center (half-height each)
- Right arrow: Half-height, bottom-aligned

The layout should be:

```
       [▲]
[◀]    [▼]    [▶]
```

Where all four keys have the same half-height, and left/right align to the bottom edge (same level as down arrow).

Update `ArrowCluster` to use CSS grid or adjust flex alignment so left and right arrows align to the bottom of their container, matching the bottom edge of the down arrow.

### 10. Keyboard Event Pass-Through

**File: `src/hooks/useKeyboardListener.ts`**

Currently, the keyboard listener swallows events and blocks system shortcuts when modifier keys are involved. The desired behavior is to:

1. **Always show ripple animations** on pressed keys (including modifiers)
2. **Never block system shortcuts** - let Cmd+C, Cmd+V, etc. work normally

#### Current Problematic Behavior (lines 104-106)

```typescript
// Allow system shortcuts through (but not shift alone)
if (event.metaKey || event.ctrlKey || event.altKey) {
  return; // Returns early, so NO animation happens on modifier keys
}
```

This early return means:

- When you press Cmd alone: No animation (bad)
- When you press Cmd+C: No animation on either key (bad)
- System shortcuts work (good)

#### Desired Behavior

- When you press Cmd alone: Animate the Command key, don't prevent default
- When you press Cmd+C: Animate BOTH Command and C keys, don't prevent default
- System shortcuts continue to work normally

#### Implementation Changes

1. **Remove the early return** for modifier key detection

2. **Never call `event.preventDefault()`** for keys that are part of system shortcuts. Only prevent default for:
   - Tab key (used for layer cycling)
   - Possibly arrow keys if they'd scroll the page

3. **Always trigger `onKeyPress()`** for visual feedback, regardless of modifiers

4. **Track modifier state** to animate modifier keys when pressed:
   - Listen for Meta/Ctrl/Alt/Shift keydown events
   - Trigger animation on the corresponding modifier key
   - The modifier keys have IDs: `command-left`, `command-right`, `option-left`, `option-right`, `control`, `shift-left`, `shift-right`

#### Revised Logic

```typescript
function handleKeyDown(event: KeyboardEvent) {
  const keyId = codeToKeyId[event.code];
  if (!keyId) return;

  // Tab cycles layers - this is the ONLY key we prevent default on
  if (keyId === "tab") {
    event.preventDefault();
    onLayerCycle(event.shiftKey ? "backward" : "forward");
    // Still animate the tab key
    onKeyPress(keyId);
    return;
  }

  // For all other keys: animate but DON'T prevent default
  // This allows system shortcuts (Cmd+C, etc.) to work
  onKeyPress(keyId);

  // Note: we deliberately do NOT call event.preventDefault()
  // so browser/OS shortcuts pass through
}
```

#### Edge Cases to Handle

1. **Repeated keydown events**: When holding a key, keydown fires repeatedly. The current ripple animation should handle this gracefully (it already has a timeout).

2. **Modifier-only presses**: Pressing and releasing Cmd without another key should still animate the Command key.

3. **Multiple simultaneous keys**: Pressing Cmd+Shift+C should animate all three keys (command, shift, c).

### 11. CSS Variable Consolidation (Optional but Recommended)

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
3. `src/components/Keyboard.tsx` - KeyboardFrame dark styling, arrow cluster layout
4. `src/components/Key.tsx` - Complete key styling overhaul + modifier key layouts (largest change)
5. `src/types/index.ts` - Extend KeyDefinition with textLabel, symbolLabel, hasIndicator
6. `src/data/macbook-layout.ts` - Update modifier keys with proper label data, fix arrow key heights
7. `src/hooks/useKeyboardListener.ts` - Pass-through keyboard events while still animating keys

## Testing Considerations

- Test all three layers (Base, Hyper, Command) to ensure text/icons are visible
- Verify layer accent colors still provide good contrast
- Check hover, active, selected states on dark keys
- Confirm mapped icons (app icons) display well on dark backgrounds
- Test the ripple/flash animations on dark keys
- Mobile responsiveness should be unaffected
- **Arrow cluster**: Verify all four arrows are half-height and properly aligned in inverted-T formation
- **Modifier keys**: Verify text labels render correctly with proper alignment (bottom-left for tab/caps/shift, right for delete/return, stacked for fn/control/option/command)
- **Caps lock indicator**: Verify dot appears correctly (can test active state later)
- **Keyboard pass-through**: Verify Cmd+C, Cmd+V, and other system shortcuts still work
- **Modifier animation**: Verify pressing Cmd/Ctrl/Option shows ripple animation on those keys
- **Combo animation**: Verify pressing Cmd+C animates both the Command key and the C key

## Comprehensive Visual Reference Analysis

Detailed observations from the 2021 MacBook Pro reference image:

### Frame & Background

- **Frame color**: Dark space gray (#2d2d2f to #3a3a3c range), subtle metallic sheen
- **Frame corners**: Rounded, approximately 12-16px radius equivalent
- **Key bed**: Slightly recessed into frame, creating a subtle well effect
- **Overall finish**: Matte, non-reflective surface

### Key Appearance

- **Key color**: Pure black/near-black (#1d1d1f), extremely flat/matte
- **Key surface**: No visible gradient, completely flat appearance
- **Key corners**: Very subtle radius, approximately 3-4px equivalent
- **Key gaps**: Extremely narrow (~2px), uniform throughout
- **Key shadows**: Virtually none visible - completely flat design

### Typography Details

- **Font style**: SF Pro (Apple's system font) - use `-apple-system` to access it on macOS, Inter as fallback
- **Primary labels**: White (#ffffff), medium weight
- **Secondary labels** (shift characters): Light gray (~60% opacity white), smaller, positioned ABOVE primary labels
- **All modifier text**: Lowercase (tab, caps lock, shift, delete, return, fn, control, option, command)
- **Letter keys**: Uppercase single letters (A-Z)
- **Number keys**: Number on bottom, shift symbol on top

### Arrow Key Cluster - CRITICAL FIX

**All four arrow keys are half-height** forming an inverted-T:

- Left arrow (◀): Half-height, full-width
- Up arrow (▲): Half-height, full-width
- Down arrow (▼): Half-height, full-width
- Right arrow (▶): Half-height, full-width

The current layout has only up/down as half-height. Must update:

```typescript
{ id: "arrow-left", label: "◀", width: 1, height: 0.5 },  // ADD height: 0.5
{ id: "arrow-up", label: "▲", width: 1, height: 0.5 },
{ id: "arrow-down", label: "▼", width: 1, height: 0.5 },
{ id: "arrow-right", label: "▶", width: 1, height: 0.5 }, // ADD height: 0.5
```

The arrow cluster rendering in `Keyboard.tsx` (`ArrowCluster` and `ArrowVertical`) needs adjustment:

- Left arrow sits alone on the left, half-height, aligned to bottom
- Up/Down stack vertically in the middle
- Right arrow sits alone on the right, half-height, aligned to bottom
- All four keys should have their bottom edges aligned

### Specific Key Layouts by Row

**Number Row (Row 0):**
| Key | Primary | Secondary | Notes |
|-----|---------|-----------|-------|
| `|` | ~ | Secondary above |
| 1-0 | Number | Symbol (!, @, etc.) | Symbol above number |
| - | - | \_ | |
| = | = | + | |
| delete | "delete" | - | Text only, right-aligned |

**QWERTY Row (Row 1):**
| Key | Layout | Notes |
|-----|--------|-------|
| tab | "tab" | Text bottom-left |
| Q-P | Single uppercase letter | Centered |
| [ | [ | { above |
| ] | ] | } above |
| \ | \ | \| above |

**Home Row (Row 2):**
| Key | Layout | Notes |
|-----|--------|-------|
| caps lock | "caps lock" + indicator | Text bottom-left, LED dot on left edge |
| A-L | Single uppercase letter | Centered |
| ; | ; | : above |
| ' | ' | " above |
| return | "return" | Text right-aligned |

**ZXCV Row (Row 3):**
| Key | Layout | Notes |
|-----|--------|-------|
| shift | "shift" | Text bottom-left (left shift) |
| Z-M | Single uppercase letter | Centered |
| , | , | < above |
| . | . | > above |
| / | / | ? above |
| shift | "shift" | Text bottom-right (right shift) |

**Modifier Row (Row 4):**
| Key | Layout | Notes |
|-----|--------|-------|
| fn | 🌐 on top, "fn" below | Stacked, centered |
| control | ^ on top, "control" below | Stacked, left-aligned |
| option | ⌥ on top, "option" below | Stacked, left-aligned |
| command | ⌘ on top, "command" below | Stacked, left-aligned |
| space | (empty) | No label |
| command | ⌘ on top, "command" below | Stacked, left-aligned |
| option | ⌥ on top, "option" below | Stacked, left-aligned (no "control" text on right side) |
| arrows | ◀ ▲ ▼ ▶ | All half-height, inverted-T cluster |

### Additional Observations

1. **Esc key** (if included in future): Just "esc" text, bottom-left aligned
2. **Touch Bar area** (not in our scope): The F1-F12 keys with icons are in the Touch Bar area
3. **Globe icon**: The fn key has Apple's globe icon (🌐 or SF Symbol equivalent)
4. **Control symbol**: Uses the up-caret ^ character, not ⌃ (though both represent control)

### Implementation Priority

1. **High Priority**:
   - Dark key colors and flat styling
   - Arrow key height fix (all four half-height)
   - Modifier key text labels and layouts
   - White text on dark keys

2. **Medium Priority**:
   - Caps lock indicator dot
   - Precise text alignments per key type
   - Globe icon for fn key

3. **Lower Priority**:
   - Exact color matching (can fine-tune)
   - Animation adjustments for dark theme

The result should look like a photographed MacBook keyboard rendered in CSS, with the app's layer-switching and mapping features overlaid cleanly on this base.

---

# Implementation

## What Was Built

Transformed the keyboard UI to closely match the 2021 MacBook Pro reference image with:

1. **Dark Keys on Silver Frame**: Keys now use near-black backgrounds (#1d1d1f to #2c2c2e gradient) with white text, while the keyboard frame remains silver/aluminum.

2. **Updated Font Stack**: Replaced Geist Mono with SF Pro (via system fonts) and Inter as fallback. All key labels now use `-apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", sans-serif`.

3. **Modifier Key Text Labels**: Implemented all the MacBook-style modifier key layouts:
   - `delete`, `tab`, `caps lock`, `return`, `shift`: Text labels with proper alignment (bottom-left or right)
   - `fn`: Stacked globe emoji (🌐) above "fn" text
   - `control`, `option`, `command`: Stacked layout with symbol on top, text below
   - Caps lock indicator dot (decorative only)

4. **Arrow Key Cluster Fix**: All four arrow keys now have `height: 0.5` forming the inverted-T cluster. ArrowSingle wrapper added to properly align left/right arrows to bottom.

5. **Keyboard Event Pass-Through**: Modifier keys (Cmd, Ctrl, Option, Shift) now animate when pressed while system shortcuts continue to work. Tab still cycles layers without animation (per user preference).

## Files Modified

- `src/index.html` - Replaced Geist Mono with Inter font import
- `src/types/index.ts` - Added `textLabel`, `symbolLabel`, `hasIndicator` to KeyDefinition
- `src/data/macbook-layout.ts` - Updated all modifier keys with proper label data, all arrows now half-height
- `src/components/Key.tsx` - Complete dark theme overhaul + modifier key layout components
- `src/components/Keyboard.tsx` - Added ArrowSingle wrapper for proper arrow alignment
- `src/hooks/useKeyboardListener.ts` - Fixed event pass-through to animate modifiers

## Decisions Made

1. **Silver frame kept**: User clarified the frame should be silver (like the reference image), not space gray. The KeyboardFrame component was NOT modified since the existing silver gradient matches the reference.

2. **Caps lock indicator decorative**: Implemented as a subtle gray dot, not functional (per user choice).

3. **Globe icon via Unicode**: Used the 🌐 emoji for the fn key's globe icon rather than a custom SVG (per user choice).

4. **No Tab animation**: Tab key cycles layers without visual ripple feedback (per user preference).

## Deviations from Plan

- The spec originally suggested changing the frame to space gray, but user clarified to keep silver. Frame styling was left unchanged.
- Background gradient changes were not made since user indicated the silver look should be preserved.
