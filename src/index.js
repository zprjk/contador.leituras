'use strict';
const { app, BrowserWindow, Menu } = require('electron')
const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

const template = [
    {
        label: 'File',
        submenu: [
            { role: 'close' },
        ]
    },
    {
        label: 'View',
        submenu: [
            { role: 'reload' },
            { role: 'forcereload' },
            { type: 'separator' },
            { role: 'resetzoom' },
            { role: 'zoomin' },
            { role: 'zoomout' },
        ]
    },
    {
        label: 'About',
        submenu: [
            {
                label: 'GitHub',
                click() { require('electron').shell.openExternal('https://github.com/zprjk/contador.leituras') }
            }
        ]
    }
]

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)

function createWindow() {
    // Create the browser window.
    //win = new BrowserWindow({ width: 500, height: 430 })
    win = new BrowserWindow({ width: 570, height: 500, resizable: false, maximizable: false })
    // and load the index.html of the app.
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }))

    // Open the DevTools.
    //win.webContents.openDevTools()

    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow()
    }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
const { ipcMain } = require('electron')
const automateLuz = require('./automations/automate-luz')
const automateAgua = require('./automations/automate-agua')
const automateGas = require('./automations/automate-gas')

ipcMain.on('run-automate-luz', (event, userName, password, codIdentLocal, leitura) => {
    console.log('running automate-luz')
    automateLuz(userName, password, codIdentLocal, leitura, err => event.sender.send('run-automate-luz', err))
})

ipcMain.on('run-automate-agua', (event, userName, password, codCliente, leitura) => {
    console.log('running automate-agua')
    automateAgua(userName, password, codCliente, leitura, err => event.sender.send('run-automate-agua', err))
})

ipcMain.on('run-automate-gas', (event, userName, password, numFornecimento, leitura) => {
    console.log('running automate-gas')
    automateGas(userName, password, numFornecimento, leitura, err => event.sender.send('run-automate-gas', err))
})
