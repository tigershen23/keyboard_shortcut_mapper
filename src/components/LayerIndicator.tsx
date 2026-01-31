import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styled, { keyframes, useTheme } from "styled-components";
import { useLayerContext } from "../context/LayerContext.js";
import { useMappingContext } from "../context/MappingContext.js";
import { isFirstVisit, markInfoDismissed } from "../utils/storage.js";
import { ChevronIcon } from "./icons.js";
import type { LayerType } from "../types";

const indicatorEnter = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const IndicatorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(10px, 1.2vw, 16px);

  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    padding: 16px 12px 12px;
    background: linear-gradient(
      180deg,
      ${({ theme }) => theme.surface.popover} 0%,
      ${({ theme }) => theme.surface.popover.replace(/[\d.]+\)$/, "0.8)")} 70%,
      transparent 100%
    );
    z-index: 50;
    gap: 8px;
  }
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(8px, 1vw, 12px);
  position: relative;
`;

const PageTitle = styled.h1`
  font-family: "Instrument Sans", sans-serif;
  font-size: clamp(16px, 2vw, 26px);
  font-weight: 600;
  color: ${({ theme }) => theme.text.tertiary};
  letter-spacing: -0.01em;
  margin: 0;
  animation: ${indicatorEnter} 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards;
  opacity: 0;
`;

const InfoButton = styled.button<{ $isOpen: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: clamp(24px, 2.4vw, 28px);
  height: clamp(24px, 2.4vw, 28px);
  background: transparent;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: ${({ theme, $isOpen }) => ($isOpen ? theme.text.tertiary : theme.text.dimmed)};
  animation: ${indicatorEnter} 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards;
  opacity: 0;

  &:hover {
    color: ${({ theme }) => theme.text.tertiary};
    background: rgba(255, 255, 255, 0.05);
  }

  svg {
    width: 100%;
    height: 100%;
    transition: transform 0.2s ease;
    transform: ${({ $isOpen }) => ($isOpen ? "rotate(90deg)" : "rotate(0deg)")};
  }
`;

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: transparent;
  z-index: 90;
