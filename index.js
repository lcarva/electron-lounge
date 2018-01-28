"use strict";

const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let mainWindow;

function createWindow() {
	// lol
	process.argv.push("start");
	process.argv.push("--private");
	process.argv.push("--host");
	process.argv.push("127.0.0.1");

	require("thelounge");

	checkUser();

	mainWindow = new BrowserWindow({
		width: 800,
		height: 600
	});

	mainWindow.setMenu(null);

	mainWindow.loadURL("http://127.0.0.1:9000/");

	mainWindow.on("closed", () => {
		mainWindow = null;
	});

	const handleRedirect = (e, url) => {
		if (url !== mainWindow.webContents.getURL()) {
			e.preventDefault();
			electron.shell.openExternal(url);
		}
	};

	mainWindow.webContents.on("will-navigate", handleRedirect);
	mainWindow.webContents.on("new-window", handleRedirect);
}

function checkUser() {
	const manager = require("./node_modules/thelounge/src/clientManager");

	const users = manager.prototype.getUsers();

	if (!users.length) {
		electron.dialog.showMessageBox({
			type: "warning",
			buttons: ["OK"],
			message: "There are currently no users. Create one with lounge add <name>."
		});
	}
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
	// On OS X it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== "darwin") {
		app.quit();
	}
});

app.on("activate", () => {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (mainWindow === null) {
		createWindow();
	}
});
