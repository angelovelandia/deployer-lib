#!/usr/bin/env node

(async () => {
  const inquirer = require("inquirer");
  const { exec } = require("child_process");
  const chalk = (await import("chalk")).default;
  const ora = (await import("ora")).default;
  const logSymbols = (await import("log-symbols")).default;

  // Function to execute commands with promises
  const execCommand = (command) => {
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          reject({ error, stderr });
        } else {
          resolve(stdout);
        }
      });
    });
  };

  // Questions to the user
  inquirer
    .prompt([
      {
        type: "list",
        name: "packageManager",
        message: "What do you prefer to use to compile the project?",
        choices: ["npm", "yarn"],
      },
      {
        type: "input",
        name: "remotePath",
        message: "Enter the remote path:",
      },
      {
        type: "input",
        name: "buildPath",
        message: "Enter the local path of the build (example: build/):",
        default: "build/",
      },
      {
        type: "confirm",
        name: "uploadImages",
        message:
          "Do you want to upload images (jpg, jpeg, png, gif, svg, webp)?",
        default: true,
      },
    ])
    .then(async (answers) => {
      const { packageManager, remotePath, buildPath, uploadImages } = answers;
      const archiveName = "build.tar.gz";
      const fullRemotePath = `${remotePath}`;
      const spinner = ora();

      // Command to compile the project
      const buildCommand =
        packageManager === "npm" ? "npm run build" : "yarn build";

      // Start the compilation process
      spinner.start(
        chalk.blue(`Starting the compilation with ${packageManager}...`)
      );

      try {
        await execCommand(buildCommand);
        spinner.succeed(
          logSymbols.success + chalk.green(" Successful compilation.")
        );
      } catch (error) {
        spinner.fail(
          logSymbols.error + chalk.red(" Error during compilation:")
        );
        console.error(chalk.red(error.stderr));
        return;
      }

      // If you do not want to upload images, apply the exclusion of images
      const excludeImagesOption = !uploadImages
        ? "--exclude='*.jpg' --exclude='*.jpeg' --exclude='*.png' --exclude='*.gif' --exclude='*.svg' --exclude='*.webp'"
        : "";

      // Compress build
      spinner.start(chalk.blue("Compressing the build directory..."));

      const compressCommand = `cd ${buildPath} && tar -czvf ${archiveName} ${excludeImagesOption} *`;
      try {
        await execCommand(compressCommand);
        spinner.succeed(
          logSymbols.success + chalk.green(" Build successfully compressed.")
        );
      } catch (error) {
        spinner.fail(
          logSymbols.error + chalk.red(" Error compressing the build:")
        );
        console.error(chalk.red(error.stderr));
        return;
      }

      // Copy to remote path
      spinner.start(
        chalk.blue(`Copying ${archiveName} to the remote route...`)
      );

      const copyCommand = `cp -Rf ${buildPath}${archiveName} "${fullRemotePath}"`;
      try {
        await execCommand(copyCommand);
        spinner.succeed(
          logSymbols.success + chalk.green(" File copied successfully.")
        );
      } catch (error) {
        spinner.fail(
          logSymbols.error + chalk.red(" Error copying file to remote path:")
        );
        console.error(chalk.red(error.stderr));
        return;
      }

      // Unzip to remote path
      spinner.start(chalk.blue("Unzipping the file to the remote path..."));

      const decompressCommand = `cd "${fullRemotePath}" && tar -xzvf ${archiveName}`;
      try {
        await execCommand(decompressCommand);
        spinner.succeed(
          logSymbols.success +
            chalk.green(" Deployment successfully completed.")
        );
      } catch (error) {
        spinner.fail(
          logSymbols.error + chalk.red(" Error decompressing to remote path:")
        );
        console.error(chalk.red(error.stderr));
        return;
      }
    });
})();
