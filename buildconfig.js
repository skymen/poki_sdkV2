// Fail if language files in extra lang are missing keys or have extra keys
export const failOnMalformedExtraLang = true;

// Post build cleanup configuration
export const cleanup = {
  keepExport: false,
  keepExportStep: false,
  keepGenerated: false,
  disableTip: false,
};

export const failOnUnusedFiles = true;

export const disableTips = false;

export const disableWarnings = false;

// Terser validation configuration
// Options: "error" (fail build), "warning" (show warning but continue), "skip" (disable check)
export const terserValidation = "error";

export const publishConfig = {
  addonUrl: "https://www.construct.net/en/make-games/addons/1409/poki",
  itchioPage: "", // Format: "username/page-id" (taken from https://username.itch.io/page-id)
  autoGenReadme: true,
};
