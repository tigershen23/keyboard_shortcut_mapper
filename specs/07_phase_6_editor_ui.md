# Phase 6: Mapping Editor UI

**Goal**: Allow users to add, edit, and remove key mappings directly through an intuitive in-app interface.

---

## Overview

This phase transforms the keyboard visualizer into a fully interactive configuration tool. The editing experience is integrated directly into the main view — no separate "edit mode" toggle. Users simply click a key on the Hyper or Command layer to edit it.

Key principles:

- **Direct manipulation**: Click a key, edit it right there
- **Minimal disruption**: Popover appears near the clicked key, not across the screen
- **Always editable**: No mode switching required (Hyper/Command layers are always editable)
- **Immediate feedback**: Changes reflect instantly on the keyboard

---

## User Experience Flow

### Clicking a Key

On **Base layer**:
- Keys show standard labels
- Clicking triggers the ripple effect (existing behavior)
- No editing available

On **Hyper or Command layer**:
- Clicking a key opens an inline popover directly adjacent to that key
- The clicked key gets a selection highlight
- Popover contains a compact form for editing the mapping
- User edits and saves, or clicks away to cancel

### The Edit Popover

The popover appears anchored to the clicked key, positioned intelligently to stay within viewport bounds:
- Keys on the left side of keyboard → popover appears to the right
- Keys on the right side → popover appears to the left
- Keys at the top → popover appears below
- Keys at the bottom → popover appears above

The popover is compact and focused:

```
┌────────────────────────────────┐
│  ┌──────────────────────────┐  │
│  │ Slack                    │  │  ← Action name input
│  └──────────────────────────┘  │
│                                │
│  App  ┌──────────────────┐     │
│       │ Slack          ▾ │     │  ← App combobox (for icon)
│       └──────────────────┘     │
│                                │
│  [Delete]          [Save]      │  ← Action buttons
└────────────────────────────────┘
```

The popover includes:

1. **Action name input** (required) — what displays on the key
2. **App combobox** (optional) — searchable dropdown of available apps from icon manifest
3. **Delete button** — only shown if key has existing mapping
4. **Save button** — saves and closes

### Visual Feedback

When editing:
- The selected key has a prominent accent border/glow
- The popover has a subtle connecting visual (arrow/stem pointing to key)
- Background dims slightly to focus attention on the edit area
- Other keys remain visible but slightly muted

### Keyboard Interaction

While popover is open:
- `Enter` — Save and close
- `Escape` — Cancel and close (discard changes)
- `Tab` — Navigate between form fields
- Clicking outside popover — Cancel and close

---

## Architecture

### State Management

Extend the existing contexts rather than creating new ones. The editor state is simple:

```typescript
// In MappingContext or a small EditorContext
interface EditorState {
  selectedKeyId: string | null;  // null = nothing being edited
  selectedKeyElement: HTMLElement | null;  // for positioning
}
```

### Data Flow

```
User clicks key (Hyper/Command layer)
    ↓
Set selectedKeyId + capture element ref
    ↓
Popover renders, positioned relative to key element
    ↓
User edits form
    ↓
On save: MappingContext.updateMapping(layer, mapping)
    ↓
Clear selection, popover closes
```

### Popover Positioning

Use the key's DOM element to calculate popover position:

```typescript
function calculatePopoverPosition(keyElement: HTMLElement): { top: number; left: number; placement: 'left' | 'right' | 'top' | 'bottom' } {
  const rect = keyElement.getBoundingClientRect();
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // Prefer right side, fall back to left if not enough space
  const preferRight = rect.right + POPOVER_WIDTH + MARGIN < viewportWidth;
  // Prefer below, fall back to above if not enough space
  const preferBelow = rect.bottom + POPOVER_HEIGHT + MARGIN < viewportHeight;

  // Return position and placement for arrow direction
}
```

---

## Dependencies

### Base UI

