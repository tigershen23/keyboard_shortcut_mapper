import { useCallback, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider, useTheme } from "styled-components";
import { ActionBar } from "./components/ActionBar";
import { Keyboard } from "./components/Keyboard";
import { KeyPopover } from "./components/KeyPopover";
import { LayerIndicator } from "./components/LayerIndicator";
import { LayerProvider, useLayerContext } from "./context/LayerContext";
import { MappingProvider, useMappingContext } from "./context/MappingContext";
import { macbookLayout } from "./data/macbook-layout";
import { useKeyboardListener } from "./hooks/useKeyboardListener";
import { GlobalStyles } from "./styles/GlobalStyles";
import { darkTheme } from "./styles/theme";
import type { KeyMapping } from "./types";

function AppContent() {
  const { currentLayer, cycleLayer } = useLayerContext();
  const { selectedKeyId, selectedKeyRect, selectKey, clearSelection, getMappingForKey, updateMapping, deleteMapping } =
    useMappingContext();
  const [pressedKeyId, setPressedKeyId] = useState<string | null>(null);
  const theme = useTheme();

  const isEditing = selectedKeyId !== null;

  const layerColors = theme.layers[currentLayer];

  const handleKeyPress = useCallback((keyId: string) => {
    setPressedKeyId(keyId);
    setTimeout(() => setPressedKeyId(null), 400);
  }, []);

  useKeyboardListener({
    onKeyPress: handleKeyPress,
    onLayerCycle: cycleLayer,
    disabled: isEditing,
  });

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
        rippleColor={layerColors.ripple}
        layerAccent={layerColors.accent}
        selectedKeyId={selectedKeyId}
        onKeySelect={selectKey}
      />

      {selectedKeyId && selectedKeyRect && currentLayer !== "base" && (
        <KeyPopover
          keyId={selectedKeyId}
          keyRect={selectedKeyRect}
          currentMapping={currentMapping}
          currentLayer={currentLayer}
          layerAccent={layerColors.accent}
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={clearSelection}
        />
      )}

      <ActionBar />
    </>
  );
}

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <GlobalStyles />
      <LayerProvider>
        <MappingProvider>
          <AppContent />
        </MappingProvider>
      </LayerProvider>
    </ThemeProvider>
  );
}

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
