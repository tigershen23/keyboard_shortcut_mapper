# Human

styled-components theme docs:

Theming
styled-components has full theming support by exporting a <ThemeProvider> wrapper component. This component provides a theme to all React components underneath itself via the context API. In the render tree all styled-components will have access to the provided theme, even when they are multiple levels deep.

Note
React Server Components (v6.3.0+): ThemeProvider is a no-op in RSC environments since React context is unavailable. Use CSS custom properties for theming in RSC instead. See the RSC section for best practices.

To illustrate this, let's create our Button component, but this time we'll pass some variables down as a theme.

// Define our button, but with the use of props.theme this time
const Button = styled.button`
font-size: 1em;
margin: 1em;
padding: 0.25em 1em;
border-radius: 3px;

/_ Color the border and text with theme.main _/
color: ${props => props.theme.main};
border: 2px solid ${props => props.theme.main};
`;

// We are passing a default theme for Buttons that arent wrapped in the ThemeProvider
Button.defaultProps = {
theme: {
main: "#BF4F74"
}
}

// Define what props.theme will look like
const theme = {
main: "mediumseagreen"
};

render(

  <div>
    <Button>Normal</Button>

    <ThemeProvider theme={theme}>
      <Button>Themed</Button>
    </ThemeProvider>

  </div>
);
// Define our button, but with the use of props.theme this time
const Button = styled.button`
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border-radius: 3px;

/_ Color the border and text with theme.main _/
color: ${props => props.theme.main};
border: 2px solid ${props => props.theme.main};
`;

// We are passing a default theme for Buttons that arent wrapped in the ThemeProvider
Button.defaultProps = {
theme: {
main: "#BF4F74"
}
}

// Define what props.theme will look like
const theme = {
main: "mediumseagreen"
};

render(

  <div>
    <Button>Normal</Button>

    <ThemeProvider theme={theme}>
      <Button>Themed</Button>
    </ThemeProvider>

  </div>
);
NormalThemed
Function themes
You can also pass a function for the theme prop. This function will receive the parent theme, that is from another <ThemeProvider> higher up the tree. This way themes themselves can be made contextual.

This example renders our above themed Button and a second one that uses a second ThemeProvider to invert the background and foreground colors. The function invertTheme receives the upper theme and creates a new one.

// Define our button, but with the use of props.theme this time
const Button = styled.button`
color: ${props => props.theme.fg};
border: 2px solid ${props => props.theme.fg};
background: ${props => props.theme.bg};

font-size: 1em;
margin: 1em;
padding: 0.25em 1em;
border-radius: 3px;
`;

// Define our `fg` and `bg` on the theme
const theme = {
fg: "#BF4F74",
bg: "white"
};

// This theme swaps `fg` and `bg`
const invertTheme = ({ fg, bg }) => ({
fg: bg,
bg: fg
});

render(
<ThemeProvider theme={theme}>
<div>
<Button>Default Theme</Button>

      <ThemeProvider theme={invertTheme}>
        <Button>Inverted Theme</Button>
      </ThemeProvider>
    </div>

  </ThemeProvider>
);

Please update our codebase to use styled-components for theming rather than having magic strings in the codebase.

---

# Agent

## Overview

Replace hardcoded color values throughout the codebase with a centralized styled-components ThemeProvider. The theme will use semantic tokens organized by purpose, and layer-specific colors will move from LayerContext into the theme structure.

## Theme Structure

Create a single theme object with the following semantic token categories:

