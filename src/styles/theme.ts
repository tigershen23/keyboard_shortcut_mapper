export interface GradientColors {
  start: string;
  end: string;
}

export interface LayerColors {
  accent: string;
  ripple: string;
  glow: string | null;
}

export interface Theme {
  surface: {
    page: string;
    key: GradientColors;
    keyFunction: GradientColors;
    keySpace: GradientColors;
    keyHover: GradientColors;
    keyFunctionHover: GradientColors;
    keySpaceHover: GradientColors;
    keyActive: GradientColors;
    keyDimmed: GradientColors;
    keyDimmedHover: GradientColors;
    popover: string;
    dialog: string;
    frame: GradientColors;
  };

  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    muted: string;
    dimmed: string;
    hint: string;
  };

  border: {
    subtle: string;
    light: string;
    medium: string;
    focus: string;
  };

  shadow: {
    light: string;
    medium: string;
    heavy: string;
    backdrop: string;
  };

  semantic: {
    danger: string;
    dangerHover: string;
    success: string;
  };

  layers: {
    base: LayerColors;
    hyper: LayerColors;
    command: LayerColors;
  };

  mesh: {
    baseGradient: string;
    primary: string[];
    secondary: string[];
  };
}

export const darkTheme: Theme = {
  surface: {
    page: "#231418",
    key: { start: "#2c2c2e", end: "#1d1d1f" },
    keyFunction: { start: "#2a2a2c", end: "#1c1c1e" },
    keySpace: { start: "#2e2e30", end: "#1f1f21" },
    keyHover: { start: "#3a3a3c", end: "#2c2c2e" },
    keyFunctionHover: { start: "#383838", end: "#2a2a2c" },
    keySpaceHover: { start: "#3c3c3e", end: "#2e2e30" },
    keyActive: { start: "#252527", end: "#1a1a1c" },
    keyDimmed: { start: "#252527", end: "#1a1a1c" },
    keyDimmedHover: { start: "#2a2a2c", end: "#1e1e20" },
    popover: "rgba(28, 28, 32, 0.95)",
    dialog: "#1a1614",
    frame: { start: "#d8d8dc", end: "#acacb0" },
  },

  text: {
    primary: "#ffffff",
    secondary: "rgba(255, 255, 255, 0.95)",
    tertiary: "rgba(255, 255, 255, 0.9)",
    muted: "rgba(255, 255, 255, 0.6)",
    dimmed: "rgba(255, 255, 255, 0.4)",
    hint: "rgba(255, 255, 255, 0.25)",
  },

  border: {
    subtle: "rgba(255, 255, 255, 0.05)",
    light: "rgba(255, 255, 255, 0.1)",
    medium: "rgba(255, 255, 255, 0.12)",
    focus: "rgba(255, 255, 255, 0.35)",
  },

  shadow: {
    light: "rgba(0, 0, 0, 0.2)",
    medium: "rgba(0, 0, 0, 0.3)",
    heavy: "rgba(0, 0, 0, 0.5)",
    backdrop: "rgba(0, 0, 0, 0.6)",
  },

  semantic: {
    danger: "rgba(220, 80, 80, 0.9)",
    dangerHover: "rgba(220, 80, 80, 1)",
    success: "rgba(120, 220, 150, 0.85)",
  },

  layers: {
    base: {
      accent: "rgba(255, 255, 255, 0.6)",
      ripple: "rgba(160, 160, 170, 0.4)",
      glow: null,
    },
    hyper: {
      accent: "rgba(100, 180, 160, 0.85)",
      ripple: "rgba(100, 180, 160, 0.5)",
      glow: "rgba(100, 180, 160, 0.15)",
    },
    command: {
      accent: "rgba(200, 140, 120, 0.85)",
      ripple: "rgba(200, 140, 120, 0.5)",
      glow: "rgba(200, 140, 120, 0.15)",
    },
  },

  mesh: {
    baseGradient: "linear-gradient(170deg, #1a1410 0%, #12100c 35%, #14100e 60%, #1a1215 80%, #231418 100%)",
    primary: [
      "radial-gradient(ellipse 60% 50% at 15% 25%, rgba(180, 90, 50, 0.5) 0%, transparent 70%)",
      "radial-gradient(ellipse 50% 60% at 85% 15%, rgba(200, 120, 60, 0.4) 0%, transparent 65%)",
      "radial-gradient(ellipse 70% 50% at 75% 75%, rgba(160, 70, 90, 0.45) 0%, transparent 70%)",
      "radial-gradient(ellipse 50% 50% at 5% 70%, rgba(140, 100, 50, 0.35) 0%, transparent 65%)",
      "radial-gradient(ellipse 100% 60% at 50% 100%, rgba(100, 50, 70, 0.5) 0%, transparent 70%)",
    ],
    secondary: [
      "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(190, 100, 70, 0.2) 0%, transparent 65%)",
      "radial-gradient(ellipse 50% 60% at 25% 60%, rgba(170, 130, 60, 0.18) 0%, transparent 60%)",
      "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(120, 60, 70, 0.3) 0%, transparent 65%)",
    ],
  },
};
