import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";
import type { KeyMapping } from "../types";
import { AppCombobox } from "./AppCombobox";

interface KeyPopoverProps {
  keyId: string;
  keyRect: DOMRect;
  currentMapping: KeyMapping | null;
  currentLayer: string;
  layerAccent: string;
  onSave: (mapping: KeyMapping) => void;
  onDelete: () => void;
  onClose: () => void;
}

export function KeyPopover({
  keyId,
  keyRect,
  currentMapping,
  currentLayer,
  layerAccent,
  onSave,
  onDelete,
  onClose,
}: KeyPopoverProps) {
  const [action, setAction] = useState(currentMapping?.action ?? "");
  const [appName, setAppName] = useState(currentMapping?.appName ?? "");
  const popupRef = useRef<HTMLDivElement>(null);

  const handleSave = () => {
    if (!action.trim()) return;
    onSave({
      keyId,
      action: action.trim(),
      appName: appName || undefined,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  // Position the popup to the right of the key
  const popupStyle: React.CSSProperties = {
    position: "fixed",
    left: keyRect.right + 12,
    top: keyRect.top + keyRect.height / 2,
    transform: "translateY(-50%)",
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    // Delay adding listener to avoid immediate close from the click that opened it
    const timeoutId = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 0);
    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return createPortal(
    <>
      <Backdrop />
      <PopupContainer ref={popupRef} style={popupStyle} $accent={layerAccent}>
        <Arrow $accent={layerAccent} />
        <FormGroup>
          <FormLabel>Action</FormLabel>
          <StyledInput
            value={action}
            onChange={(e) => setAction(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Action name"
            autoFocus
            $accent={layerAccent}
          />
        </FormGroup>

        {currentLayer !== "command" && (
          <FormGroup>
            <FormLabel>App</FormLabel>
            <AppCombobox
              value={appName}
              onChange={setAppName}
              layerAccent={layerAccent}
              onSubmit={handleSave}
            />
          </FormGroup>
        )}

        <ButtonRow>
          {currentMapping && <DeleteButton onClick={onDelete}>Delete</DeleteButton>}
          <SaveButton onClick={handleSave} disabled={!action.trim()} $accent={layerAccent}>
            Save
          </SaveButton>
        </ButtonRow>
      </PopupContainer>
    </>,
    document.body,
  );
}

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.2);
  z-index: 99;
`;

const Arrow = styled.div<{ $accent: string }>`
  position: absolute;
  left: -6px;
  top: 50%;
  width: 0;
  height: 0;
  margin-top: -6px;
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
  border-right: 6px solid rgba(28, 28, 32, 0.95);

  &::before {
    content: "";
    position: absolute;
    left: 1px;
    top: -7px;
    width: 0;
    height: 0;
    border-top: 7px solid transparent;
    border-bottom: 7px solid transparent;
    border-right: 7px solid rgba(255, 255, 255, 0.1);
  }
`;

const PopupContainer = styled.div<{ $accent: string }>`
  background: rgba(28, 28, 32, 0.95);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 16px;
  min-width: 240px;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.3),
    0 2px 8px rgba(0, 0, 0, 0.2);
  z-index: 100;
  --layer-accent: ${({ $accent }) => $accent};
  animation: popoverIn 0.15s ease-out;

  @keyframes popoverIn {
    from {
      opacity: 0;
      transform: translateY(-50%) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(-50%) scale(1);
    }
  }
`;

const FormGroup = styled.div`
  margin-bottom: 12px;
`;

const FormLabel = styled.label`
  display: block;
  font-family: "Instrument Sans", sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 6px;
`;

const StyledInput = styled.input<{ $accent: string }>`
  width: 100%;
  height: 36px;
  padding: 0 12px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 6px;
  color: white;
  font-family: "Instrument Sans", sans-serif;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: ${({ $accent }) => $accent};
    box-shadow: 0 0 0 2px ${({ $accent }) => $accent}33;
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 16px;
`;

const SaveButton = styled.button<{ $accent: string; disabled?: boolean }>`
  height: 32px;
  padding: 0 16px;
  background: ${({ $accent, disabled }) => (disabled ? "rgba(255,255,255,0.1)" : $accent)};
  border: none;
  border-radius: 6px;
  color: white;
  font-family: "Instrument Sans", sans-serif;
  font-weight: 500;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  transition:
    opacity 0.15s,
    background 0.15s,
    filter 0.15s;

  &:hover:not(:disabled) {
    filter: brightness(1.1);
  }
`;

const DeleteButton = styled.button`
  height: 32px;
  padding: 0 12px;
  background: transparent;
  border: none;
  border-radius: 6px;
  color: rgba(220, 80, 80, 0.9);
  font-family: "Instrument Sans", sans-serif;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: rgba(220, 80, 80, 0.15);
  }
`;
