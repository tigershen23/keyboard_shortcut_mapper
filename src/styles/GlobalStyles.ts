import { createGlobalStyle, keyframes } from "styled-components";

export const meshShift = keyframes`
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
    filter: blur(80px);
  }
  33% {
    transform: translate(5%, -5%) rotate(2deg);
    filter: blur(90px);
  }
  66% {
    transform: translate(-3%, 3%) rotate(-1deg);
    filter: blur(70px);
  }
`;

export const GlobalStyles = createGlobalStyle`
  :root {
    --key-unit: clamp(28px, 5vw, 70px);
    --key-gap: clamp(2px, 0.35vw, 6px);
    --key-radius: clamp(4px, 0.6vw, 10px);
    --frame-padding: clamp(12px, 1.8vw, 32px);
    --frame-radius: clamp(10px, 1.4vw, 20px);
    --font-key: clamp(10px, 1.3vw, 20px);
    --font-key-secondary: clamp(8px, 1vw, 15px);
    --font-key-modifier: clamp(12px, 1.6vw, 24px);
    --font-key-function: clamp(8px, 1.1vw, 16px);
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html, body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  html {
    background: #231418;
  }

  body {
    background: transparent;
    font-family: "Instrument Sans", -apple-system, BlinkMacSystemFont, sans-serif;
    -webkit-font-smoothing: antialiased;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .bg-gradient {
    position: fixed;
    top: -100px;
    left: -100px;
    right: -100px;
    bottom: -100px;
    z-index: 0;
    background: linear-gradient(170deg, #1a1410 0%, #12100c 35%, #14100e 60%, #1a1215 80%, #231418 100%);
  }

  .bg-gradient::before {
    content: '';
    position: fixed;
    top: -150px;
    left: -150px;
    right: -150px;
    bottom: -150px;
    background:
      radial-gradient(ellipse 60% 50% at 15% 25%, rgba(180, 90, 50, 0.5) 0%, transparent 70%),
      radial-gradient(ellipse 50% 60% at 85% 15%, rgba(200, 120, 60, 0.4) 0%, transparent 65%),
      radial-gradient(ellipse 70% 50% at 75% 75%, rgba(160, 70, 90, 0.45) 0%, transparent 70%),
      radial-gradient(ellipse 50% 50% at 5% 70%, rgba(140, 100, 50, 0.35) 0%, transparent 65%),
      radial-gradient(ellipse 100% 60% at 50% 100%, rgba(100, 50, 70, 0.5) 0%, transparent 70%);
    filter: blur(80px);
    animation: meshShift 30s ease-in-out infinite;
  }

  .bg-gradient::after {
    content: '';
    position: fixed;
    top: -100px;
    left: -100px;
    right: -100px;
    bottom: -100px;
    background:
      radial-gradient(ellipse 70% 60% at 50% 50%, rgba(190, 100, 70, 0.2) 0%, transparent 65%),
      radial-gradient(ellipse 50% 60% at 25% 60%, rgba(170, 130, 60, 0.18) 0%, transparent 60%),
      radial-gradient(ellipse 80% 60% at 50% 100%, rgba(120, 60, 70, 0.3) 0%, transparent 65%);
    filter: blur(60px);
    animation: meshShift 22s ease-in-out infinite reverse;
  }

  @keyframes meshShift {
    0%, 100% {
      transform: translate(0, 0) rotate(0deg);
      filter: blur(80px);
    }
    33% {
      transform: translate(5%, -5%) rotate(2deg);
      filter: blur(90px);
    }
    66% {
      transform: translate(-3%, 3%) rotate(-1deg);
      filter: blur(70px);
    }
  }

  #root {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: clamp(16px, 2.5vw, 40px);
    width: 100vw;
    height: 100vh;
    min-height: 100vh;
    padding: clamp(20px, 3vw, 50px);
    isolation: isolate;
  }

  @media (min-aspect-ratio: 21/9) {
    :root {
      --key-unit: clamp(32px, 4.5vh, 72px);
      --key-gap: clamp(2px, 0.3vh, 5px);
      --key-radius: clamp(4px, 0.5vh, 9px);
      --frame-padding: clamp(12px, 1.5vh, 28px);
      --frame-radius: clamp(8px, 1vh, 18px);
      --font-key: clamp(10px, 1.1vh, 18px);
      --font-key-secondary: clamp(8px, 0.85vh, 14px);
      --font-key-modifier: clamp(12px, 1.4vh, 22px);
      --font-key-function: clamp(8px, 0.95vh, 15px);
    }
  }

  @media (max-width: 768px) {
    :root {
      --key-unit: clamp(24px, 8vw, 48px);
      --key-gap: clamp(1px, 0.5vw, 3px);
      --key-radius: clamp(3px, 0.8vw, 6px);
      --frame-padding: clamp(8px, 2vw, 16px);
      --frame-radius: clamp(6px, 1.5vw, 12px);
      --font-key: clamp(8px, 2vw, 12px);
      --font-key-secondary: clamp(6px, 1.5vw, 10px);
      --font-key-modifier: clamp(10px, 2.5vw, 16px);
      --font-key-function: clamp(6px, 1.8vw, 11px);
    }
  }
`;
