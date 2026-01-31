# Human

Right now there's just a copy button in the action bar that copies the mappings as Markdown. Let's update that to an export dropdown. We may need to bring in another base UI component like we did with the popover and the combobox for this, so please look into that as well. The dropdown should have two options: copy as MD, which is the current functionality, and save image or save images, which saves the hyper and command layers as separate images and downloads them to the device. Those images should be faithful representations of what's rendered in the keyboard on the webpage.

---

# Agent

## Implementation Plan

### 1. Install Dependency

Add `html-to-image` package for DOM-to-image conversion. This is a modern, lightweight alternative to html2canvas that works well with styled-components and produces high-quality PNGs.

```bash
bun install html-to-image
```

### 2. Add Export Dropdown to ActionBar

Replace the current Copy button with an Export dropdown using `@base-ui-components/react/menu` (following the Dialog pattern already in use). The dropdown trigger will show "Export" with a dropdown icon, and the menu will contain:

- "Copy as Markdown" - existing functionality
- "Save as Images" - new functionality

**Key implementation details:**

- Import `Menu` from `@base-ui-components/react/menu`
- Style Menu.Trigger, Menu.Positioner, Menu.Popup, and Menu.Item using styled-components to match the existing theme
- Position the dropdown above the trigger (since the ActionBar is at the bottom on mobile)
- Keep the success state animation for the "Copy as Markdown" option (checkmark briefly appears)

### 3. Create Image Export Logic

The image export needs to capture the keyboard in both hyper and command layers. Since the Keyboard component reads the current layer from context, we'll need to:

**Approach: Temporary Layer Switching**

1. Store the current layer before starting
2. Switch to "hyper" layer → wait for render → capture → download as "mac-keyboard-hyper.png"
3. Switch to "command" layer → wait for render → capture → download as "mac-keyboard-command.png"
4. Restore the original layer

**Technical implementation:**

- Add a `ref` to the KeyboardFrame component so we can capture it
- Use `toPng()` from html-to-image with options to ensure quality:
  - `backgroundColor: null` (to preserve transparency if needed, or set to match the page background)
  - `pixelRatio: 2` for retina-quality images
  - `cacheBust: true` to avoid caching issues
- Use a small delay (requestAnimationFrame or 50ms timeout) after layer switch to ensure the keyboard has fully rendered with the new layer styling before capturing

### 4. Update Keyboard Component

**Changes to Keyboard.tsx:**

- Wrap the component with `React.forwardRef` to accept a ref
- Forward the ref to the KeyboardFrame styled-component
- Ensure the ref can access the DOM element for html-to-image to capture

### 5. Update frontend.tsx

**Changes:**

- Create a ref in AppContent: `const keyboardRef = useRef<HTMLDivElement>(null)`
- Pass the ref to the Keyboard component: `<Keyboard ref={keyboardRef} ... />`
- Pass the ref to ActionBar so it can access the keyboard for capture: `<ActionBar keyboardRef={keyboardRef} />`

### 6. Export Flow Details

**Copy as Markdown flow (unchanged):**

- Call `generateMappingsMarkdown()` with current mappings
- Write to clipboard with `navigator.clipboard.writeText()`
- Show checkmark icon for 1.5 seconds

**Save as Images flow:**

1. Capture original layer state
2. Set layer to "hyper" → await render → call `toPng(keyboardRef.current, options)` → trigger download via anchor tag
3. Set layer to "command" → await render → capture → trigger download
4. Restore original layer

**Download helper:**
Create a utility function that takes a data URL and filename, creates a temporary anchor element with `download` attribute, triggers click, then cleans up.

### 7. Styling Considerations

- The Menu components should match existing UI:
  - Popup: Use `theme.surface.popover` background with blur
  - Items: Use `theme.text.tertiary` color, hover state with `theme.border.light`
  - Separator between Copy and Save options
  - Same border radius (12px) and shadow as KeyPopover
