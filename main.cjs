const { app, BrowserWindow, session, protocol, net } = require('electron');
const path = require('path');
const { pathToFileURL } = require('url');

// 1. Register 'app' as a secure privileged scheme so camera hardware works
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { standard: true, secure: true, supportFetchAPI: true } }
]);

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

  // 2. Intercept app:// requests and map them cleanly to your local dist folder
  protocol.handle('app', (request) => {
    let filePath = new URL(request.url).pathname;
    if (filePath === '/' || filePath === '') filePath = '/index.html';
    
    const absolutePath = path.join(__dirname, 'dist', filePath);
    return net.fetch(pathToFileURL(absolutePath).toString());
  });

  // 3. Load via the custom protocol
  mainWindow.loadURL('app://-/index.html');
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