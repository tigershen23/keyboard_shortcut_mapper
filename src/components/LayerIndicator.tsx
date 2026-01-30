import React from "react";
import styled, { keyframes } from "styled-components";
import { useLayerContext } from "../context/LayerContext";
import { useMappingContext } from "../context/MappingContext";

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
    background: linear-gradient(180deg, rgba(20, 16, 14, 0.95) 0%, rgba(20, 16, 14, 0.8) 70%, transparent 100%);
    z-index: 50;
    gap: 8px;
  }
`;

const PageTitle = styled.h1`
  font-family: "Instrument Sans", sans-serif;
  font-size: clamp(16px, 2vw, 26px);
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  letter-spacing: -0.01em;
  margin: 0;
  animation: ${indicatorEnter} 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards;
  opacity: 0;
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
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: clamp(12px, 1.5vw, 18px);
  animation: ${indicatorEnter} 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards;
  opacity: 0;
`;

const IndicatorLabel = styled.span`
  font-family: "Instrument Sans", sans-serif;
  font-size: clamp(10px, 1vw, 13px);
  font-weight: 500;
  color: rgba(255, 255, 255, 0.45);
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
  background: ${({ $isActive }) => ($isActive ? "rgba(255, 255, 255, 0.1)" : "transparent")};
  border: none;
  border-radius: clamp(8px, 1vw, 12px);
  cursor: pointer;
  transition: all 0.2s ease;
  opacity: ${({ $isActive }) => ($isActive ? 1 : 0.45)};

  &:hover {
    opacity: ${({ $isActive }) => ($isActive ? 1 : 0.7)};
    background: ${({ $isActive }) =>
      $isActive ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.05)"};
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
  color: rgba(255, 255, 255, 0.85);
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

  const getMappingCount = (layerId: string): number | null => {
    if (layerId === "hyper") return mappings.hyper.length;
    if (layerId === "command") return mappings.command.length;
    return null;
  };

  return (
    <IndicatorContainer>
      <PageTitle>Mac Keyboard Shortcuts</PageTitle>
      <IndicatorWrapper>
        <IndicatorTabs>
          <IndicatorLabel>Layer →</IndicatorLabel>
          {layers.map((layer) => {
            const isActive = currentLayer === layer.id;
            const count = getMappingCount(layer.id);
            return (
              <LayerTab key={layer.id} $isActive={isActive} onClick={() => setLayer(layer.id)}>
                <TabDot $isActive={isActive} $accentColor={layer.accentColor} />
                <TabLabel>{layer.shortLabel}</TabLabel>
                {count !== null && <TabCount $accentColor={layer.accentColor} $isActive={isActive}>{count}</TabCount>}
              </LayerTab>
            );
          })}
        </IndicatorTabs>
      </IndicatorWrapper>
    </IndicatorContainer>
  );
}