**Surface tokens** - backgrounds for different UI elements:
- `surface.page` - main page background (#231418)
- `surface.key` - key background gradient colors
- `surface.keyFunction` - function row key variant
- `surface.keySpace` - space bar variant
- `surface.keyHover` - hover state gradient
- `surface.keyActive` - pressed state gradient
- `surface.keyDimmed` - dimmed/unmapped key state
- `surface.popover` - popover/dropdown backgrounds
- `surface.dialog` - modal dialog background
- `surface.frame` - keyboard aluminum frame gradient

**Text tokens** - text colors at various opacities:
- `text.primary` - full brightness white (#ffffff)
- `text.secondary` - 90% opacity
- `text.tertiary` - 85% opacity
- `text.muted` - 60% opacity
- `text.dimmed` - 40% opacity
- `text.hint` - 25% opacity

**Border tokens** - border colors at various opacities:
- `border.subtle` - very subtle (5%)
- `border.light` - light borders (10%)
- `border.medium` - medium borders (20%)
- `border.focus` - focus states (35%)

**Shadow tokens** - box-shadow colors:
- `shadow.light` - subtle shadows (20% black)
- `shadow.medium` - medium shadows (30% black)
- `shadow.heavy` - deep shadows (50% black)
- `shadow.backdrop` - modal backdrops (60% black)

**Semantic/status tokens:**
- `semantic.danger` - delete/danger red
- `semantic.success` - success green

**Layer tokens** - per-layer accent colors:
- `layers.base.accent` - base layer accent
- `layers.base.ripple` - base layer ripple
- `layers.base.glow` - base layer glow (null for base)
- `layers.hyper.accent` - hyper layer teal
- `layers.hyper.ripple` - hyper layer ripple
- `layers.hyper.glow` - hyper layer glow
- `layers.command.accent` - command layer warm tone
- `layers.command.ripple` - command layer ripple
- `layers.command.glow` - command layer glow

**Background mesh tokens** - animated gradient colors:
- `mesh.primary` - array of radial gradient specs for ::before
- `mesh.secondary` - array of radial gradient specs for ::after
- `mesh.baseGradient` - the base linear gradient

## File Changes

### New files

**`src/styles/theme.ts`**

Define the theme type interface and the default dark theme object. Export both the theme object and its TypeScript type for use with styled-components.

The interface will mirror the token structure above. Each gradient (like key backgrounds) will be stored as an object with `start` and `end` colors rather than the full CSS string, allowing components to construct gradients consistently.

### Modified files

**`src/types/index.ts`**

Remove `accentColor` and `rippleColor` from the `LayerConfig` interface since layer colors now live in the theme. The LayerConfig will just contain `id`, `label`, and `shortLabel`.

**`src/frontend.tsx`**

Wrap the app with styled-components `ThemeProvider` at the root level, inside the existing providers. Import the theme from `src/styles/theme.ts` and pass it to ThemeProvider.

The provider hierarchy becomes:
```
GlobalStyles
└─ ThemeProvider (new)
   └─ LayerProvider
      └─ MappingProvider
         └─ AppContent
```

**`src/context/LayerContext.tsx`**

Remove the hardcoded `accentColor` and `rippleColor` from LAYERS. The context will no longer provide these values directly - components will access them from the theme using the current layer ID.

Update the `LayerContextValue` interface to remove `currentLayerConfig` or simplify it to not include color values.

**`src/styles/GlobalStyles.ts`**

Replace all hardcoded colors with theme token references using `${({ theme }) => theme.surface.page}` syntax. The mesh gradient colors will come from theme tokens.

Since GlobalStyles uses createGlobalStyle, it will automatically have access to the theme via the ThemeProvider ancestor. Each hardcoded hex or rgba value gets replaced with the corresponding semantic token.

**`src/components/Key.tsx`**

This file has the most hardcoded values. Replace:
- Key background gradients → `theme.surface.key.start/end`
- Hover/active state gradients → `theme.surface.keyHover/keyActive`
- Function and space key variants → corresponding surface tokens
- Border colors → `theme.border.*`
- Text colors → `theme.text.*`
- Shadow colors → `theme.shadow.*`

The layer-specific `$layerAccent` and `$rippleColor` props will be replaced by accessing `theme.layers[layerId].accent` where layerId comes from context or props.

**`src/components/Keyboard.tsx`**

Replace the hardcoded frame gradient colors with `theme.surface.frame`. Replace the layer glow colors with `theme.layers[layer].glow`.

**`src/components/KeyPopover.tsx`**

Replace popover background, border, and text colors with theme tokens. The delete button color becomes `theme.semantic.danger`.

**`src/components/ActionBar.tsx`**

Replace dialog background, backdrop, button colors, and copy success color with appropriate theme tokens.

**`src/components/AppCombobox.tsx`**

Replace dropdown background, border, focus, and highlight colors with theme tokens.

**`src/components/LayerIndicator.tsx`**

Replace any hardcoded colors with theme tokens. The layer accent colors for the indicator come from `theme.layers[layerId].accent`.

## Implementation Approach

### Phase 1: Foundation

1. Create `src/styles/theme.ts` with the theme type and default theme object
2. Add styled-components type augmentation in a declaration file so `theme` is typed in all styled-components
3. Wrap the app with ThemeProvider in `frontend.tsx`

### Phase 2: Global Styles

4. Update GlobalStyles to consume theme tokens for page background and mesh gradients
5. Verify the app still renders correctly

### Phase 3: Layer Integration

6. Remove color values from LayerContext's LAYERS array
7. Update components to get layer colors from theme instead of props
8. This may require a custom hook like `useLayerTheme(layerId)` that extracts the relevant layer colors from theme

### Phase 4: Component Migration

Migrate components one at a time, verifying visual parity after each:

8. Key.tsx (largest, most complex)
9. Keyboard.tsx
10. KeyPopover.tsx
11. ActionBar.tsx
12. AppCombobox.tsx
13. LayerIndicator.tsx

### Phase 5: Cleanup

14. Remove any now-unused color props being passed through component trees
15. Verify all hardcoded color values are gone (search for `#`, `rgba(`, `rgb(`)
16. Run the app and verify visual parity

## TypeScript Considerations

To get proper typing for `props.theme` in styled-components, add a declaration file `src/styles/styled.d.ts`:

```typescript
import 'styled-components';
import type { Theme } from './theme';

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}
```

This ensures all styled-components automatically know the theme shape.

## Testing Strategy

Since this is purely a refactor with no functional changes, verification is visual:
- Compare screenshots before/after
- Cycle through all three layers
- Open popovers and dialogs
- Verify hover/active states on keys
- Check the animated background still animates

## Notes

- The ripple color for each layer has a slightly different opacity than the accent - these are stored as separate values in `theme.layers[id].ripple`
- Gradients are stored as `{ start, end }` objects and constructed in the styled-component using template literals
- The mesh background uses multiple radial gradients - these can be stored as arrays of specs and joined in GlobalStyles
- No breaking API changes - this is internal restructuring only

---

# Implementation

## Summary

Replaced all hardcoded color values throughout the codebase with a centralized styled-components ThemeProvider. The theme uses semantic tokens organized by purpose (surface, text, border, shadow, semantic, layers, mesh).

## Files Created

- `src/styles/theme.ts` - Theme type interface and default dark theme object with all semantic tokens
- `src/types/styled.d.ts` - TypeScript declaration to augment DefaultTheme for proper typing

## Files Modified

- `src/frontend.tsx` - Wrapped app with ThemeProvider, updated to get layer colors from theme via `useTheme()`
- `src/styles/GlobalStyles.ts` - Replaced hardcoded page background and mesh gradient colors with theme tokens
- `src/types/index.ts` - Removed `accentColor` and `rippleColor` from LayerConfig interface
- `src/context/LayerContext.tsx` - Removed color values from LAYERS array (colors now live in theme)
- `src/components/Key.tsx` - Replaced all key background gradients, text colors, borders, shadows with theme tokens
- `src/components/Keyboard.tsx` - Replaced frame gradient and layer glow colors with theme tokens
- `src/components/KeyPopover.tsx` - Replaced popover background, borders, text, button colors with theme tokens
- `src/components/ActionBar.tsx` - Replaced dialog and button colors with theme tokens
- `src/components/AppCombobox.tsx` - Replaced dropdown colors with theme tokens
- `src/components/LayerIndicator.tsx` - Replaced indicator colors with theme tokens, uses `useTheme()` to get layer accent colors

## Decisions Made

- **Gradient directions kept in components**: As discussed, gradient angles (e.g., `180deg`) are structural and remain hardcoded in components while colors come from theme
- **Structural effects kept hardcoded**: Some rgba values for glass effects (`rgba(0,0,0,0.25)` for backdrop blur backgrounds) and aluminum frame warm glows remain hardcoded as they are fixed UI effects not meant to be themed
- **No `useLayerTheme` hook**: Components access `theme.layers[currentLayer]` directly via `useTheme()` instead of a dedicated hook
- **Type declaration in `src/types/`**: Placed `styled.d.ts` in types directory to keep all type definitions together

## Theme Structure

The theme object has the following categories:
- `surface` - Backgrounds for keys (with variants for function, space, hover, active, dimmed), popover, dialog, frame
- `text` - Primary through hint opacity levels
- `border` - Subtle to focus opacity levels
- `shadow` - Light to backdrop opacity levels
- `semantic` - Danger and success colors
- `layers` - Per-layer accent, ripple, and glow colors (base, hyper, command)
- `mesh` - Animated background gradient specs

## Verification

- Build succeeds with no TypeScript errors
- All semantic tokens properly typed via DefaultTheme augmentation
- No functional changes - purely internal restructuring