Use [Base UI](https://base-ui.com) (`@base-ui/react`) for the popover and combobox components. Base UI is a headless component library — it provides behavior, accessibility, and positioning logic while leaving styling entirely to us.

```bash
bun add @base-ui/react
```

**Why Base UI?**

- **Headless**: No default styles, works seamlessly with styled-components
- **Accessible**: ARIA attributes, keyboard navigation, focus management built-in
- **Compositional**: Each component is assembled from small parts (Root, Trigger, Popup, etc.)
- **Positioning**: Built-in collision detection, viewport awareness, arrow positioning
- **Tree-shakable**: Only imports what you use

### Setup Requirements

Add to global styles for proper portal stacking:

```css
#root {
  isolation: isolate;
}
```

This creates a stacking context so popups appear above page content without z-index conflicts.

### Components We'll Use

1. **Popover** — For the key edit popover
   - `Popover.Root`, `Popover.Trigger`, `Popover.Portal`, `Popover.Positioner`, `Popover.Popup`, `Popover.Arrow`

2. **Combobox** — For the app selector dropdown
   - `Combobox.Root`, `Combobox.Input`, `Combobox.Portal`, `Combobox.Positioner`, `Combobox.Popup`, `Combobox.Item`

3. **Field** (optional) — For form field labeling
   - `Field.Root`, `Field.Label`

### Styling Base UI with styled-components

Base UI components accept `render` props or can be wrapped. The cleanest approach is to style the parts directly:

```typescript
import { Popover } from '@base-ui/react/popover';
import styled from 'styled-components';

const StyledPopup = styled(Popover.Popup)`
  background: rgba(28, 28, 32, 0.95);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);

  /* Animation using Base UI data attributes */
  &[data-open] {
    animation: fadeIn 0.15s ease-out;
  }

  &[data-closed] {
    animation: fadeOut 0.1s ease-in;
  }
`;

const StyledArrow = styled(Popover.Arrow)`
  width: 12px;
  height: 12px;
  background: rgba(28, 28, 32, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transform: rotate(45deg);
`;
```

### Base UI Popover Example

```typescript
import { Popover } from '@base-ui/react/popover';

function KeyPopover({ keyElement, onClose, children }) {
  return (
    <Popover.Root open onOpenChange={(open) => !open && onClose()}>
      {/* Anchor to the key element */}
      <Popover.Anchor virtualElement={{ getBoundingClientRect: () => keyElement.getBoundingClientRect() }} />

      <Popover.Portal>
        <Popover.Positioner side="right" sideOffset={8} align="center">
          <StyledPopup>
            <StyledArrow />
            {children}
          </StyledPopup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
```

Key Positioner props:
- `side`: `'top'` | `'bottom'` | `'left'` | `'right'` — preferred position
- `sideOffset`: pixels from anchor
- `align`: `'start'` | `'center'` | `'end'` — alignment along the side
- `collisionAvoidance`: automatically flips/shifts when hitting viewport edges

### Base UI Combobox Example

```typescript
import { Combobox } from '@base-ui/react/combobox';
import { iconManifest, getIconPath } from '../data/icon-manifest';

const apps = Object.keys(iconManifest);

function AppCombobox({ value, onChange }) {
  return (
    <Combobox.Root
      value={value}
      onValueChange={onChange}
      items={apps}
    >
      <StyledInput placeholder="Search apps..." />

      <Combobox.Portal>
        <Combobox.Positioner sideOffset={4}>
          <StyledPopup>
            {apps.map((app) => (
              <StyledItem key={app} value={app}>
                <AppIcon src={getIconPath(app)} alt="" />
                <span>{app}</span>
                <Combobox.ItemIndicator>✓</Combobox.ItemIndicator>
              </StyledItem>
            ))}
          </StyledPopup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </Combobox.Root>
  );
}

const StyledInput = styled(Combobox.Input)`
  width: 100%;
  height: 36px;
  padding: 0 12px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 6px;
  color: white;
  font-family: 'Instrument Sans', sans-serif;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: var(--layer-accent);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }
