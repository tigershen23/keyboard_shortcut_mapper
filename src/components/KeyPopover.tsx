import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styled, { css } from "styled-components";
import type { KeyMapping } from "../types/index.js";
import { AppCombobox } from "./AppCombobox.js";

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
  const [popupStyle, setPopupStyle] = useState<React.CSSProperties>({
    position: "fixed",
    left: -9999,
    top: -9999,
    transform: "translateY(-50%)",
  });
  const [arrowSide, setArrowSide] = useState<"left" | "right">("left");
  const [isPositioned, setIsPositioned] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const openedAtRef = useRef<number>(Date.now());
  const padding = 8;

  const handleSave = useCallback(() => {
    if (!action.trim()) return;
    onSave({
      keyId,
      action: action.trim(),
      appName: appName || undefined,
    });
  }, [action, appName, keyId, onSave]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSave();
      }
    },
    [handleSave],
  );

  const updatePlacement = useCallback(() => {
    const popup = popupRef.current;
    if (!popup) return;

    const baseLeft = keyRect.right + 12;
    const baseTop = keyRect.top + keyRect.height / 2;
    const { width, height } = popup.getBoundingClientRect();
    let left = baseLeft;
    let side: "left" | "right" = "left";

    if (left + width > window.innerWidth - padding) {
      left = keyRect.left - 12 - width;
      side = "right";
    }

    if (left < padding) {
      left = padding;
    }

    const minTop = padding + height / 2;
    const maxTop = window.innerHeight - padding - height / 2;
    const top = minTop <= maxTop ? Math.min(Math.max(baseTop, minTop), maxTop) : window.innerHeight / 2;

    setArrowSide(side);
    setPopupStyle({
      position: "fixed",
      left,
      top,
      transform: "translateY(-50%)",
    });
    setIsPositioned(true);
  }, [keyRect, padding]);

  useLayoutEffect(() => {
    setIsPositioned(false);
    updatePlacement();
    const handleResize = () => updatePlacement();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [updatePlacement]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      // Ignore clicks that happened before popover opened (prevents same-click closing)
      if (e.timeStamp < openedAtRef.current) return;

      const target = e.target;
      if (!(target instanceof Node)) return;
      if (popupRef.current?.contains(target)) return;

      onClose();
    };

    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscapeKey);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [onClose]);

  return createPortal(
    <>
      <Backdrop onClick={onClose} />
      <PopupContainer
        ref={popupRef}
        style={popupStyle}
        $accent={layerAccent}
        $isPositioned={isPositioned}
        data-testid="key-popover"
      >
        <Arrow $side={arrowSide} />
        <FormGroup>
          <FormLabel>Action</FormLabel>
          <StyledInput
            value={action}
            onChange={(e) => setAction(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Action name"
            autoFocus
            $accent={layerAccent}
            data-testid="action-input"
          />
        </FormGroup>

        {currentLayer !== "command" && (
          <FormGroup>
            <FormLabel>App</FormLabel>
            <AppCombobox value={appName} onChange={setAppName} layerAccent={layerAccent} onSubmit={handleSave} />
          </FormGroup>
        )}

        <ButtonRow>
          {currentMapping && (
            <DeleteButton onClick={onDelete} data-testid="delete-mapping-button">
              Delete
            </DeleteButton>
          )}
          <SaveButton
            onClick={handleSave}
            disabled={!action.trim()}
            $accent={layerAccent}
            data-testid="save-mapping-button"
          >
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
  background: ${({ theme }) => theme.shadow.light};
  z-index: 99;
`;

const Arrow = styled.div<{ $side: "left" | "right" }>`
  position: absolute;
  ${({ $side }) =>
    $side === "right"
      ? css`
          right: -6px;
        `
      : css`
          left: -6px;
        `}
  top: 50%;
  width: 0;
  height: 0;
  margin-top: -6px;
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
  ${({ $side, theme }) =>
    $side === "right"
      ? css`
          border-left: 6px solid ${theme.surface.popover};
        `
      : css`
          border-right: 6px solid ${theme.surface.popover};
        `}

  &::before {
    content: "";
    position: absolute;
    ${({ $side }) =>
      $side === "right"
        ? css`
            right: 1px;
          `
        : css`
            left: 1px;
          `}
    top: -7px;
    width: 0;
    height: 0;
    border-top: 7px solid transparent;
    border-bottom: 7px solid transparent;
    ${({ $side, theme }) =>
      $side === "right"
        ? css`
            border-left: 7px solid ${theme.border.light};
          `
        : css`
            border-right: 7px solid ${theme.border.light};
          `}
  }
`;

const PopupContainer = styled.div<{ $accent: string; $isPositioned: boolean }>`
  background: ${({ theme }) => theme.surface.popover};
  backdrop-filter: blur(12px);
  border: 1px solid ${({ theme }) => theme.border.light};
  border-radius: 12px;
  padding: 16px;
  min-width: 240px;
  max-height: calc(100vh - 16px);
  overflow: auto;
  opacity: ${({ $isPositioned }) => ($isPositioned ? 1 : 0)};
  pointer-events: ${({ $isPositioned }) => ($isPositioned ? "auto" : "none")};
  box-shadow:
    0 8px 32px ${({ theme }) => theme.shadow.medium},
    0 2px 8px ${({ theme }) => theme.shadow.light};
  z-index: 100;
  --layer-accent: ${({ $accent }) => $accent};
  animation: popoverIn 0.15s ease-out;
  transition: opacity 0.12s ease-out;
  will-change: transform;

  @media (max-width: 768px) {
    width: min(320px, calc(100vw - 16px));
  }

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
  color: ${({ theme }) => theme.text.muted};
  margin-bottom: 6px;
`;

const StyledInput = styled.input<{ $accent: string }>`
  width: 100%;
  height: 36px;
  padding: 0 12px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid ${({ theme }) => theme.border.medium};
  border-radius: 6px;
  color: ${({ theme }) => theme.text.primary};
  font-family: "Instrument Sans", sans-serif;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: ${({ $accent }) => $accent};
    box-shadow: 0 0 0 2px ${({ $accent }) => $accent}33;
  }

  &::placeholder {
    color: ${({ theme }) => theme.text.dimmed};
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
  background: ${({ $accent, disabled, theme }) => (disabled ? theme.border.light : $accent)};
  border: none;
  border-radius: 6px;
  color: ${({ theme }) => theme.text.primary};
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
  color: ${({ theme }) => theme.semantic.danger};
  font-family: "Instrument Sans", sans-serif;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: ${({ theme }) => theme.semantic.danger.replace(/[\d.]+\)$/, "0.15)")};
  }
`;
