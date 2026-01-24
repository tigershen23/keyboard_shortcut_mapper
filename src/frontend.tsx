import React, { useCallback, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import styled, { keyframes } from "styled-components";
import { Keyboard } from "./components/Keyboard";
import { KeyPopover } from "./components/KeyPopover";
import { LayerIndicator } from "./components/LayerIndicator";
import { LayerProvider, useLayerContext } from "./context/LayerContext";
import { MappingProvider, useMappingContext } from "./context/MappingContext";
import { macbookLayout } from "./data/macbook-layout";
import { useKeyboardListener } from "./hooks/useKeyboardListener";
import { GlobalStyles } from "./styles/GlobalStyles";
import type { KeyMapping } from "./types";

const titleEnter = keyframes`
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const KeyboardTitle = styled.p`
  font-family:
    "Instrument Sans",
    -apple-system,
    sans-serif;
  font-size: clamp(10px, 1.1vw, 14px);
  font-weight: 500;
  color: rgba(255, 255, 255, 0.35);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  animation: ${titleEnter} 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards;
  opacity: 0;
`;

function AppContent() {
  const { currentLayer, currentLayerConfig, cycleLayer } = useLayerContext();
  const {
    selectedKeyId,
    selectedKeyRect,
    selectKey,
    clearSelection,
    getMappingForKey,
    updateMapping,
    deleteMapping,
  } = useMappingContext();
  const [pressedKeyId, setPressedKeyId] = useState<string | null>(null);

  const isEditing = selectedKeyId !== null;

  const handleKeyPress = useCallback((keyId: string) => {
    setPressedKeyId(keyId);
    setTimeout(() => setPressedKeyId(null), 400);
  }, []);

  useKeyboardListener({
    onKeyPress: handleKeyPress,
    onLayerCycle: cycleLayer,
    disabled: isEditing,
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: Intentionally clearing selection when layer changes
  useEffect(() => {
    clearSelection();
  }, [currentLayer, clearSelection]);

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
      <Keyboard
        layout={macbookLayout}
        currentLayer={currentLayer}
        pressedKeyId={pressedKeyId}
        onKeyPress={handleKeyPress}
        rippleColor={currentLayerConfig.rippleColor}
        layerAccent={currentLayerConfig.accentColor}
        selectedKeyId={selectedKeyId}
        onKeySelect={selectKey}
      />

      {selectedKeyId && selectedKeyRect && currentLayer !== "base" && (
        <KeyPopover
          keyId={selectedKeyId}
          keyRect={selectedKeyRect}
          currentMapping={currentMapping}
          layerAccent={currentLayerConfig.accentColor}
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={clearSelection}
        />
      )}

      <KeyboardTitle>MacBook Pro — US ANSI</KeyboardTitle>
    </>
  );
}

function App() {
  return (
    <>
      <GlobalStyles />
      <LayerProvider>
        <MappingProvider>
          <AppContent />
        </MappingProvider>
      </LayerProvider>
    </>
  );
}

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
