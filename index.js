const { app, Menu, Tray, BrowserWindow, globalShortcut, ipcMain } = require('electron');

let tray;
let trayMenu;
let mainWin;
let iconPath = __dirname + '/icon/icon.png';
function createTray() {
    let trayMenuHeight = 70;
    tray = new Tray(iconPath);
    tray.setToolTip('数据库管理工具');
    tray.on('click', (event) => {
        mainWin.show()
    });
    tray.on('right-click', (event, pos) => {
        // console.log(pos);
        trayMenu.setPosition(pos.x, pos.y - trayMenuHeight);
        trayMenu.show();
        trayMenu.moveTop();
    });

    trayMenu = new BrowserWindow({
        icon: iconPath,
        frame: false,
        alwaysOnTop: true,
        width: 135,
        height: trayMenuHeight,
        show: false,
        resizable: false,
        skipTaskbar: true,
        transparent: true,
        webPreferences: {
            nodeIntegration: true
        }
    });
    trayMenu.on('close', (event) => {
        event.preventDefault();
        trayMenu.hide();
    });
    trayMenu.on('blur', () => {
        trayMenu.hide();
    });
    trayMenu.loadFile(__dirname + '/ui/tray-menu.html');
}

function createMainWin() {
    mainWin = new BrowserWindow({
        icon: iconPath,
        show: false,
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });
    mainWin.on('close', (event) => {
        event.preventDefault();
        mainWin.hide();
    });
    mainWin.once('ready-to-show', () => {
        mainWin.show();
    })
    mainWin.loadFile(__dirname + '/ui/index.html');
}

function registerGlobalShortcut() {
    const ret = globalShortcut.register('CommandOrControl+Alt+Shift+D', () => {
        mainWin.show();
    });
    if (!ret) {
        console.log('快捷键注册失败!');
    }
}
app.on('ready', function () {
    createTray();
    createMainWin();
    registerGlobalShortcut();
    ipcMain.on('exit', function (event, arg) {
        console.log('exit');
        app.exit();
        event.returnValue = true;
    });
    ipcMain.on('showMainWin', function (event, arg) {
        console.log('showMainWin');
        mainWin.show();
        event.returnValue = true;
    });
    ipcMain.on('hideMainWin', function (event, arg) {
        console.log('hideMainWin');
        mainWin.hide();
    });
});

app.on('will-quit', function () {
    // 注销所有快捷键
    globalShortcut.unregisterAll();
})