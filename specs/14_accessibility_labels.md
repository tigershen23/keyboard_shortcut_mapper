# Human

Accessibility labels are really great for having agents work with frontend code. Let's add them tactfully, not overly verbosely, but extremely helpfully and descriptively.

---

# Agent

## Overview

Add `title` attributes throughout the UI to make the interface easily navigable and operable by AI agents. Labels should be concise but descriptive - focusing on what the element does and its current state.

Using `title` because it's a standard HTML attribute that agents naturally parse. The tradeoffs (hover tooltip delay, no touch support, inconsistent screen reader behavior) are acceptable since the primary audience is AI agents.

## Guiding Principles

1. **Action-focused**: Labels describe what clicking/interacting does
2. **State-aware**: Labels reflect current state (selected, active, mapped vs unmapped)
3. **Concise**: Skip obvious context (don't repeat "keyboard" for every key)
4. **Consistent format**: Predictable patterns agents can rely on

## Implementation by Component

### Key.tsx

The main interactive element. Keys have different states based on layer and mapping.

**Base layer keys** - Not interactive for editing, show physical key identity:
```
title="A key"
title="Escape key"
title="Command modifier"
```

**Editable layer keys (hyper/command)** - Show mapping state and interaction hint:
- Unmapped: `title="H key: unmapped, click to assign"`
- Mapped: `title="H key: Arc - New Tab"` (app + action)
- Mapped (command layer, no app): `title="H key: Screenshot"`
- Selected: `title="H key: Arc - New Tab, editing"` (append editing state)

Implementation:
- Add a `getAccessibilityLabel()` function that builds the label based on:
  - `definition.id` / `definition.label` for key identity
  - `currentLayer` for context
  - `mapping?.appName` and `mapping?.action` for mapping info
  - `isEditable` and `isSelected` for state
- Apply `title` to the root `StyledKey` div

### LayerIndicator.tsx

Layer tabs are the primary navigation element.

**Layer tabs**:
- Active: `title="Hyper layer, active, 12 shortcuts"`
- Inactive: `title="Command layer, 8 shortcuts"`

**Page title**: `title="Mac Keyboard Shortcuts heading"`

**Tab container**: `title="Layer selector, 3 layers"`

Implementation:
- Add `title` to each `LayerTab` button with layer name, active state, and count
- Add `title` to `IndicatorTabs` container
- Add `title` to `PageTitle`

### ActionBar.tsx

Action buttons for copy and reset functionality.

**Copy button**:
- Default: `title="Copy mappings to clipboard"`
- Success state: `title="Copied mappings to clipboard"`

**Reset button**: `title="Reset mappings to defaults"`

**Reset dialog** (when open):
- Dialog container: `title="Reset confirmation dialog"`
- Cancel button: `title="Cancel reset"`
- Confirm button: `title="Confirm reset to defaults"`

**Credits link**: `title="Credits link to tigershen.com"`

Implementation:
- Add `title` to `ActionButton` for copy (dynamic based on `copied` state)
- Add `title` to reset trigger button
- Add `title` to dialog elements

### KeyPopover.tsx

The editing form that appears when clicking an editable key.

**Form container**: `title="Edit mapping for H key"`

**Action input**: `title="Action name input, current value: New Tab"`

**App combobox**: `title="App selector, current value: Arc"` (delegate detail to AppCombobox)

**Save button**:
- Enabled: `title="Save mapping"`
- Disabled: `title="Save mapping, disabled - enter action name"`

**Delete button**: `title="Delete mapping"`

Implementation:
- Add `title` to `PopupContainer` with key context
- Add `title` to form inputs with current values
- Add `title` to buttons with state info

### AppCombobox.tsx

Searchable dropdown for selecting apps.

**Input field**: `title="App search, current value: Arc, dropdown open/closed"`

**Dropdown container**: `title="App list, 33 apps, showing 5 filtered"`

**Dropdown items**: `title="Select Arc app"` (each option)

Implementation:
- Add `title` to `StyledInput` with value and open state
- Add `title` to `Dropdown` with count info
- Add `title` to each `DropdownItem`

## Label Format Reference

| Element | Format | Example |
|---------|--------|---------|
| Key (base) | `{label} key` | `A key`, `Escape key` |
| Key (unmapped) | `{label} key: unmapped, click to assign` | `H key: unmapped, click to assign` |
| Key (mapped) | `{label} key: {app} - {action}` | `H key: Arc - New Tab` |
| Key (mapped, no app) | `{label} key: {action}` | `H key: Screenshot` |
| Key (selected) | `{base label}, editing` | `H key: Arc - New Tab, editing` |
| Layer tab | `{name} layer[, active], {n} shortcuts` | `Hyper layer, active, 12 shortcuts` |
| Button | `{action description}` | `Copy mappings to clipboard` |
| Input | `{field name} input, current value: {value}` | `Action name input, current value: New Tab` |

## Files to Modify

1. `src/components/Key.tsx` - Add label generation and apply to StyledKey
2. `src/components/LayerIndicator.tsx` - Add labels to tabs and container
3. `src/components/ActionBar.tsx` - Add labels to buttons and dialog
4. `src/components/KeyPopover.tsx` - Add labels to form elements
5. `src/components/AppCombobox.tsx` - Add labels to input and dropdown

## Testing Approach

After implementation, verify labels by:
1. Inspecting elements in browser DevTools
2. Hovering over elements to see tooltip text
3. Using a simple script to enumerate all `[title]` elements
4. Testing that labels update correctly when state changes (e.g., copying, selecting keys)

---

# Implementation

## What Was Built

Added comprehensive `title` attributes throughout the keyboard shortcut mapper UI to make it navigable by AI agents. Created a new utility file `src/utils/labels.ts` with helper functions for generating consistent accessibility labels.

### New File: `src/utils/labels.ts`

Created utility functions for label generation:
- `getKeyLabel()` - Generates labels for keyboard keys based on layer, mapping state, and selection state
- `getLayerTabLabel()` - Generates labels for layer tabs with active state and shortcut count
- `getLayerSelectorLabel()` - Label for the layer selector container
- `getActionInputLabel()` - Label for action input with current value
- `getSaveButtonLabel()` - Label for save button with disabled state info
- `getAppSearchLabel()` - Label for app search input with open/closed state
- `getAppDropdownLabel()` - Label for dropdown with filter counts
- `getAppOptionLabel()` - Label for individual app options

### Modified Components

1. **Key.tsx**: Added `title` attribute to `StyledKey` using `getKeyLabel()` function. Handles:
   - Base layer keys (e.g., "A key", "Left Command modifier")
   - Unmapped editable keys (e.g., "H key: unmapped, click to assign")
   - Mapped keys (e.g., "H key: Arc - New Tab", "H key: Screenshot")
   - Selected keys (appends ", editing")
   - Distinguishes left/right modifiers

2. **LayerIndicator.tsx**: Added titles to:
   - PageTitle: "Mac Keyboard Shortcuts heading"
   - IndicatorTabs: "Layer selector, 3 layers"
   - LayerTab buttons: "{name} layer[, active], {n} shortcuts" with dynamic shortcut counts

3. **ActionBar.tsx**: Added titles to:
   - CreditsLink: "Credits link to tigershen.com"
   - Copy button: Dynamic ("Copy mappings to clipboard" / "Copied mappings to clipboard")
   - Reset trigger: "Reset mappings to defaults"
   - DialogPopup: "Reset confirmation dialog"
   - Cancel button: "Cancel reset"
   - Confirm button: "Confirm reset to defaults"

4. **KeyPopover.tsx**: Added titles to:
   - PopupContainer: "Edit mapping for {keyId} key"
   - StyledInput: "Action name input, current value: {value}"
   - SaveButton: Dynamic based on disabled state
   - DeleteButton: "Delete mapping"

5. **AppCombobox.tsx**: Added titles to:
   - StyledInput: "App search, current value: {value}, dropdown open/closed"
   - Dropdown: "App list, 33 apps, showing {n} filtered"
   - DropdownItem: "Select {app} app" for each option

## Decisions Made

1. **Left/Right Modifier Distinction**: The spec mentioned distinguishing modifier keys, so I implemented specific labels like "Left Command modifier" vs "Right Command modifier" for the control, option, and command keys.

2. **Dynamic Shortcut Counts**: Layer tabs show real-time counts of mapped shortcuts per layer, calculated from the mappings state in MappingContext.

3. **Label Utility Location**: Created a dedicated `src/utils/labels.ts` file for all label generation functions, keeping them centralized and testable.

4. **State-Aware Labels**: All labels update dynamically based on current state (e.g., copy button changes from "Copy" to "Copied" message, save button indicates when disabled).

5. **Consistent Pattern**: Followed the spec's format patterns throughout - "{element}: {state}, {action}" for interactive elements, simple identity for static elements.

## Plan Deviations

- None significant. The implementation follows the spec closely, with the addition of left/right modifier distinction which was a clarification requested during the interview phase.

## Files Changed

- `src/utils/labels.ts` (new)
- `src/components/Key.tsx`
- `src/components/LayerIndicator.tsx`
- `src/components/ActionBar.tsx`
- `src/components/KeyPopover.tsx`
- `src/components/AppCombobox.tsx`
