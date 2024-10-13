import ora from "ora";
import chalk from "chalk";
import logSymbols from "log-symbols";

const spinner = ora();

export const startSpinner = (message) => {
  spinner.start(chalk.blue(message));
};

export const succeedSpinner = (message) => {
  spinner.succeed(logSymbols.success + chalk.green(message));
};

export const failSpinner = (message) => {
  spinner.fail(logSymbols.error + chalk.red(message));
};
