const { app, BrowserWindow, session } = require('electron');
const path = require('path');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // Auto-grant camera permissions for barcode scanning
  session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
    if (permission === 'media' || permission === 'camera') {
      callback(true);
    } else {
      callback(false);
    }
  });

  // Load your compiled Astro output (adjust path based on your Astro output config)
  mainWindow.loadFile(path.join(__dirname, 'dist/index.html'));
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.exit(0);
});