import inquirer from "inquirer";

import {
  saveAnswers,
  loadAnswers,
  askToUseExistingConfig,
} from "../utils/saveLoadAnswers.js";

export default async function askQuestions() {
  const previousAnswers = loadAnswers();
  const useExisting = await askToUseExistingConfig(previousAnswers);

  if (useExisting) {
    console.log("Using the existing configuration:", previousAnswers);
    return previousAnswers;
  }

  const questions = [
    {
      type: "list",
      name: "packageManager",
      message: "What do you prefer to use to compile the project?",
      choices: ["npm", "yarn"],
      default: previousAnswers.packageManager || "npm",
    },
    {
      type: "input",
      name: "remotePath",
      message: "Enter the remote path:",
      default: previousAnswers.remotePath || "",
    },
    {
      type: "input",
      name: "buildPath",
      message: "Enter the local path of the build (example: build):",
      default: previousAnswers.buildPath || "build",
    },
    {
      type: "confirm",
      name: "uploadImages",
      message: "Do you want to upload images (jpg, jpeg, png, gif, svg, webp)?",
      default:
        previousAnswers.uploadImages !== undefined
          ? previousAnswers.uploadImages
          : true,
    },
  ];

  const newAnswers = await inquirer.prompt(questions);
  saveAnswers(newAnswers);

  return newAnswers;
}
