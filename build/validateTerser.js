import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { minify } from "terser";
import * as chalkUtils from "./chalkUtils.js";
import fromConsole from "./fromConsole.js";
import { terserValidation } from "../buildconfig.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function validateTerser() {
  // Check if validation is skipped
  if (terserValidation === "skip") {
    chalkUtils.info(
      "Terser validation is disabled (terserValidation = 'skip')"
    );
    return false;
  }

  chalkUtils.step("Validating Terser build (mangle-props keep_quoted)");

  const filesToCheck = [
    "../dist/export/c3runtime/main.js",
    "../dist/export/editor.js",
  ];

  let hadError = false;

  for (const file of filesToCheck) {
    const absolutePath = path.resolve(__dirname, file);
    if (!fs.existsSync(absolutePath)) {
      chalkUtils.info(`Skipping ${file} as it does not exist.`);
      continue;
    }

    try {
      const code = fs.readFileSync(absolutePath, "utf8");
      const result = await minify(code, {
        mangle: {
          properties: {
            keep_quoted: true,
          },
        },
        compress: {
          dead_code: true,
          drop_console: false,
          drop_debugger: true,
          keep_classnames: false,
          keep_fargs: true,
          keep_fnames: false,
          keep_infinity: false,
        },
      });

      if (result.error) {
        throw result.error;
      }
      chalkUtils.success(`Terser validation passed for ${file}`);
    } catch (error) {
      if (terserValidation === "warning") {
        chalkUtils.warning(`Terser validation failed for ${file}`);
        chalkUtils.warning(error.message || error);
        hadError = true;
      } else {
        chalkUtils.error(`Terser validation failed for ${file}`);
        chalkUtils.error(error.message || error);
        hadError = true;
      }
    }
  }

  if (hadError && terserValidation === "warning") {
    chalkUtils.info("Terser validation completed with warnings.");
    return { hadOptionalError: true };
  } else if (hadError) {
    chalkUtils.failed("Terser validation failed.");
    return true;
  } else {
    chalkUtils.success("Terser validation successful!");
    return false;
  }
}

// if is being called from the command line
if (fromConsole(import.meta.url)) {
  chalkUtils.fromCommandLine();
  validateTerser();
}
