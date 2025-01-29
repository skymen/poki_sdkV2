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

export const publishConfig = {
  addonUrl: "",
  autoGenReadme: true,
};
