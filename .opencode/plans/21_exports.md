# Spec 21: Export Feature Implementation Plan

## Overview
Replace the Copy button with an Export dropdown that has two options:
1. **Copy as Markdown** - Existing functionality
2. **Save as Images** - New feature that saves hyper and command layers as PNGs

## User Preferences (from interview)
- Dropdown positioning: Context-aware (upward on mobile, downward on desktop)
- Download feedback: Auto-download silently
- Capture delay: 50ms timeout after layer switch
- Filenames: Use 'mac-keyboard-hyper.png' and 'mac-keyboard-command.png'

## Implementation Steps

### 1. Install Dependency
- Add `html-to-image` package for DOM-to-PNG conversion
- Already completed ✓

### 2. Update Keyboard Component
- Add forwardRef to expose DOM element for capture
- Forward ref to KeyboardFrame styled-component

### 3. Update frontend.tsx
- Create ref in AppContent: `const keyboardRef = useRef<HTMLDivElement>(null)`
- Pass ref to Keyboard component
- Pass ref to ActionBar for capture access

### 4. Update icons.tsx
- Add DownloadIcon for the dropdown menu

### 5. Update ActionBar.tsx
- Replace Copy button with Export dropdown using @base-ui-components/react/menu
- Menu styling to match existing UI theme
- Position dropdown based on viewport (upward on mobile, downward on desktop)
- Keep success checkmark animation for Copy option
- Implement image export logic with layer switching

### 6. Implementation Details

**Layer Switching Approach:**
1. Store current layer before starting
2. Switch to "hyper" layer → wait 50ms → capture → download as "mac-keyboard-hyper.png"
3. Switch to "command" layer → wait 50ms → capture → download as "mac-keyboard-command.png"
4. Restore original layer

**Menu Styling:**
- Use `theme.surface.popover` background with blur
- Items use `theme.text.tertiary` color, hover with `theme.border.light`
- Separator between Copy and Save options
- Same border radius (12px) and shadow as KeyPopover

**Test IDs:**
- `data-testid="export-button"` on menu trigger
- `data-testid="export-copy-option"` for Copy option
- `data-testid="export-images-option"` for Save Images option

## Files to Modify
1. `package.json` - Add html-to-image (done)
2. `src/components/Keyboard.tsx` - Add forwardRef
3. `src/frontend.tsx` - Create and pass keyboard ref
4. `src/components/icons.tsx` - Add DownloadIcon
5. `src/components/ActionBar.tsx` - Replace Copy with Export dropdown

## Status
- [x] Install html-to-image dependency
- [ ] Add forwardRef to Keyboard component
- [ ] Create and pass keyboard ref in frontend.tsx
- [ ] Add DownloadIcon to icons.tsx
- [ ] Replace Copy button with Export dropdown
- [ ] Implement image export logic
- [ ] Run code quality checks
