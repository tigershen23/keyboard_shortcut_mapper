import { Dialog } from "@base-ui-components/react/dialog";
import { useState } from "react";
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

function ResetIcon() {
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
			<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
			<path d="M3 3v5h5" />
		</svg>
	);
}

export function ActionBar() {
	const { mappings, resetToDefaults } = useMappingContext();
	const [copied, setCopied] = useState(false);
	const [resetDialogOpen, setResetDialogOpen] = useState(false);

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
			<CreditsLink
				href="https://tigershen.com"
				target="_blank"
				rel="noopener noreferrer"
				title="Credits link to tigershen.com"
			>
				🐯
			</CreditsLink>

			<Divider />

			<ActionButton
				onClick={handleCopy}
				$isSuccess={copied}
				title={
					copied ? "Copied mappings to clipboard" : "Copy mappings to clipboard"
				}
			>
				<ButtonIcon>{copied ? <CheckIcon /> : <CopyIcon />}</ButtonIcon>
				<ButtonLabel>{copied ? "Copied!" : "Copy"}</ButtonLabel>
			</ActionButton>

			<Dialog.Root open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
				<Dialog.Trigger
					render={<ActionButton title="Reset mappings to defaults" />}
				>
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
							This will replace all your current keyboard mappings with the
							default configuration. This action cannot be undone.
						</DialogDescription>
						<DialogActions>
							<Dialog.Close
								render={
									<DialogButton $variant="secondary" title="Cancel reset" />
								}
							>
								Cancel
							</Dialog.Close>
							<DialogButton
								$variant="danger"
								title="Confirm reset to defaults"
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
