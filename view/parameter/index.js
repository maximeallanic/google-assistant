/*
 * Copyright 2020 Allanic.me ISC License License
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 * Created by Maxime Allanic <maxime@allanic.me> at 25/04/2020
 */

const { MenuItem, BrowserWindow } = require('electron');

function openSettings() {
    var main = new BrowserWindow({
        titleBarStyle: 'hidden',
        acceptFirstMouse: true,
        webPreferences: {
            zoomFactor: 1,
            nodeIntegrationInWorker: true,
            nodeIntegration: true
        }
    });
    main.loadFile('./view/parameter/view.html');
}

module.exports = async (app, $parameters, tray) => {
    tray.insert(0, new MenuItem({
        label: 'Parameters',
        click: async () => {
            openSettings();
        }
    }))
};