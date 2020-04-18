const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const url = require('url');
const { asyncExecuteShellCommand } = require('./electron/executeShellCommand');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 925,
    height: 925,
    webPreferences: {
      nodeIntegration: true,
      devTools: true,
    },
    resizable: false,
  });

  mainWindow.loadURL(
    process.env.ELECTRON_START_URL ||
      url.format({
        pathname: path.join(__dirname, '/../public/index.html'),
        protocol: 'file:',
        slashes: true,
      })
  );

  mainWindow.setMenu(null);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

ipcMain.on('modem-reading-request', async (event, arg) => {
  const object = {
    modemReadings: await asyncExecuteShellCommand('modemReadings'),
    servingCellReadings: await asyncExecuteShellCommand('servingCellReadings'),
    networkInformation: await asyncExecuteShellCommand('networkInformation'),
    signalQualityReport: await asyncExecuteShellCommand('signalQualityReport'),
  };
  event.reply('modem-reading-reply', object);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
