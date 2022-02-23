// Modules to control application life and create native browser window
const {app, BrowserWindow,session} = require('electron');
const {autoUpdater} = require("electron-updater");
const log = require('electron-log');


const express = require('express');
var history = require('connect-history-api-fallback');
//const ses = session.fromPartition('persist:sulibraryarchive')

let currentSession = null;
//currentSession=session.fromPartition('persist:sulibraryarchive').cookies;

const server = express();


const path = require('path')
const url = require("url");

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    autoHideMenuBar: true,
    icon: path.join(__dirname,`../src/assets/icons/android-chrome-512x512.png`),
    
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true
    }
  })

 //mainWindow.webContents.userAgent = "Electron_profile";
 mainWindow.loadURL(`https://su-library-archive.firebaseapp.com/`);

  // and load the index.html of the app.
 // mainWindow.loadURL();

  // Open the DevTools.
   mainWindow.webContents.openDevTools()
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