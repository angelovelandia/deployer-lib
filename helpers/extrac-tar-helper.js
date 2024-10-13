import { createReadStream } from "fs";
import { extract } from "tar";

export const extractTar = async (archivePath, destPath) => {
  return new Promise((resolve, reject) => {
    createReadStream(archivePath)
      .pipe(extract({ cwd: destPath }))
      .on("finish", resolve)
      .on("error", reject);
  });
};
