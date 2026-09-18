const { app, BrowserWindow, session, protocol, net } = require('electron');
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

  // --- ADD THESE 4 LINES ---
  protocol.handle('file', (req) => {
    const filePath = req.url.split('dist/')[1] || req.url.split('_astro/')[1];
    return net.loadFromFile(path.join(__dirname, 'dist', filePath.includes('_astro') ? filePath : '_astro/' + filePath));
  });
  // -------------------------

  // Load your compiled Astro output cleanly using relative base paths
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