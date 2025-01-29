import fs from "fs";
import {
  description,
  id,
  name,
  author,
  addonType,
  info,
} from "../config.caw.js";
import { fromCommandLine } from "./chalkUtils.js";
import fromConsole from "./fromConsole.js";

export default function exportProjectData() {
  const projectData = {
    id,
    name,
    description,
    author,
    addonType,
    iconPath: info.icon || "icon.svg",
    timeStamp: Date.now(),
  };

  fs.writeFileSync("../template/projectData.json", JSON.stringify(projectData));
}

if (fromConsole(import.meta.url)) {
  fromCommandLine();
  exportProjectData();
}