`;

const PopoverContainer = styled.div`
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  background: ${({ theme }) => theme.surface.popover};
  backdrop-filter: blur(12px);
  border: 1px solid ${({ theme }) => theme.border.light};
  border-radius: 12px;
  padding: 16px;
  min-width: 280px;
  max-width: 400px;
  box-shadow:
    0 8px 32px ${({ theme }) => theme.shadow.medium},
    0 2px 8px ${({ theme }) => theme.shadow.light};
  z-index: 91;
  animation: popoverIn 0.15s ease-out;

  @keyframes popoverIn {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(-8px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0) scale(1);
    }
  }

  @media (max-width: 768px) {
    left: 12px;
    right: 12px;
    transform: none;
    min-width: auto;

    @keyframes popoverIn {
      from {
        opacity: 0;
        transform: translateY(-8px) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }
  }
`;

const Paragraph = styled.p`
  font-family: "Instrument Sans", sans-serif;
  font-size: clamp(12px, 1.1vw, 14px);
  font-weight: 400;
  color: ${({ theme }) => theme.text.muted};
  line-height: 1.5;
  margin: 0;

  & + & {
    margin-top: clamp(10px, 1vw, 14px);
  }

  strong {
    font-weight: 600;
    color: ${({ theme }) => theme.text.tertiary};
  }
`;

const ExternalLink = styled.a`
  color: ${({ theme }) => theme.layers.hyper.accent};
  text-decoration: none;
  transition: opacity 0.15s ease;

  &:hover {
    opacity: 0.8;
    text-decoration: underline;
  }
`;

const IndicatorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(6px, 0.8vw, 10px);
`;

const IndicatorTabs = styled.div`
  display: flex;
  align-items: center;
  gap: clamp(2px, 0.3vw, 4px);
  padding: clamp(4px, 0.5vw, 6px);
  background: rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid ${({ theme }) => theme.border.light};
  border-radius: clamp(12px, 1.5vw, 18px);
  animation: ${indicatorEnter} 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards;
  opacity: 0;
`;

const IndicatorLabel = styled.span`
  font-family: "Instrument Sans", sans-serif;
  font-size: clamp(10px, 1vw, 13px);
  font-weight: 500;
  color: ${({ theme }) => theme.text.dimmed};
  letter-spacing: 0.02em;
  padding: 0 clamp(8px, 1vw, 12px);
`;

interface LayerTabProps {
  $isActive: boolean;
}

const LayerTab = styled.button<LayerTabProps>`
  display: flex;
  align-items: center;
  gap: clamp(5px, 0.6vw, 8px);
  padding: clamp(6px, 0.8vw, 10px) clamp(10px, 1.2vw, 16px);
  background: ${({ $isActive, theme }) => ($isActive ? theme.border.light : "transparent")};
  border: none;
  border-radius: clamp(8px, 1vw, 12px);
  cursor: pointer;
  transition: all 0.2s ease;
  opacity: ${({ $isActive }) => ($isActive ? 1 : 0.45)};

  &:hover {
    opacity: ${({ $isActive }) => ($isActive ? 1 : 0.7)};
    background: ${({ $isActive, theme }) => ($isActive ? theme.border.light : theme.border.subtle)};
  }
`;

interface TabDotProps {
  $isActive: boolean;
  $accentColor: string;
}

const TabDot = styled.span<TabDotProps>`
  width: clamp(6px, 0.7vw, 9px);
  height: clamp(6px, 0.7vw, 9px);
  border-radius: 50%;
  background: ${({ $accentColor }) => $accentColor};
  transition:
    background 0.3s ease,
    box-shadow 0.3s ease;
  box-shadow: ${({ $isActive, $accentColor }) => ($isActive ? `0 0 8px ${$accentColor}` : "none")};
`;

const TabLabel = styled.span`
  font-family: "Instrument Sans", sans-serif;
  font-size: clamp(11px, 1.1vw, 14px);
  font-weight: 500;
  color: ${({ theme }) => theme.text.tertiary};
  letter-spacing: 0.02em;
  white-space: nowrap;
`;

interface TabCountProps {
  $accentColor: string;
  $isActive: boolean;
}

const TabCount = styled.span<TabCountProps>`
  font-family: "Instrument Sans", sans-serif;
  font-size: clamp(9px, 0.9vw, 11px);
  font-weight: 600;
  color: ${({ $accentColor }) => $accentColor};
  opacity: ${({ $isActive }) => ($isActive ? 0.9 : 0.7)};
  margin-left: clamp(2px, 0.3vw, 4px);
`;

export function LayerIndicator() {
  const { currentLayer, setLayer, layers } = useLayerContext();
  const { mappings } = useMappingContext();
  const theme = useTheme();
  const [infoOpen, setInfoOpen] = useState(() => isFirstVisit());
  const [popoverTop, setPopoverTop] = useState(0);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const openedAtRef = useRef<number>(Date.now());

  const getMappingCount = (layerId: LayerType): number | null => {
    if (layerId === "hyper") return mappings.hyper.length;
    if (layerId === "command") return mappings.command.length;
    return null;
  };

  const closeInfo = () => {
    setInfoOpen(false);
    markInfoDismissed();
  };

  // Calculate initial position on mount if open by default (first visit)
  useEffect(() => {
    if (infoOpen && buttonRef.current && popoverTop === 0) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPopoverTop(rect.bottom + 8);
    }
  }, [infoOpen, popoverTop]);

  useEffect(() => {
    if (!infoOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      // Ignore clicks that happened before popover opened
      if (e.timeStamp < openedAtRef.current) return;

      const target = e.target;
      if (!(target instanceof Node)) return;
      if (buttonRef.current?.contains(target)) return;

      closeInfo();
    };

    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeInfo();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscapeKey);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [infoOpen]);

  const toggleInfo = () => {
    openedAtRef.current = Date.now();
    if (!infoOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPopoverTop(rect.bottom + 8);
    }
    setInfoOpen((prev) => {
      if (prev) markInfoDismissed();
      return !prev;
    });
  };

  return (
    <IndicatorContainer>
      <TitleRow>
        <PageTitle>Mac Keyboard Shortcuts</PageTitle>
        <InfoButton
          ref={buttonRef}
          onClick={toggleInfo}
          $isOpen={infoOpen}
          aria-expanded={infoOpen}
          aria-label="Show usage instructions"
          data-testid="info-button"
        >
          <ChevronIcon />
        </InfoButton>
      </TitleRow>

      {infoOpen &&
        createPortal(
          <>
            <Backdrop onClick={closeInfo} />
            <PopoverContainer style={{ top: popoverTop }} data-testid="info-popover">
              <Paragraph>Map your Mac keyboard shortcuts visually. Click any key to assign an app or action.</Paragraph>
              <Paragraph>
                <strong>Recommendation: </strong>{" "}
                <ExternalLink href="https://manual.raycast.com/hyperkey" target="_blank" rel="noopener noreferrer">
                  Raycast Hyper key
                </ExternalLink>{" "}
                setup, where Hyper layer is used for app launching and Command (Hyper+Shift) layer is used for system
                actions.
              </Paragraph>
            </PopoverContainer>
          </>,
          document.body,
        )}

      <IndicatorWrapper>
        <IndicatorTabs>
          <IndicatorLabel>Layer →</IndicatorLabel>
          {layers.map((layer) => {
            const isActive = currentLayer === layer.id;
            const count = getMappingCount(layer.id);
            const accentColor = theme.layers[layer.id].accent;
            return (
              <LayerTab
                key={layer.id}
                $isActive={isActive}
                onClick={() => setLayer(layer.id)}
                data-testid={`layer-tab-${layer.id}`}
                data-active={isActive}
              >
                <TabDot $isActive={isActive} $accentColor={accentColor} />
                <TabLabel>{layer.shortLabel}</TabLabel>
                {count !== null && (
                  <TabCount $accentColor={accentColor} $isActive={isActive}>
                    {count}
                  </TabCount>
                )}
              </LayerTab>
            );
          })}
        </IndicatorTabs>
      </IndicatorWrapper>
    </IndicatorContainer>
  );
}
