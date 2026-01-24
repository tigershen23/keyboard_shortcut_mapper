import React, { useState, useCallback } from "react";
import { createRoot } from "react-dom/client";
import { Keyboard } from "./components/Keyboard";
import { LayerIndicator } from "./components/LayerIndicator";
import { LayerProvider, useLayerContext } from "./context/LayerContext";
import { useKeyboardListener } from "./hooks/useKeyboardListener";
import { macbookLayout } from "./data/macbook-layout";
import "./styles/main.css";

function AppContent() {
  const { currentLayer, currentLayerConfig, cycleLayer } = useLayerContext();
  const [pressedKeyId, setPressedKeyId] = useState<string | null>(null);

  const handleKeyPress = useCallback((keyId: string) => {
    setPressedKeyId(keyId);
    setTimeout(() => setPressedKeyId(null), 400);
  }, []);

  useKeyboardListener({
    onKeyPress: handleKeyPress,
    onLayerCycle: cycleLayer,
  });

  return (
    <>
      <LayerIndicator />
      <Keyboard
        layout={macbookLayout}
        currentLayer={currentLayer}
        pressedKeyId={pressedKeyId}
        onKeyPress={handleKeyPress}
        rippleColor={currentLayerConfig.rippleColor}
      />
      <p className="keyboard-title">MacBook Pro — US ANSI</p>
    </>
  );
}

function App() {
  return (
    <LayerProvider>
      <AppContent />
    </LayerProvider>
  );
}

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
