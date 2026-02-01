### src/components/ActionBar.tsx:

- [x] ::after
- [ ] Base UI docs: Menu and Dialog: Root Trigger Portal Positioner Popup Backdrop Popup Item ItemIcon etc
- [ ] Uncontrolled vs controlled components
- [ ] What's the benefit of libraries like shadcn/ui and base ui?
- [ ] styled-components vs tailwind
- [ ] gap: clamp(4px, 0.5vw, 6px);
- [ ] Better error handling pattern for this?

```typescript
try {
  await navigator.clipboard.writeText(markdown);
  setCopied(true);
  setMenuOpen(false);
  setTimeout(() => setCopied(false), 1500);
} catch {
  console.error("Failed to copy to clipboard");
}
```

### src/components/AppCombobox.tsx:

- [ ] Can be replaced by base ui combobox? Try and have a parallel implementation and make sure it works
- [ ] &::placeholder
- [ ] object-fit
- [ ] Base UI is completely unstyled, vs Radix/shadcn which are styled by default

Base UI ships:

- behavior
- state management
- accessibility (ARIA, focus, keyboard)
- structural components

It does not ship:

- colors
- spacing
- typography
- tokens
- CSS variables
- a theme provider

### src/components/icons.tsx:

- [ ] Update for me, welp, icons were completely one-shot by both Kimi 2.5 and Opus 4.5

### src/components/Key.tsx:

### src/components/Keyboard.tsx:

### src/components/KeyPopover.tsx:

### src/components/LayerIndicator.tsx:

### src/context/LayerContext.tsx:

### src/context/MappingContext.tsx:

### src/data/default-mappings.ts:

### src/data/icon-manifest.ts:

- [ ] Record in typescript

For ankifying:

```typescript
const manifest: {{c1::Record<string, string>}} = {}; // {{c2::Hello there}}
```

### src/data/macbook-layout.ts:

### src/hooks/useKeyboardListener.ts:

### src/utils/generateMarkdown.ts:

### src/utils/keys.ts:

### src/utils/labels.ts:

### src/utils/storage.ts:

On its own, model added versioning to localstorage for backcompat:

```typescript
if (config.version !== CURRENT_VERSION) {
  return defaultMappings;
}
```

### Misc

- [ ] TypeScript Pick