- On mobile (bottom-positioned ActionBar), ensure the dropdown opens upward to avoid going off-screen

### 8. Testing Considerations

The E2E tests may need updates since the Copy button becomes a dropdown. The test ID strategy:

- Keep `data-testid="copy-button"` on the menu trigger (renamed to export-button)
- Add `data-testid="export-copy-option"` and `data-testid="export-images-option"` for the menu items

### Summary of Files to Modify

| File                           | Changes                                                          |
| ------------------------------ | ---------------------------------------------------------------- |
| `package.json`                 | Add `html-to-image` dependency                                   |
| `src/components/ActionBar.tsx` | Replace Copy button with Export dropdown, add image export logic |
| `src/components/Keyboard.tsx`  | Add forwardRef to expose DOM element                             |
| `src/frontend.tsx`             | Create and pass keyboard ref to both Keyboard and ActionBar      |

---

# Implementation

## What Was Built

Successfully implemented the Export dropdown feature as specified:

1. **Export Dropdown**: Replaced the single "Copy" button with an Export dropdown menu using `@base-ui-components/react/menu`. The dropdown has a chevron icon and opens upward with a smooth animation.

2. **Two Export Options**:
   - **Copy as Markdown**: Existing functionality preserved - copies mappings as markdown to clipboard with success feedback (checkmark + "Copied!" text for 1.5s)
   - **Save as Images**: New functionality - captures the keyboard in both hyper and command layers as PNG images and downloads them as `mac-keyboard-hyper.png` and `mac-keyboard-command.png`

3. **Image Export Implementation**:
   - Uses `html-to-image` library (already installed) to capture the keyboard DOM element
   - Temporarily switches layers to capture each one, then restores the original layer
   - Uses `pixelRatio: 2` for retina-quality images
   - 300ms delay between downloads to prevent browser throttling
   - 100ms render delay after layer switch to ensure proper styling before capture

4. **UI/UX Details**:
   - Menu styled to match existing theme (popover background with blur, 12px border radius, same shadows as KeyPopover)
   - Menu items have hover states with light border background
   - Separator between Copy and Save options
   - Success state animation preserved for Copy option
   - Dropdown opens upward (side="top") to work well with mobile bottom positioning

5. **Icons Added**:
   - `ChevronDownIcon`: Small down arrow for dropdown indicator
   - `DownloadIcon`: For both the Export trigger and Save as Images option

## Decisions Made

1. **Keyboard already had forwardRef**: The Keyboard component already supported ref forwarding, so no changes were needed there. Only needed to pass the ref from frontend.tsx to ActionBar.

2. **Layer switching approach**: Chose to temporarily switch layers programmatically rather than render hidden keyboards. This is simpler and ensures the captured images match exactly what the user sees.

3. **No visual feedback for Save**: As requested, "Save as Images" starts downloads immediately without visual feedback. The menu closes on selection.

4. **Menu positioning**: Used `sideOffset={8} align="end"` to position the menu above the trigger and aligned to the right edge, which works well for the mobile bottom bar layout.

## Plan Deviations

1. **html-to-image already installed**: The package was already in package.json (added in a previous commit), so no installation step was needed.

2. **Removed backgroundColor option**: The html-to-image type definitions don't accept `null` for `backgroundColor`, so removed that option. The default behavior works fine.

3. **E2E test updated**: The critical-path E2E test needed updating to handle the new dropdown flow - now clicks export-button, then export-copy-option instead of directly clicking copy-button.

## Files Modified

- `src/components/icons.tsx` - Added ChevronDownIcon and DownloadIcon
- `src/components/ActionBar.tsx` - Complete rewrite with Export dropdown and image export logic
- `src/frontend.tsx` - Pass keyboardRef to ActionBar
- `tests/e2e/critical-path.spec.ts` - Updated test to use new dropdown flow

## Testing

- All checks pass (`mise check`)
- Healthcheck passes (`mise healthcheck`)
- E2E tests pass (`mise test:e2e`)
