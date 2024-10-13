# Deployer Lib

![Deployer Lib](https://img.shields.io/badge/Deployer%20Lib-v5.0.4-blue.svg) ![Node.js](https://img.shields.io/badge/Node.js-v20.10.0-brightgreen.svg)

Deployer Lib is a command line tool that allows you to easily compile and deploy your frontend projects to remote paths. The library uses `npm` or `yarn` to manage dependencies and provides options to include or exclude images during deployment.

## Features

- **Automatic Compilation**: Compile your project using `npm` or `yarn`.
- **Efficient Deployment**: Transfer compiled files to a remote path.
- **Image Exclusion**: Allows the user to decide whether to upload images (jpg, jpeg, png, gif, svg, webp).
- **Beautiful Logs**: Colorful and informative console messages for a better user experience.

## Installation

To install the library globally, you can use the following command:

```bash
npm install -g deployer-lib
```

O, si prefieres usar yarn:

```bash
yarn global add deployer-lib
```
## Usage
Once the library is installed, you can run it with the following command:

```bash
npx deployer-lib
```

You will then be prompted to enter the required information:

- Select your package manager (npm or yarn).
- Enter the remote path where you want to deploy your build.
- Specify the local path of the build (default is build/).
- Decide if you want to upload images.

## Example of use

```bash
npx deployer-lib
```

```bash
What do you prefer to use to compile the project? 
> npm 
> yarn

Enter the remote route:
> /ruta/al/servidor

Enter the local path of the build (example: build/): 
> build/

Do you want to upload images (jpg, png, gif, svg)? 
> Sí
```

## Second time

If you have already uploaded your compiled file once, you can choose the previous configuration you used, which was saved on the first run in the file **deployer.lib.answers.json**

## Logs
During execution, you will see clear and colorful logs indicating the progress of each step, from compilation to deployment.

## Example of logs

```bash
Starting the compilation of the project using npm...
Compiling successfully.
Compressing the build directory...
Build compressed successfully.
Copying the compressed file to the remote path: /path/to/server...
File copied successfully.
Uncompressing the file to the remote path...
Deployment completed successfully.
```

## Contributions
If you want to contribute to Deployer Lib, feel free to open an issue or send a pull request!

I hope you find Deployer Lib useful! 🚀