import React from "react";
import { createRoot } from "react-dom/client";
import { Keyboard } from "./components/Keyboard";
import { macbookLayout } from "./data/macbook-layout";
import "./styles/main.css";

function App() {
  return (
    <>
      <Keyboard layout={macbookLayout} />
      <p className="keyboard-title">MacBook Pro — US ANSI</p>
    </>
  );
}

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
