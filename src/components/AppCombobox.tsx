import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { getIconPath, iconManifest } from "../data/icon-manifest.js";

const apps = Object.keys(iconManifest).sort();

interface AppComboboxProps {
  value: string;
  onChange: (value: string) => void;
  layerAccent: string;
  onSubmit: () => void;
}

export function AppCombobox({ value, onChange, layerAccent, onSubmit }: AppComboboxProps) {
  const [inputValue, setInputValue] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const filteredApps = !inputValue ? apps : apps.filter((app) => app.toLowerCase().includes(inputValue.toLowerCase()));

  useEffect(() => {
    setHighlightedIndex(0);
  }, [filteredApps]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setIsOpen(true);
  };

  const handleSelect = (app: string) => {
    setInputValue(app);
    onChange(app);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        setIsOpen(true);
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) => Math.min(prev + 1, filteredApps.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => Math.max(prev - 1, 0));
        break;
      case "Enter":
        e.preventDefault();
        if (filteredApps.length === 0) {
          onSubmit();
        } else if (e.metaKey) {
          onSubmit();
        } else if (filteredApps[highlightedIndex]) {
          handleSelect(filteredApps[highlightedIndex]);
        }
        break;
      case "Escape":
        if (isOpen && filteredApps.length > 0) {
          setIsOpen(false);
        }
        break;
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && listRef.current) {
      const item = listRef.current.children[highlightedIndex] as HTMLElement;
      if (item) {
        item.scrollIntoView({ block: "nearest" });
      }
    }
  }, [highlightedIndex, isOpen]);

  return (
    <Container ref={containerRef}>
      <StyledInput
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsOpen(true)}
        placeholder="Search apps..."
        $accent={layerAccent}
        data-testid="app-combobox-input"
      />
      {isOpen && filteredApps.length > 0 && (
        <Dropdown ref={listRef}>
          {filteredApps.map((app, index) => (
            <DropdownItem
              key={app}
              onClick={() => handleSelect(app)}
              $highlighted={index === highlightedIndex}
              $selected={app === value}
              onMouseEnter={() => setHighlightedIndex(index)}
              data-testid={`app-option-${app.toLowerCase().replace(/\s+/g, "-")}`}
            >
              <AppIcon src={getIconPath(app) ?? ""} alt="" />
              <AppName>{app}</AppName>
            </DropdownItem>
          ))}
        </Dropdown>
      )}
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  width: 100%;
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
  }

  &::placeholder {
    color: ${({ theme }) => theme.text.dimmed};
  }
`;

const Dropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 4px;
  background: ${({ theme }) => theme.surface.popover.replace(/[\d.]+\)$/, "0.98)")};
  backdrop-filter: blur(12px);
  border: 1px solid ${({ theme }) => theme.border.light};
  border-radius: 8px;
  padding: 4px;
  max-height: 200px;
  overflow-y: auto;
  box-shadow: 0 8px 24px ${({ theme }) => theme.shadow.medium};
  z-index: 200;
`;

const DropdownItem = styled.div<{ $highlighted: boolean; $selected: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 4px;
  cursor: pointer;
  color: ${({ theme }) => theme.text.tertiary};
  font-family: "Instrument Sans", sans-serif;
  font-size: 13px;
  background: ${({ $highlighted, $selected, theme }) =>
    $selected ? "var(--layer-accent)" : $highlighted ? theme.border.light : "transparent"};
`;

const AppIcon = styled.img`
  width: 20px;
  height: 20px;
  border-radius: 4px;
  object-fit: contain;
`;

const AppName = styled.span`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
