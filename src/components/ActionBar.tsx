import { Dialog } from "@base-ui-components/react/dialog";
import { Menu } from "@base-ui-components/react/menu";
import { useCallback, useState } from "react";
import { toPng } from "html-to-image";
import styled, { keyframes } from "styled-components";
import { useLayerContext } from "../context/LayerContext";
import { useMappingContext } from "../context/MappingContext";
import { macbookLayout } from "../data/macbook-layout";
import { generateMappingsMarkdown } from "../utils/generateMarkdown";
import type { LayerType } from "../types";
import { CheckIcon, ChevronDownIcon, CopyIcon, DownloadIcon, ResetIcon } from "./icons";

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

  @media (max-width: 768px) {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 12px 12px 16px;
    background: linear-gradient(0deg, ${({ theme }) => theme.surface.popover} 0%, ${({ theme }) => theme.surface.popover.replace(/[\d.]+\)$/, "0.8)")} 30%, transparent 100%);
    z-index: 50;
  }
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
  color: ${({ $isSuccess, theme }) => ($isSuccess ? theme.semantic.success : theme.text.hint)};
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
    color: ${({ $isSuccess, theme }) => ($isSuccess ? theme.semantic.success : theme.text.muted)};

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

const Divider = styled.span`
  width: 1px;
  height: clamp(12px, 1.2vw, 16px);
  background: ${({ theme }) => theme.border.light};
`;

const CreditsLink = styled.a`
  display: flex;
  align-items: center;
  font-size: clamp(14px, 1.4vw, 18px);
  text-decoration: none;
  transition: transform 0.15s ease;
  
  &:hover {
    transform: scale(1.1);
  }
`;

const DialogBackdrop = styled(Dialog.Backdrop)`
  position: fixed;
  inset: 0;
  background: ${({ theme }) => theme.shadow.backdrop};
  backdrop-filter: blur(4px);
  z-index: 100;
`;

const DialogPopup = styled(Dialog.Popup)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: ${({ theme }) => theme.surface.dialog};
  border: 1px solid ${({ theme }) => theme.border.light};
  border-radius: 12px;
  padding: 24px;
  max-width: 360px;
  width: calc(100% - 32px);
  z-index: 101;
  box-shadow: 0 20px 40px ${({ theme }) => theme.shadow.heavy};
`;

const DialogTitle = styled(Dialog.Title)`
  font-family: "Instrument Sans", sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.text.tertiary};
  margin: 0 0 8px 0;
`;

const DialogDescription = styled(Dialog.Description)`
  font-family: "Instrument Sans", sans-serif;
  font-size: 14px;
  color: ${({ theme }) => theme.text.muted};
  margin: 0 0 20px 0;
  line-height: 1.5;
`;

const DialogActions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

const DialogButton = styled.button<{ $variant?: "danger" | "secondary" }>`
  font-family: "Instrument Sans", sans-serif;
  font-size: 13px;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: all 0.15s ease;

  ${({ $variant, theme }) =>
    $variant === "danger"
      ? `
    background: ${theme.semantic.danger};
    color: ${theme.text.primary};
    &:hover {
      background: ${theme.semantic.dangerHover};
    }
  `
      : `
    background: ${theme.border.light};
    color: ${theme.text.muted};
    &:hover {
      background: ${theme.border.medium};
      color: ${theme.text.tertiary};
    }
  `}

  &:active {
    transform: scale(0.98);
  }
`;

const MenuTrigger = styled(Menu.Trigger)`
  display: flex;
  align-items: center;
  gap: clamp(4px, 0.5vw, 6px);
  padding: 0;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  color: ${({ theme }) => theme.text.hint};
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
    color: ${({ theme }) => theme.text.muted};

    &::after {
      transform: scaleX(1);
    }
  }

  &:active {
    transform: scale(0.98);
  }
`;

const MenuPositioner = styled(Menu.Positioner)`
  z-index: 100;
