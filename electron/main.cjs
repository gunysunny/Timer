const { app, BrowserWindow, ipcMain, globalShortcut } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 400, height: 350, alwaysOnTop: true, resizable: true, transparent: true, frame: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  win.loadFile(path.join(__dirname, '../dist/index.html'));

  ipcMain.on('close-window', () => {
    win.close();
  });

  // 🔥 전역 단축키(F1/F2/F3) 등록
  app.whenReady().then(() => {
    globalShortcut.register('F1', () => {
      win.webContents.send('global-hotkey', 0);
    });
    globalShortcut.register('F2', () => {
      win.webContents.send('global-hotkey', 1);
    });
    globalShortcut.register('F3', () => {
      win.webContents.send('global-hotkey', 2);
    });
  });
}
app.whenReady().then(createWindow);
app.on('will-quit', () => { globalShortcut.unregisterAll(); });
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
