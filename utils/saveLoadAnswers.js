import chalk from "chalk";
import { writeFileSync, readFileSync, existsSync } from "fs";
import inquirer from "inquirer";

const answersFilePath = "./deployer.lib.answers.json";

// Function for saving answers
function saveAnswers(answers) {
  writeFileSync(answersFilePath, JSON.stringify(answers, null, 2));
}

// Function to load saved answers
function loadAnswers() {
  try {
    const fileContents = readFileSync(answersFilePath, "utf8");
    return JSON.parse(fileContents);
  } catch (err) {
    return {};
  }
}

// Ask whether to use the saved configuration
async function askToUseExistingConfig(existingConfig) {
  if (!existsSync(answersFilePath)) {
    return false;
  }

  const { useExistingConfig } = await inquirer.prompt([
    {
      type: "confirm",
      name: "useExistingConfig",
      message: `A previous configuration already exists: ${chalk.cyan(
        JSON.stringify(existingConfig, null, 2)
      )}\nDo you want to use it?`,
      default: true,
    },
  ]);

  return useExistingConfig;
}

export { saveAnswers, loadAnswers, askToUseExistingConfig };
