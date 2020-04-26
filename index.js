/*
 * Copyright 2020 Allanic.me ISC License License
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 * Created by Maxime Allanic <maxime@allanic.me> at 25/04/2020
 */

const $log = require('electron-log');
const { app, Tray, nativeImage, Menu } = require('electron');
const $parameters = require('./lib/parameters');
const $view = require('./view');
const rootDirectory = require('./lib/root-directory');
const AutoLaunch = require('auto-launch');
const { autoUpdater } = require("electron-updater")

$parameters.$setDefault('debug', true);

/*if (!$parameters.debug)
    app.dock.hide();*/
$log.info('load app');
let tray;
app.whenReady()
    .then(async () => {
        var autoLauncher = new AutoLaunch({
            name: 'GoogleAssistant',
        });
        if (!await autoLauncher.isEnabled())
            autoLauncher.enable();

        var trayImage = nativeImage.createFromPath(rootDirectory + '/build/icon/statusIcon.png');
        console.log(rootDirectory + '/build/icon/statusIcon.png');
        tray = new Tray(trayImage);
        const menuTray = Menu.buildFromTemplate([
            {
                label: 'Quit',
                click: function () {
                    $onClose.close();
                }
            }
        ])


        $log.info('load view');
        app.dock.hide();
        await $view(app, $parameters, menuTray);
        tray.setContextMenu(menuTray);
        $log.info('loaded');

        autoUpdater.checkForUpdatesAndNotify();
    })
    .catch((error) => {
        $log.error(error);
    });