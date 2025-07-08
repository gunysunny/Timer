const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 400,
    height: 350,
    alwaysOnTop: true, // 항상 위에
    resizable: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    // frame: false, // (원하면 창 테두리 제거)
    transparent: true, // (원하면 배경 투명)
  });

  // 리액트 앱 빌드 결과물을 불러옴
  win.loadFile(path.join(__dirname, '../dist/index.html'));

  // 개발용: DevTools 자동 열기
  // win.webContents.openDevTools();
}

app.whenReady().then(createWindow);

// 맥 대응
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});