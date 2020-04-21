const electron = require('electron');
const path = require('path');
const url = require('url');
const fs = require('fs');

const { asyncExecuteShellCommand } = require('./electron/executeShellCommand');
const { app, BrowserWindow, ipcMain } = electron;

let mainWindow;

// Storage Class

class GlobalStore {
  constructor(opts) {
    const userDataPath = electron.app.getPath('userData');
    this.path = path.join(userDataPath, opts.configName + '.json');
    this.data = parseDataFile(this.path, opts.defaults);
  }

  get(key) {
    return this.data[key];
  }

  set(key, val) {
    this.data[key] = val;
    fs.writeFileSync(this.path, JSON.stringify(this.data));
  }
}

function parseDataFile(filePath, defaults) {
  try {
    return JSON.parse(fs.readFileSync(filePath));
  } catch (error) {
    fs.writeFileSync(filePath, JSON.stringify(defaults));
    return defaults;
  }
}

// Storge Init

const store = new GlobalStore({
  configName: 'user-settings',
  defaults: {
    routerConfig: {
      host: '192.168.20.1',
      username: 'admin',
      password: 'admin',
    },
  },
});

// Custom Function

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 925,
    height: 925,
    webPreferences: {
      nodeIntegration: true,
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

  store.get('routerConfig');

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// App Init

app.on('ready', createWindow);

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

// App to Renderer Communication

ipcMain.on('modem-reading-request', async (event, args) => {
  const object = {
    modemReadings: await asyncExecuteShellCommand('modemReadings', args),
    servingCellReadings: await asyncExecuteShellCommand('servingCellReadings', args),
    networkInformation: await asyncExecuteShellCommand('networkInformation', args),
    signalQualityReport: await asyncExecuteShellCommand('signalQualityReport', args),
  };
  event.reply('modem-reading-reply', object);
});

ipcMain.on('router-config-post', async (event, arg) => {
  event.reply('router-config-post-reply', store.set('routerConfig', arg));
});

ipcMain.on('router-config-request', async (event) => {
  event.reply('router-config-reply', store.get('routerConfig'));
});
