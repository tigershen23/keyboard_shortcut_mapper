import React, { useState, useCallback } from "react";
import styled, { keyframes } from "styled-components";
import { createRoot } from "react-dom/client";
import { Keyboard } from "./components/Keyboard";
import { LayerIndicator } from "./components/LayerIndicator";
import { LayerProvider, useLayerContext } from "./context/LayerContext";
import { MappingProvider } from "./context/MappingContext";
import { useKeyboardListener } from "./hooks/useKeyboardListener";
import { macbookLayout } from "./data/macbook-layout";
import { GlobalStyles } from "./styles/GlobalStyles";

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
  font-family: "Instrument Sans", -apple-system, sans-serif;
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
