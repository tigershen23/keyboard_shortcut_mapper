import type { LayerMappings } from "../types";

export const defaultMappings: LayerMappings = {
  hyper: [
    { keyId: "z", action: "Chrome", appName: "Google Chrome" },
    { keyId: "a", action: "ChatGPT Atlas", appName: "ChatGPT Atlas" },
    { keyId: "d", action: "Cursor", appName: "Cursor" },
    { keyId: "f", action: "Slack", appName: "Slack" },
    { keyId: "g", action: "Messages", appName: "Messages" },
    { keyId: "h", action: "Superhuman", appName: "Superhuman" },
    { keyId: "j", action: "Trello", appName: "Trello" },
    { keyId: "k", action: "Obsidian", appName: "Obsidian" },
    { keyId: "l", action: "Notes", appName: "Raycast" },
    { keyId: "semicolon", action: "ChatGPT", appName: "ChatGPT" },
    { keyId: "quote", action: "Raycast AI", appName: "Raycast" },
    { keyId: "q", action: "Ghostty", appName: "Ghostty" },
    { keyId: "w", action: "Figma", appName: "Figma" },
    { keyId: "e", action: "Spotify", appName: "Spotify" },
    { keyId: "r", action: "Vimcal", appName: "Vimcal" },
    { keyId: "t", action: "Linear", appName: "Linear" },
    { keyId: "bracket-right", action: "Anki", appName: "Anki" },
    { keyId: "y", action: "Bitwarden", appName: "Bitwarden" },
  ],
  command: [
    { keyId: "l", action: "Lock", description: "Lock screen" },
    { keyId: "s", action: "Sleep", description: "Sleep display" },
    { keyId: "m", action: "Mute", description: "Toggle mute" },
    { keyId: "p", action: "Play", description: "Play/Pause media" },
    { keyId: "n", action: "Next", description: "Next track" },
    { keyId: "b", action: "Back", description: "Previous track" },
    { keyId: "u", action: "Vol +", description: "Volume up" },
    { keyId: "d", action: "Vol -", description: "Volume down" },
  ],
};