`;

const StyledItem = styled(Combobox.Item)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 4px;

  &[data-highlighted] {
    background: rgba(255, 255, 255, 0.1);
  }

  &[data-selected] {
    background: var(--layer-accent);
  }
`;
```

Combobox features:
- Built-in filtering (or provide custom `filter` function)
- Keyboard navigation (arrow keys, enter, escape)
- `data-highlighted` and `data-selected` attributes for styling
- `autoHighlight` prop to auto-select first match

### When to Use Base UI vs Build From Scratch

Use this guidance during implementation:

**Use Base UI for:**

| Component | Why |
|-----------|-----|
| Popover | Positioning, collision detection, arrow placement, click-outside, escape handling — lots of edge cases |
| Combobox | Keyboard navigation, filtering, ARIA attributes, focus management — complex accessibility requirements |
| Dialog/Modal | Focus trapping, scroll locking, portal management |

**Build from scratch:**

| Component | Why |
|-----------|-----|
| Text inputs | Just a styled `<input>` — no complex behavior needed |
| Buttons | Just styled `<button>` elements |
| Form layout | Simple divs with flexbox/grid |
| Labels | Just styled `<label>` elements |

**Rule of thumb**: If the component needs complex keyboard handling, focus management, or positioning logic, reach for Base UI. If it's just about visual styling of native elements, use styled-components directly.

**Form elements in the popover:**

The form inside the popover is simple — just inputs and buttons. Build these with styled-components:

```typescript
// These are just styled native elements - no Base UI needed
const StyledInput = styled.input`
  width: 100%;
  height: 36px;
  padding: 0 12px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 6px;
  color: white;
  font-family: 'Instrument Sans', sans-serif;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: var(--layer-accent);
    box-shadow: 0 0 0 2px rgba(var(--layer-accent-rgb), 0.2);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }
`;

const SaveButton = styled.button<{ $accent: string; disabled?: boolean }>`
  height: 32px;
  padding: 0 16px;
  background: ${({ $accent, disabled }) => disabled ? 'rgba(255,255,255,0.1)' : $accent};
  border: none;
  border-radius: 6px;
  color: white;
  font-family: 'Instrument Sans', sans-serif;
  font-weight: 500;
  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};
  opacity: ${({ disabled }) => disabled ? 0.5 : 1};
  transition: opacity 0.15s, background 0.15s;

  &:hover:not(:disabled) {
    filter: brightness(1.1);
  }
`;

const DeleteButton = styled.button`
  height: 32px;
  padding: 0 12px;
  background: transparent;
  border: none;
  border-radius: 6px;
  color: rgba(220, 80, 80, 0.9);
  font-family: 'Instrument Sans', sans-serif;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background: rgba(220, 80, 80, 0.15);
  }
`;
```

Only the **Combobox** for app selection needs Base UI because it has a dropdown with keyboard navigation. The action name input is just a plain styled input.

---

## Implementation Steps

### Step 1: Add Editor State to MappingContext

**File**: `src/context/MappingContext.tsx` (modify)

Add selection state:

```typescript
interface MappingContextValue {
  // ... existing
  selectedKeyId: string | null;
  selectKey: (keyId: string, element: HTMLElement) => void;
  clearSelection: () => void;
  selectedKeyRect: DOMRect | null;
}
```

The `selectKey` function:
- Sets the selected key ID
- Captures the key element's bounding rect for positioning
- Called when user clicks a key on editable layers

The `clearSelection` function:
- Clears selection
- Called on save, cancel, escape, or click outside

### Step 2: Update Key Component

**File**: `src/components/Key.tsx` (modify)

Add click handling for editable layers:

```typescript
interface KeyProps {
  // ... existing
  isEditable?: boolean;  // true for Hyper/Command layers
  isSelected?: boolean;  // true when this key is being edited
  onSelect?: (keyId: string, element: HTMLElement) => void;
}
```

Behavior:
- When `isEditable` and clicked: call `onSelect` with key ID and DOM element ref
- When `isSelected`: apply selection styles (accent border, glow)
- Cursor is `pointer` when editable

**Selection styles**:

```typescript
${({ $isSelected, $layerAccent }) =>
  $isSelected &&
  css`
    box-shadow:
      inset 0 0 0 2px ${$layerAccent || 'rgba(100, 180, 160, 0.9)'},
      0 0 16px ${$layerAccent || 'rgba(100, 180, 160, 0.4)'},
      0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 10;
  `}

