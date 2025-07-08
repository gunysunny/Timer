const { app, BrowserWindow, ipcMain, globalShortcut } = require('electron');
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
      preload: path.join(__dirname, 'preload.js'), // Electron ↔ React 연동용 프리로드 스크립트
    },
  });

  // React 빌드 결과물 띄우기
  win.loadFile(path.join(__dirname, '../dist/index.html'));

  // 개발 시: 개발자도구 자동 열기 (주석 해제하면 됨)
  // win.webContents.openDevTools();

  // React에서 "close-window" 신호 받으면 창 닫기
  ipcMain.on('close-window', () => {
    win.close();
  });

  // 전역 단축키(F1, F2, F3) 등록
  app.whenReady().then(() => {
    // 1번 파티원: F1
    globalShortcut.register('F1', () => {
      win.webContents.send('global-hotkey', 0);
    });
    // 2번 파티원: F2
    globalShortcut.register('F2', () => {
      win.webContents.send('global-hotkey', 1);
    });
    // 3번 파티원: F3
    globalShortcut.register('F3', () => {
      win.webContents.send('global-hotkey', 2);
    });
  });
}

// 앱 시작 시 창 띄우기
app.whenReady().then(createWindow);

// 윈도우/리눅스에서 모든 창 닫히면 앱 종료
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// 맥에서 독(아이콘) 클릭 등으로 앱 재실행 시 새 창 띄움
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// 앱 종료 전 모든 전역 단축키 해제
app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});