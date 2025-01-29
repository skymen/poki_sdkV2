import fs from "fs";
import path from "path";
export default function removeDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    return;
  }
  let files = fs.readdirSync(dirPath);
  for (let file of files) {
    let filePath = path.join(dirPath, file);
    if (fs.lstatSync(filePath).isDirectory()) {
      removeDir(filePath);
    } else {
      fs.unlinkSync(filePath);
    }
  }
  fs.rmdirSync(dirPath);
}
