// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron');

const express = require('express');
var history = require('connect-history-api-fallback');
const server = express();


const path = require('path')
const url = require("url");

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true
    }
  })
let middleware=express.static(path.join(__dirname,`../dist` ));
server.use(middleware);
server.use(history({
  index: "/index.html"
}));
server.use(middleware);


const infos = server.listen(0, 'localhost', () => mainWindow.loadURL(`http://localhost:${infos.address().port}/index.html`));
  // and load the index.html of the app.
 // mainWindow.loadURL();

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})