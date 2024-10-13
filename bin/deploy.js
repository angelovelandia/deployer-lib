#!/usr/bin/env node

import chalk from "chalk";
import path from "path";
import { ARCHIVE_NAME } from "../utils/config.js";
import { failSpinner, startSpinner, succeedSpinner } from "../utils/spinner.js";
import { execCommand } from "../utils/execCommand.js";
import askQuestions from "../questions/inquirerPrompts.js";
import { extractTar } from "../helpers/extrac-tar-helper.js";

async function startDeploy() {
  const answers = await askQuestions();
  const { packageManager, remotePath, buildPath, uploadImages } = answers;

  const archiveName = ARCHIVE_NAME;
  const fullRemotePath = `${remotePath}`;

  // Command to compile the project
  const buildCommand =
    packageManager === "npm" ? "npm run build" : "yarn build";

  // Compilation process
  startSpinner(`Starting the compilation with ${packageManager}...`);

  try {
    await execCommand(buildCommand);
    succeedSpinner(" Successful compilation.");
  } catch (error) {
    failSpinner(" Error during compilation:");
    console.error(chalk.red(error.stderr));
    return;
  }

  // Excluir imágenes si el usuario no quiere subirlas
  const excludeImagesOption = !uploadImages
    ? "--exclude='*.jpg' --exclude='*.jpeg' --exclude='*.png' --exclude='*.gif' --exclude='*.svg' --exclude='*.webp'"
    : "";

  // Exclude images if the user does not want to upload them
  startSpinner(" Compressing the build directory...");

  const compressCommand = `cd ${buildPath} && tar -czvf ${archiveName} ${excludeImagesOption} *`;
  try {
    await execCommand(compressCommand);
    succeedSpinner(" Build successfully compressed.");
  } catch (error) {
    failSpinner(" Error compressing the build:");
    console.error(chalk.red(error.stderr));
    return;
  }

  // Copy to server
  startSpinner(` Copying ${archiveName} to the remote route...`);

  const copyCommand = `cp -Rf ${buildPath}/${archiveName} "${fullRemotePath}"`;
  try {
    await execCommand(copyCommand);
    succeedSpinner(" File copied successfully.");
  } catch (error) {
    failSpinner(" Error copying file to remote path:");
    console.error(chalk.red(error.stderr));
    return;
  }

  // Verify that the file exists before decompressing
  const checkFileExistsCommand = `ls -l "${fullRemotePath}"`;
  let aa = await execCommand(checkFileExistsCommand);
  console.log("🚀 ~ startDeploy ~ aa:", aa);

  // Unzip on the server
  startSpinner(" Unzipping the file to the remote path...");

  try {
    const absoluteArchivePath = path.join(fullRemotePath, archiveName);
    await extractTar(absoluteArchivePath, fullRemotePath);
    succeedSpinner(" Deployment successfully completed.");
  } catch (error) {
    console.log(error);
    failSpinner(" Error decompressing to remote path:");
    console.error(chalk.red(error.stderr));
    return;
  }
}

startDeploy();
