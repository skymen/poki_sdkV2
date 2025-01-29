import url from "url";
export default function (moduleUrl) {
  return url.fileURLToPath(moduleUrl) === process.argv[1];
}
