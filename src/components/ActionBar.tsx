import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { useMappingContext } from "../context/MappingContext";
import { macbookLayout } from "../data/macbook-layout";
import { generateMappingsMarkdown } from "../utils/generateMarkdown";

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const ActionBarContainer = styled.div`
  display: flex;
  align-items: center;
  gap: clamp(12px, 1.5vw, 20px);
  animation: ${fadeIn} 0.5s ease 0.4s forwards;
  opacity: 0;
`;

interface ActionButtonProps {
  $isSuccess?: boolean;
}

const ActionButton = styled.button<ActionButtonProps>`
  display: flex;
  align-items: center;
  gap: clamp(4px, 0.5vw, 6px);
  padding: 0;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  color: ${({ $isSuccess }) =>
    $isSuccess ? "rgba(120, 220, 150, 0.85)" : "rgba(255, 255, 255, 0.3)"};
  position: relative;

  &::after {
    content: "";
    position: absolute;
    bottom: -2px;
    left: 0;
    right: 0;
    height: 1px;
    background: currentColor;
    transform: scaleX(0);
    transform-origin: center;
    transition: transform 0.2s ease;
  }

  &:hover {
    color: ${({ $isSuccess }) =>
      $isSuccess ? "rgba(120, 220, 150, 0.85)" : "rgba(255, 255, 255, 0.6)"};

    &::after {
      transform: scaleX(1);
    }
  }

  &:active {
    transform: scale(0.98);
  }
`;

const ButtonIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: clamp(11px, 1.1vw, 14px);
  height: clamp(11px, 1.1vw, 14px);

  svg {
    width: 100%;
    height: 100%;
  }
`;

const ButtonLabel = styled.span`
  font-family: "Instrument Sans", sans-serif;
  font-size: clamp(10px, 1vw, 13px);
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
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
