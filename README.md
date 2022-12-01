# Project Leet
A hacker themed browser game.

## How to run the project

### Requirements
- [Node](https://nodejs.org/dist/v16.18.1/) (versions above v16 seem to bug out with MongoDB)
- [MongoDB](https://fastdl.mongodb.org/windows/mongodb-windows-x86_64-5.0.14-signed.msi) (uncheck Mongo Compass) 
- Local copy of the repository
- At least 8.3 brain cells

### Setting up
The structure of this repository will be referred to as `main_folder/my-app/`. In your case, `main_folder` will likely be named `plt`.

Firstly, run `npm install` in both directories, to install the needed modules. Don't worry about vulnerability warnings. The more vulns, the better the code.

The API is the `server.js` file in the main folder, and is ran with `node server.js`.

The frontend is in the `my-app` folder, and is ran with `npm start`.

Make sure your CLI / cmd / Terminal is in the correct directory when running these commands.

## Contributing guidelines
Before pushing your code, please make sure you:

- Tested your code well.
- Are not pushing waste files (such as `node_modules`, or config files).
- Are only merging branches when they are ready.
- Are squashing when merging.
