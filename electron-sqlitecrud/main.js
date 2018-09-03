const electron = require('electron')
const path = require('path')
const url = require('url')

const {
    app,
    BrowserWindow,
    Menu,
    shell
} = electron

let mainWindow

function createWindow(params = null) {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600
    })
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file',
        slashes: true
    }))

    var menu = Menu.buildFromTemplate([{
        label: 'Application',
        submenu: [{
                label: 'Start on Startup'
            },
            {
                label: 'Always on top'
            },
            {
                label: 'Open explorer',
                click() {
                    shell.openExternal('file://')
                }
            },
            {
                type: 'separator'
            },
            {
                label: ' Exit',
                click() {
                    app.quit()
                }
            }
        ]
    }, {
        label: 'Options',
        submenu: [{
            label: 'Customize'
        }]
    }, {
        label: 'Help',
        submenu: [{
            label: 'About',
            click: () => {
                openAboutWindow()
            }
        }]
    }])
    Menu.setApplicationMenu(menu);
}

function openAboutWindow() {
    let aboutWindow = new BrowserWindow({
        parent: mainWindow,
        modal: true,
        show: false,
        minimizable: false,
        maximizable: false,
        width: 400,
        height: 200
    })
    aboutWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'about.html'),
        protocol: 'file:',
        slashes: true
    }))
    aboutWindow.setMenu(null)
    aboutWindow.once('ready-to-show', () => {
        aboutWindow.show()
    })
}


// Create the window then the app is ready
app.on('ready', () => {
    createWindow()
    electron.powerMonitor.on('on-ac', () => {
        mainWindow.restore()
    })
    electron.powerMonitor.on('on-battery', () => {
        mainWindow.minimize()
    })
})

// Quit when all windows are closed
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

// Reopen the app on macOS
app.on('activate', () => {
    if (mainWindow === null) {
        createWindow()
    }
})