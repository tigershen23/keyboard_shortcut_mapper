import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  :root {
    --key-unit: clamp(28px, 5vw, 70px);
    --key-gap: clamp(2px, 0.35vw, 6px);
    --key-radius: clamp(4px, 0.6vw, 10px);
    --frame-padding: clamp(6px, 0.9vw, 16px);
    --frame-radius: clamp(10px, 1.4vw, 20px);
    --font-key: clamp(12px, 1.5vw, 24px);
    --font-key-secondary: clamp(10px, 1.2vw, 18px);
    --font-key-modifier: clamp(14px, 1.8vw, 28px);
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
    background: ${({ theme }) => theme.surface.page};
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
    background: ${({ theme }) => theme.mesh.baseGradient};
  }

  .bg-gradient::before {
    content: '';
    position: fixed;
    top: -150px;
    left: -150px;
    right: -150px;
    bottom: -150px;
    background: ${({ theme }) => theme.mesh.primary.join(", ")};
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
    background: ${({ theme }) => theme.mesh.secondary.join(", ")};
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
      --frame-padding: clamp(6px, 0.75vh, 14px);
      --frame-radius: clamp(8px, 1vh, 18px);
      --font-key: clamp(12px, 1.3vh, 22px);
      --font-key-secondary: clamp(10px, 1vh, 16px);
      --font-key-modifier: clamp(14px, 1.6vh, 26px);
      --font-key-function: clamp(8px, 0.95vh, 15px);
    }
  }

  @media (max-width: 768px) {
    :root {
      --key-gap: clamp(1px, 0.3vw, 2px);
      --key-radius: clamp(2px, 0.5vw, 4px);
      --frame-padding: clamp(2px, 0.6vw, 5px);
      --frame-radius: clamp(4px, 1vw, 8px);
      --key-unit: clamp(
        14px,
        calc((100vw - 16px - (2 * var(--frame-padding)) - (14 * var(--key-gap))) / 15),
        26px
      );
      --font-key: clamp(6px, 1.6vw, 11px);
      --font-key-secondary: clamp(5px, 1.2vw, 9px);
      --font-key-modifier: clamp(8px, 2vw, 14px);
      --font-key-function: clamp(5px, 1.2vw, 8px);
    }

    #root {
      padding: 80px 8px 80px 8px;
      gap: 0;
      justify-content: center;
    }
  }
`;
