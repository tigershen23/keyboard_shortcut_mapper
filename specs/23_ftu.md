# Human

I'd like to add a basic first-time user experience or some help text when someone lands on the page, maybe just once, maybe something persistent, basically explaining the application and what can be done with it. Something like a guided tutorial feels a bit too heavy, but I'm not exactly sure what I want to go for here. So let's explore some options. Some persistent text, like maybe a tooltip on hover with an info icon by the title, although that is really overdone, could be helpful. Or maybe some persistent subtitle between the title and the layer switcher. So anyway, give some ideas for both the content and more importantly, the UX and form factor of the first-time user experience.

---

# Agent

## Overview

Add a collapsible info panel below the title and above the layer tabs that explains what the app does. It will be expanded by default on first visit, collapsed state persisted to localStorage.

## UX Design

### Form Factor: Collapsible Info Panel

A subtle glass-effect container that sits between the title and layer tabs:

```
Mac Keyboard Shortcuts
┌────────────────────────────────────────────┐
│ ▾  Map your keyboard shortcuts visually    │
│                                            │
│    Click any key to assign an app or       │
│    action. Use Hyper (⌃⌥⌘) for app        │
│    launching, Command layer for actions.   │
│    Learn more →                            │
└────────────────────────────────────────────┘
Layer → [Base] [Hyper] [Command]
```

When collapsed:

```
Mac Keyboard Shortcuts
┌──────────────────────────┐
│ ▸  Usage  │
└──────────────────────────┘
Layer → [Base] [Hyper] [Command]
```

### Design Rationale

1. **Placement**: Below title, above tabs follows natural reading flow - user sees title, gets context, then interacts
2. **Collapsible**: Power users can dismiss it permanently; new users see it once
3. **Glass effect**: Matches existing `backdrop-filter: blur()` aesthetic used in LayerIndicator tabs and ActionBar
4. **Expand/collapse toggle**: Chevron icon on the left; clicking header row toggles state
5. **Minimal footprint when collapsed**: Single line with "How to use" label

### Content Strategy

**Expanded state** (3 short paragraphs, ~40 words total):

1. **Purpose**: "Map your keyboard shortcuts visually for Mac"
2. **Interaction**: "Click any key to assign an app or action"
3. **Layers explained**: Brief note about Hyper (app launching via Raycast) and Command (system actions)
4. **Link**: "Learn more →" linking to Raycast Hyper key docs (https://manual.raycast.com/hyperkey)

**Collapsed state**: Just "How to use this tool" with expand chevron

### Visual Style

- Background: `rgba(0, 0, 0, 0.25)` with `backdrop-filter: blur(12px)` (matches IndicatorTabs)
- Border: `1px solid ${theme.border.light}`
- Border radius: `clamp(10px, 1.2vw, 14px)`
- Text: `${theme.text.muted}` for body, `${theme.text.tertiary}` for header
- Padding: `clamp(10px, 1.2vw, 16px)`
- Max width: Similar to layer tabs width, centered
- Font: Instrument Sans, size `clamp(11px, 1.1vw, 14px)`

### Animation

- Expand/collapse: CSS transition on `max-height` and `opacity` (~200ms ease)
- Initial render: Same `indicatorEnter` animation as other elements (fade in + translateY)

## Implementation

### New Component: `InfoPanel.tsx`

Create `src/components/InfoPanel.tsx` with:

- Styled components for container, header row, content area, and link
- useState for `isExpanded` initialized from localStorage (`ftu-info-expanded` key)
- useEffect to persist expand/collapse state to localStorage
- Chevron icon (can be inline SVG, rotates on expand)
- External link to Raycast docs

### Modify `LayerIndicator.tsx`

Insert `<InfoPanel />` between `<PageTitle>` and `<IndicatorWrapper>`.

### localStorage Schema

Key: `keyboard-mapper-ftu-expanded`
Value: `"true"` | `"false"`
Default (first visit / key missing): `"true"` (expanded)

This integrates with the existing localStorage pattern used by MappingContext and LayerContext.

### Mobile Considerations

On mobile (max-width: 768px), the LayerIndicator is fixed at top. The InfoPanel should:

- Remain part of the fixed header
- Use slightly smaller padding/text
- "Learn more" link should be easily tappable (min 44px touch target)

### Accessibility

- Header row should be a `<button>` for keyboard accessibility
- `aria-expanded` attribute on toggle button
- `aria-controls` pointing to content ID
- External link gets `target="_blank" rel="noopener noreferrer"`

## Files to Create/Modify

| File                                | Action                                           |
| ----------------------------------- | ------------------------------------------------ |
| `src/components/InfoPanel.tsx`      | Create - new component                           |
| `src/components/LayerIndicator.tsx` | Modify - import and render InfoPanel             |
| `src/components/icons/index.ts`     | Possibly add ChevronIcon if not reusing existing |

## Content (Final Copy)

**Header (collapsed)**: "How to use this tool"

**Body (expanded)**:

> Map your Mac keyboard shortcuts visually. Click any key to assign an app or action.
>
> **Hyper layer** (⇧⌃⌥⌘): Launch apps instantly with a single keypress. Requires [Raycast Hyper key](https://manual.raycast.com/hyperkey) setup.
>
> **Command layer**: System actions like clipboard history, sleep, and audio controls.

This covers:

- Overall purpose (visual mapper)
- Interaction model (click keys)
- Both layers explained with practical examples
- Link to Raycast setup for Hyper key

## Open Questions (Resolved)

1. ~~Placement~~ → Below title, above tabs
2. ~~Visual style~~ → Glass effect matching existing UI
3. ~~Persistence~~ → localStorage, expanded by default on first visit
4. ~~Content~~ → Concise, covers purpose + layers + link

---

# Implementation

## Summary

Implemented a collapsible info panel (FTU experience) that sits between the page title and layer tabs.

## Files Modified

| File                                | Change                                                                   |
| ----------------------------------- | ------------------------------------------------------------------------ |
| `src/components/InfoPanel.tsx`      | Created - new component with collapsible panel                           |
| `src/components/LayerIndicator.tsx` | Added InfoPanel import and render between PageTitle and IndicatorWrapper |
| `src/components/icons.tsx`          | Added ChevronIcon for expand/collapse indicator                          |

## Implementation Details

- **ChevronIcon**: Added to existing icons.tsx file (not a new icons folder) following the established pattern with SVGProps
- **localStorage key**: `keyboard-mapper-ftu-expanded` (string "true"/"false")
- **Default state**: Expanded on first visit (when key is missing)
- **Link behavior**: Opens Raycast docs in new tab with `target="_blank" rel="noopener noreferrer"`
- **Expand/collapse**: User can toggle any time; state persists

## Accessibility

- Header row is a `<button>` element for keyboard accessibility
- `aria-expanded` and `aria-controls` attributes properly set
- External link has appropriate rel attributes

## Testing

- TypeScript type check passes
- Linter passes
- E2E tests pass (critical path test)
