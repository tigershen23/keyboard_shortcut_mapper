import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { useMappingContext } from "../context/MappingContext";
import { macbookLayout } from "../data/macbook-layout";
import { generateMappingsMarkdown } from "../utils/generateMarkdown";

const barEnter = keyframes`
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const ActionBarContainer = styled.div`
  display: flex;
  align-items: center;
  gap: clamp(4px, 0.5vw, 8px);
  padding: clamp(4px, 0.5vw, 6px);
  background: rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: clamp(8px, 1vw, 12px);
  animation: ${barEnter} 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards;
  opacity: 0;
`;

interface ActionButtonProps {
  $isSuccess?: boolean;
}

const ActionButton = styled.button<ActionButtonProps>`
  display: flex;
  align-items: center;
  gap: clamp(5px, 0.6vw, 8px);
  padding: clamp(6px, 0.8vw, 10px) clamp(10px, 1.2vw, 16px);
  background: transparent;
  border: none;
  border-radius: clamp(6px, 0.8vw, 10px);
  cursor: pointer;
  transition: all 0.2s ease;
  color: ${({ $isSuccess }) =>
    $isSuccess ? "rgba(120, 220, 150, 0.9)" : "rgba(255, 255, 255, 0.45)"};

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: ${({ $isSuccess }) =>
      $isSuccess ? "rgba(120, 220, 150, 0.9)" : "rgba(255, 255, 255, 0.85)"};
  }

  &:active {
    transform: scale(0.97);
  }
`;

const ButtonIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: clamp(14px, 1.4vw, 18px);
  height: clamp(14px, 1.4vw, 18px);

  svg {
    width: 100%;
    height: 100%;
  }
`;

const ButtonLabel = styled.span`
  font-family: "Instrument Sans", sans-serif;
  font-size: clamp(11px, 1.1vw, 14px);
  font-weight: 500;
  letter-spacing: 0.02em;
  white-space: nowrap;
`;

function CopyIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export function ActionBar() {
  const { mappings } = useMappingContext();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const markdown = generateMappingsMarkdown(mappings, macbookLayout);

    if (!markdown) {
      return;
    }

    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      console.error("Failed to copy to clipboard");
    }
  };

  return (
    <ActionBarContainer>
      <ActionButton onClick={handleCopy} $isSuccess={copied}>
        <ButtonIcon>{copied ? <CheckIcon /> : <CopyIcon />}</ButtonIcon>
        <ButtonLabel>{copied ? "Copied!" : "Copy"}</ButtonLabel>
      </ActionButton>
    </ActionBarContainer>
  );
}
