import fs from "fs";
import { execSync, exec } from "child_process";
import version from "../version.js";
import * as chalkUtils from "./chalkUtils.js";
import fromConsole from "./fromConsole.js";

export default function publish(type) {
  chalkUtils.step("Publishing addon");

  // check type is major, minor, patch, revision or a version with the format x.x.x.x
  let newVersion = "";
  if (
    type === "major" ||
    type === "minor" ||
    type === "patch" ||
    type === "revision"
  ) {
    const versionParts = version.split(".");
    const versionType = ["major", "minor", "patch", "revision"].indexOf(type);
    versionParts[versionType]++;
    for (let i = versionType + 1; i < versionParts.length; i++) {
      versionParts[i] = 0;
    }
    newVersion = versionParts.join(".");
  } else if (/^\d+\.\d+\.\d+\.\d+$/.test(type)) {
    newVersion = type;
  } else if (!type) {
    newVersion = version;
  } else {
    chalkUtils.error(
      "Invalid version type\n" +
        chalkUtils._errorUnderline(
          "Please use major, minor, patch, revision or a version with the format x.x.x.x"
        )
    );
    return true;
  }
  // update version.js
  const versionFile = `../version.js`;
  const versionContent = `export default "${newVersion}";`;
  fs.writeFileSync(versionFile, versionContent);

  chalkUtils.step("Building addon");

  // commit changes
  process.env.FORCE_COLOR = "1";
  let build = exec(`npm run build`);
  build.stdout.pipe(process.stdout);
  build.stderr.pipe(process.stderr);
  build.on("exit", (code) => {
    if (code !== 0) {
      chalkUtils.failed("Build failed");
      return;
    }

    chalkUtils.newLine();
    chalkUtils.divider();
    chalkUtils.step("Pushing addon to git");
    execSync(`git add -A`);
    try {
      // if there are no changes, don't commit
      execSync(`git commit -m "Version ${newVersion}"`);
    } catch (e) {
      chalkUtils.info("No changes to commit");
      return;
    }
    execSync(`git push`);

    chalkUtils.newLine();
    chalkUtils.divider();
    chalkUtils.success(`Version ${newVersion} published`);
    chalkUtils.newLine();
  });
}

if (fromConsole(import.meta.url)) {
  publish(process.argv[2]);
}
