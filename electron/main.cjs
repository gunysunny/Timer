const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 400,
    height: 350,
    alwaysOnTop: true,          // 항상 위에
    resizable: true,            // 크기 조정 가능
    transparent: true,          // 반투명 창
    frame: false,               // 상단바/창테두리 없음 (React에서 커스텀 닫기 버튼 만들어야 함)
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'), // 아래에서 만듦!
    },
  });

  win.loadFile(path.join(__dirname, '../dist/index.html'));

  // win.webContents.openDevTools(); // 개발 시 주석 해제하면 개발자도구 열림

  // React에서 "close-window" 신호 오면 닫기
  ipcMain.on('close-window', () => {
    win.close();
  });
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});