${({ $isEditable }) =>
  $isEditable &&
  css`
    cursor: pointer;
  `}
```

### Step 3: Create KeyPopover Component

**File**: `src/components/KeyPopover.tsx` (new)

The inline editing popover built with Base UI's Popover component.

**Props**:

```typescript
interface KeyPopoverProps {
  keyId: string;
  keyRect: DOMRect;
  currentMapping: KeyMapping | null;
  layer: LayerType;
  layerAccent: string;
  onSave: (mapping: KeyMapping) => void;
  onDelete: () => void;
  onClose: () => void;
}
```

**Structure using Base UI**:

```typescript
import { Popover } from '@base-ui/react/popover';
import styled from 'styled-components';

function KeyPopover({
  keyId,
  keyRect,
  currentMapping,
  layer,
  layerAccent,
  onSave,
  onDelete,
  onClose,
}: KeyPopoverProps) {
  const [action, setAction] = useState(currentMapping?.action ?? '');
  const [appName, setAppName] = useState(currentMapping?.appName ?? '');

  const handleSave = () => {
    if (!action.trim()) return;
    onSave({
      keyId,
      action: action.trim(),
      appName: appName || undefined,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
  };

  // Virtual element for anchoring to the key
  const virtualAnchor = useMemo(() => ({
    getBoundingClientRect: () => keyRect,
  }), [keyRect]);

  return (
    <Popover.Root open onOpenChange={(open) => !open && onClose()}>
      <Popover.Anchor virtualElement={virtualAnchor} />

      <Popover.Portal>
        <StyledBackdrop />
        <Popover.Positioner side="right" sideOffset={12} align="center">
          <StyledPopup $accent={layerAccent}>
            <StyledArrow $accent={layerAccent} />

            <FormGroup>
              <StyledInput
                value={action}
                onChange={(e) => setAction(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Action name"
                autoFocus
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>App</FormLabel>
              <AppCombobox
                value={appName}
                onChange={setAppName}
                layerAccent={layerAccent}
              />
            </FormGroup>

            <ButtonRow>
              {currentMapping && (
                <DeleteButton onClick={onDelete}>Delete</DeleteButton>
              )}
              <SaveButton
                onClick={handleSave}
                disabled={!action.trim()}
                $accent={layerAccent}
              >
                Save
              </SaveButton>
            </ButtonRow>
          </StyledPopup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}

// Styled components
const StyledBackdrop = styled(Popover.Backdrop)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.2);
  z-index: 99;
`;

const StyledPopup = styled(Popover.Popup)<{ $accent: string }>`
  background: rgba(28, 28, 32, 0.95);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 16px;
  min-width: 240px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), 0 2px 8px rgba(0, 0, 0, 0.2);
  z-index: 100;

  --layer-accent: ${({ $accent }) => $accent};

  &[data-open] {
    animation: popoverIn 0.15s ease-out;
  }

  @keyframes popoverIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

const StyledArrow = styled(Popover.Arrow)<{ $accent: string }>`
  width: 12px;
  height: 12px;
  background: rgba(28, 28, 32, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transform: rotate(45deg);
`;
```

Base UI handles:
- Click outside to close (via `onOpenChange`)
- Escape key to close
- Viewport collision detection (flips to left if right has no space)
- Arrow positioning
- Focus management

### Step 4: Create AppCombobox Component

**File**: `src/components/AppCombobox.tsx` (new)

A searchable dropdown for selecting apps from the icon manifest, built with Base UI's Combobox.

**Features**:
- Text input that filters as you type
- Dropdown shows matching apps with their icons
- Full keyboard navigation (arrow keys, enter, escape)
- Can also type a custom value (won't have icon but works)

**Implementation with Base UI**:

```typescript
import { Combobox } from '@base-ui/react/combobox';
import styled from 'styled-components';
import { iconManifest, getIconPath } from '../data/icon-manifest';

const apps = Object.keys(iconManifest);

interface AppComboboxProps {
  value: string;
  onChange: (value: string) => void;
  layerAccent: string;
}

export function AppCombobox({ value, onChange, layerAccent }: AppComboboxProps) {
  return (
    <ComboboxRoot
      value={value || null}
      onValueChange={(val) => onChange(val ?? '')}
      items={apps}
      $accent={layerAccent}
    >
      <StyledComboboxInput placeholder="Search apps..." />

      <Combobox.Portal>
        <Combobox.Positioner sideOffset={4}>
          <StyledComboboxPopup>
            {apps.map((app) => (
              <StyledComboboxItem key={app} value={app}>
                <AppIcon src={getIconPath(app) ?? ''} alt="" />
                <AppName>{app}</AppName>
              </StyledComboboxItem>
            ))}
          </StyledComboboxPopup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </ComboboxRoot>
  );
}

const ComboboxRoot = styled(Combobox.Root)<{ $accent: string }>`
  --layer-accent: ${({ $accent }) => $accent};
  position: relative;
`;

const StyledComboboxInput = styled(Combobox.Input)`
  width: 100%;
  height: 36px;
  padding: 0 12px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 6px;
  color: white;
  font-family: 'Instrument Sans', sans-serif;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: var(--layer-accent);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }
`;

const StyledComboboxPopup = styled(Combobox.Popup)`
  background: rgba(28, 28, 32, 0.98);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 4px;
  max-height: 200px;
  overflow-y: auto;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  z-index: 200;
`;

const StyledComboboxItem = styled(Combobox.Item)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 4px;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.9);
  font-family: 'Instrument Sans', sans-serif;
  font-size: 13px;

  &[data-highlighted] {
    background: rgba(255, 255, 255, 0.1);
  }

  &[data-selected] {
    background: var(--layer-accent);
  }
`;

const AppIcon = styled.img`
  width: 20px;
  height: 20px;
  border-radius: 4px;
  object-fit: contain;
`;

const AppName = styled.span`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
```

Base UI Combobox handles:
- Filtering items as user types
- Arrow key navigation through options
- Enter to select, Escape to close
- Proper ARIA attributes for accessibility
- Focus management between input and list

### Step 5: Update Keyboard Component

**File**: `src/components/Keyboard.tsx` (modify)

Pass editing props to keys:

```typescript
interface KeyboardProps {
  // ... existing
}

export function Keyboard({ layout, currentLayer, ... }: KeyboardProps) {
  const { selectedKeyId, selectKey, clearSelection, ... } = useMappingContext();

  const isEditable = currentLayer !== 'base';

  const handleKeySelect = (keyId: string, element: HTMLElement) => {
    if (isEditable) {
      selectKey(keyId, element);
    }
  };

  return (
    <KeyboardFrame>
      {/* ... render keys with new props */}
      <Key
        // ... existing props
        isEditable={isEditable}
        isSelected={selectedKeyId === key.id}
        onSelect={handleKeySelect}
      />
    </KeyboardFrame>
  );
}
```

### Step 6: Add Popover to Frontend

**File**: `src/frontend.tsx` (modify)

Render the popover when a key is selected:

```typescript
function AppContent() {
  const { currentLayer, currentLayerConfig } = useLayerContext();
  const { selectedKeyId, selectedKeyRect, clearSelection, getMappingForKey, updateMapping, deleteMapping } = useMappingContext();

  const currentMapping = selectedKeyId ? getMappingForKey(selectedKeyId, currentLayer) : null;

  const handleSave = (mapping: KeyMapping) => {
    updateMapping(currentLayer, mapping);
    clearSelection();
  };

  const handleDelete = () => {
    if (selectedKeyId) {
      deleteMapping(currentLayer, selectedKeyId);
      clearSelection();
    }
  };

  return (
    <>
      <LayerIndicator />
      <Keyboard ... />

      {selectedKeyId && selectedKeyRect && currentLayer !== 'base' && (
        <KeyPopover
          keyId={selectedKeyId}
          keyRect={selectedKeyRect}
          currentMapping={currentMapping}
          layer={currentLayer}
          layerAccent={currentLayerConfig.accentColor}
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={clearSelection}
        />
      )}

      <KeyboardTitle>...</KeyboardTitle>
    </>
  );
}
```

### Step 7: Handle Layer Switching

When layer changes while popover is open:
- Close the popover (clear selection)
- This happens automatically if we clear selection in layer change handler

**File**: `src/context/MappingContext.tsx` or `src/frontend.tsx`

```typescript
// In AppContent or via useEffect
useEffect(() => {
  // Clear selection when layer changes
  clearSelection();
}, [currentLayer, clearSelection]);
```

### Step 8: Add Backdrop Dim

When popover is open, slightly dim the rest of the UI to focus attention.

**File**: `src/components/KeyPopover.tsx` or `src/frontend.tsx`

```typescript
// Render a backdrop behind the popover
{selectedKeyId && (
  <>
    <PopoverBackdrop onClick={clearSelection} />
    <KeyPopover ... />
  </>
)}
```

Backdrop styles:
```typescript
const PopoverBackdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.2);
  z-index: 99;
`;
```

---

## Visual Design

### Popover Appearance

The popover should feel like a natural extension of the keyboard UI:

- **Background**: Frosted glass (dark, ~95% opacity, backdrop blur)
- **Border**: Subtle 1px with low opacity
- **Border radius**: 12px
- **Shadow**: Soft, layered shadow for depth
- **Arrow/stem**: Points to the key being edited

### Colors

```css
--popover-bg: rgba(28, 28, 32, 0.95);
--popover-border: rgba(255, 255, 255, 0.1);
--popover-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), 0 2px 8px rgba(0, 0, 0, 0.2);
--input-bg: rgba(255, 255, 255, 0.08);
--input-border: rgba(255, 255, 255, 0.12);
--input-focus: var(--layer-accent);
```

### Form Elements

**Text input**:
- Height: 36px
- Background: subtle dark
- Border: 1px solid, low opacity white
- Focus: accent-colored border
- Border radius: 6px
- Font: Instrument Sans, 14px

**Combobox dropdown**:
- Max height: 200px (scrollable)
- Each option: 36px height, icon + text
- Hover: subtle background highlight
- Selected: accent background

**Buttons**:
- Height: 32px
- Border radius: 6px
- Save: layer accent background, white text
- Delete: transparent with subtle red text/icon

### Popover Arrow

A small triangle connecting the popover to the key:

```css
.popover-arrow {
  position: absolute;
  width: 12px;
  height: 12px;
  background: var(--popover-bg);
  transform: rotate(45deg);
  border: 1px solid var(--popover-border);
  /* Position varies based on placement */
}
```

### Selection State

When a key is selected:
- Accent-colored inset border (2px)
- Subtle outer glow matching accent
- Elevated z-index so it appears above siblings

---

## Keyboard Shortcuts

| Key | Action | Context |
|-----|--------|---------|
| Escape | Close popover, cancel edit | Popover open |
| Enter | Save mapping | Popover open, action not empty |
| Tab | Navigate form fields | Popover open |

Note: Regular keyboard shortcuts (Tab for layer switching) are disabled while popover is open to prevent conflicts.

### Disabling Background Shortcuts

While popover is open:
- Tab should navigate form, not switch layers
- Other key presses should not trigger ripples or actions

**File**: `src/hooks/useKeyboardListener.ts` (modify)

Accept a `disabled` prop or check context:

```typescript
function useKeyboardListener({ onKeyPress, onLayerCycle, disabled }: Options) {
  useEffect(() => {
    if (disabled) return;

    function handleKeyDown(event: KeyboardEvent) {
      // ... existing logic
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onKeyPress, onLayerCycle, disabled]);
}
```

In `AppContent`:
```typescript
const isEditing = selectedKeyId !== null;

useKeyboardListener({
  onKeyPress: handleKeyPress,
  onLayerCycle: cycleLayer,
  disabled: isEditing,
});
```

---

## Edge Cases

### Click on Same Key

If user clicks the already-selected key:
- Keep popover open (don't toggle)
- This prevents accidental close

### Click on Different Key

If user clicks a different key while popover is open:
- Close current popover
- Open popover for newly clicked key
- Discard unsaved changes (no warning needed for such a simple form)

### Empty Action Name

- Save button is disabled when action is empty/whitespace
- Visual feedback (grayed out, or subtle error state on input)

### App Not in Manifest

- User can type any text in the app combobox
- If it doesn't match a manifest entry, no icon displays
- The mapping still saves with the appName value

### Window Resize

- Recalculate popover position on window resize
- Or use `position: fixed` with CSS that adapts

### Mobile/Touch

- Popover should work with touch
- Ensure touch targets are at least 44x44px
- Consider full-screen modal on very narrow screens

---

## File Changes Summary

| File | Change Type | Description |
|------|-------------|-------------|
| `package.json` | Modify | Add `@base-ui/react` dependency |
| `src/styles/GlobalStyles.ts` | Modify | Add `isolation: isolate` to root for portal stacking |
| `src/context/MappingContext.tsx` | Modify | Add selection state (selectedKeyId, selectedKeyRect, selectKey, clearSelection) |
| `src/components/Key.tsx` | Modify | Add isEditable, isSelected props; selection styles; click handler |
| `src/components/KeyPopover.tsx` | New | Base UI Popover with edit form |
| `src/components/AppCombobox.tsx` | New | Base UI Combobox for app selection |
| `src/components/Keyboard.tsx` | Modify | Pass editing props to keys |
| `src/hooks/useKeyboardListener.ts` | Modify | Add disabled prop for when editing |
| `src/frontend.tsx` | Modify | Render popover when key selected, handle save/delete |

---

## Testing Checklist

### Basic Editing

- [ ] Clicking key on Base layer does NOT open popover
- [ ] Clicking key on Hyper layer opens popover
- [ ] Clicking key on Command layer opens popover
- [ ] Selected key has accent highlight
- [ ] Popover appears near clicked key (not off-screen)
- [ ] Popover arrow points to the key

### Popover Form

- [ ] Action input is focused on open
- [ ] Existing mapping pre-populates form
- [ ] Empty key shows empty form
- [ ] App combobox shows available apps
- [ ] Typing in combobox filters results
- [ ] Selecting app from dropdown updates value
- [ ] Delete button only shows for existing mappings

### Save/Cancel/Delete

- [ ] Enter key saves (when action not empty)
- [ ] Escape key closes without saving
- [ ] Click outside closes without saving
- [ ] Save button saves and closes
- [ ] Delete button removes mapping and closes
- [ ] Saved changes persist after refresh

### Edge Cases

- [ ] Clicking different key switches to that key's popover
- [ ] Layer switch closes popover
- [ ] Empty action cannot be saved (button disabled or validation)
- [ ] Popover repositions correctly for edge keys
- [ ] Tab/layer shortcuts disabled while popover open

### Visual

- [ ] Popover matches existing design aesthetic
- [ ] Animations are smooth (open/close)
- [ ] Backdrop dims background appropriately
- [ ] Works on different screen sizes
