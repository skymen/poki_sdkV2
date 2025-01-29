import build from "./build.js";

build([
  "./preCleanup.js",
  "./updateProjectData.js",
  "./validateAddonConfig.js",
  "./runAceDefiner.js",
  "./generateAceFiles.js",
  "./validateAceConfigs.js",
  "./generateComboEnums.js",
  "./buildstepWebpack.js",
  "./generateAcesJSON.js",
  "./generateAddonJSON.js",
  "./generateLangJSON.js",
  "./exportWebpack.js",
  "./buildDomside.js",
  "./processDependencies.js",
  "./validateIcon.js",
]).then((hadError) => {
  if (hadError) process.exit(1);
  else process.exit(0);
});
