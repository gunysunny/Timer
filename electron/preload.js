const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('electronAPI', {
  closeWindow: () => ipcRenderer.send('close-window'),
  onGlobalHotkey: (callback) => ipcRenderer.on('global-hotkey', (event, idx) => callback(idx))
});