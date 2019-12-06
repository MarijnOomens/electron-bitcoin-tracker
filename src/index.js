const electron = require('electron')
const path = require('path')
const BrowserWindow = electron.remote.BrowserWindow
const axios = require('axios')
const ipc = electron.ipcRenderer

const notifyBtn = document.getElementById('notifyBtn')
var price = document.querySelector('h1')
var targetPrice = document.getElementById('targetPrice')
var targetPriceVal

const notification = {
    title: 'BTC Alert',
    body: 'BTC just beat your target price!',
    icon: path.join(__dirname, '../assets/images/btc.png')
}

let getBTC = async() => {
    let response = await axios.get('https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC&tsyms=USD')
    const value = response.data.BTC.USD
    price.innerHTML = '$'+value.toLocaleString('en')
    
    if (targetPrice.innerHTML != '' && targetPriceVal < response.data.BTC.USD) {
        const myNotification = new window.Notification(notification.title, notification)
    }
}
getBTC()
setInterval(() => {
    getBTC()
}, 10000);

notifyBtn.addEventListener('click', e => {
    const modalPath = path.join('file://', __dirname, 'add.html')
    let win = new BrowserWindow({ transparent: true, frame: false, alwaysOnTop: true, width: 400, height: 200, webPreferences: { nodeIntegration: true } })
    win.on('close', () => { win = null })
    win.loadURL(modalPath)
    win.show()
})

ipc.on('targetPriceVal', (event, arg) => {
    targetPriceVal = Number(arg)
    targetPrice.innerHTML = '$'+targetPriceVal.toLocaleString('en')
})