import { addonType, type, id, hasDomside, files } from "../config.caw.js";

export default {
  addonType,
  type,
  id,
  hasDomside,
  hasWrapperExtension: files.extensionScript?.enabled,
};