`;

const MenuPopup = styled(Menu.Popup)`
  background: ${({ theme }) => theme.surface.popover};
  backdrop-filter: blur(12px);
  border: 1px solid ${({ theme }) => theme.border.light};
  border-radius: 12px;
  padding: 8px;
  min-width: 180px;
  box-shadow:
    0 8px 32px ${({ theme }) => theme.shadow.medium},
    0 2px 8px ${({ theme }) => theme.shadow.light};
  animation: menuIn 0.15s ease-out;

  @keyframes menuIn {
    from {
      opacity: 0;
      transform: translateY(-8px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;

const MenuItem = styled(Menu.Item)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
  color: ${({ theme }) => theme.text.tertiary};
  font-family: "Instrument Sans", sans-serif;
  font-size: 13px;
  font-weight: 500;
  outline: none;
  user-select: none;

  &:hover {
    background: ${({ theme }) => theme.border.light};
    color: ${({ theme }) => theme.text.primary};
  }

  &[data-highlighted] {
    background: ${({ theme }) => theme.border.light};
    color: ${({ theme }) => theme.text.primary};
  }
`;

const MenuSeparator = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.border.light};
  margin: 8px 0;
`;

const MenuItemIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  
  svg {
    width: 100%;
    height: 100%;
  }
`;

const ExportTriggerContent = styled.div<{ $isSuccess?: boolean }>`
  display: flex;
  align-items: center;
  gap: clamp(4px, 0.5vw, 6px);
  color: ${({ $isSuccess, theme }) => ($isSuccess ? theme.semantic.success : "inherit")};
`;

interface ActionBarProps {
  keyboardRef: React.RefObject<HTMLDivElement | null>;
}

export function ActionBar({ keyboardRef }: ActionBarProps) {
  const { mappings, resetToDefaults } = useMappingContext();
  const { currentLayer, setLayer } = useLayerContext();
  const [copied, setCopied] = useState(false);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleCopyMarkdown = useCallback(async () => {
    const markdown = generateMappingsMarkdown(mappings, macbookLayout);

    if (!markdown) {
      return;
    }

    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setMenuOpen(false);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      console.error("Failed to copy to clipboard");
    }
  }, [mappings]);

  const downloadImage = (dataUrl: string, filename: string) => {
    const link = document.createElement("a");
    link.download = filename;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const captureLayer = useCallback(
    async (layer: LayerType): Promise<string | null> => {
      if (!keyboardRef.current) return null;

      // Switch to the target layer
      setLayer(layer);

      // Wait for render with a small delay
      await new Promise((resolve) => requestAnimationFrame(resolve));
      await new Promise((resolve) => setTimeout(resolve, 100));

      try {
        const dataUrl = await toPng(keyboardRef.current, {
          pixelRatio: 2,
          cacheBust: true,
        });
        return dataUrl;
      } catch (error) {
        console.error(`Failed to capture ${layer} layer:`, error);
        return null;
      }
    },
    [keyboardRef, setLayer],
  );

  const handleSaveImages = useCallback(async () => {
    if (!keyboardRef.current) return;

    const originalLayer = currentLayer;
    setMenuOpen(false);

    try {
      // Capture hyper layer
      const hyperDataUrl = await captureLayer("hyper");
      if (hyperDataUrl) {
        downloadImage(hyperDataUrl, "mac-keyboard-hyper.png");
      }

      // Small delay between downloads
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Capture command layer
      const commandDataUrl = await captureLayer("command");
      if (commandDataUrl) {
        downloadImage(commandDataUrl, "mac-keyboard-command.png");
      }
    } finally {
      // Always restore original layer
      await new Promise((resolve) => setTimeout(resolve, 300));
      setLayer(originalLayer);
    }
  }, [keyboardRef, currentLayer, captureLayer, setLayer]);

  return (
    <ActionBarContainer>
      <CreditsLink href="https://tigershen.com" target="_blank" rel="noopener noreferrer">
        🐯
      </CreditsLink>

      <Divider />

      <Menu.Root open={menuOpen} onOpenChange={setMenuOpen}>
        <MenuTrigger data-testid="export-button">
          <ExportTriggerContent $isSuccess={copied}>
            <ButtonIcon>{copied ? <CheckIcon /> : <DownloadIcon />}</ButtonIcon>
            <ButtonLabel>{copied ? "Copied!" : "Export"}</ButtonLabel>
            <ButtonIcon style={{ width: "10px", height: "10px", marginLeft: "2px" }}>
              <ChevronDownIcon />
            </ButtonIcon>
          </ExportTriggerContent>
        </MenuTrigger>
        <Menu.Portal>
          <MenuPositioner sideOffset={8} align="end">
            <MenuPopup>
              <MenuItem onClick={handleCopyMarkdown} data-testid="export-copy-option">
                <MenuItemIcon>
                  <CopyIcon />
                </MenuItemIcon>
                Copy as Markdown
              </MenuItem>
              <MenuSeparator />
              <MenuItem onClick={handleSaveImages} data-testid="export-images-option">
                <MenuItemIcon>
                  <DownloadIcon />
                </MenuItemIcon>
                Save as Images
              </MenuItem>
            </MenuPopup>
          </MenuPositioner>
        </Menu.Portal>
      </Menu.Root>

      <Dialog.Root open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
        <Dialog.Trigger render={<ActionButton data-testid="reset-button" />}>
          <ButtonIcon>
            <ResetIcon />
          </ButtonIcon>
          <ButtonLabel>Reset</ButtonLabel>
        </Dialog.Trigger>
        <Dialog.Portal>
          <DialogBackdrop />
          <DialogPopup title="Reset confirmation dialog">
            <DialogTitle>Reset to Defaults?</DialogTitle>
            <DialogDescription>
              This will replace all your current keyboard mappings with the default configuration. This action cannot be
              undone.
            </DialogDescription>
            <DialogActions>
              <Dialog.Close render={<DialogButton $variant="secondary" data-testid="cancel-reset-button" />}>
                Cancel
              </Dialog.Close>
              <DialogButton
                $variant="danger"
                data-testid="confirm-reset-button"
                onClick={() => {
                  resetToDefaults();
                  setResetDialogOpen(false);
                }}
              >
                Reset
              </DialogButton>
            </DialogActions>
          </DialogPopup>
        </Dialog.Portal>
      </Dialog.Root>
    </ActionBarContainer>
  );
}
