/*
 * Copyright 2020 Allanic.me ISC License License
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 * Created by Maxime Allanic <maxime@allanic.me> at 21/04/2020
 */
const { BrowserWindow, screen, globalShortcut, systemPreferences, ipcMain, shell, Tray, Menu, NativeImage } = require('electron');
const $onClose = require('../../lib/on-close');
const $store = require('../../lib/parameters');

module.exports = async (app, $parameters) => {
    await systemPreferences.askForMediaAccess('microphone');

    var config = {
        show: false,
        height: 250,
        width: 300,
        useContentSize: true,
        webPreferences: {
            zoomFactor: 1,
            nodeIntegrationInWorker: true,
            nodeIntegration: true
        }
    };

    if (!$parameters.debug) {
        Object.assign(config, {
            vibrancy: 'popover',
            frame: false,
            transparent: true,
            focusable: true,
            titleBarStyle: 'hidden',
            alwaysOnTop: true,
            movable: false,
            minimizable: false,
            maximizable: false,
            resizable: false,
            closable: false
        });
    }

    var main = new BrowserWindow(config);

    $onClose(() => {
        if (!main.isDestroyed()) {
            if (main.isVisible())
                main.hide();
            main.destroy();
        }
    });

    if (!$parameters.debug) {
        // "floating" + 1 is higher than all regular windows, but still behind things
        // like spotlight or the screen saver
        main.setAlwaysOnTop(true, "floating", 1);
        // allows the window to show over a fullscreen window
        main.setVisibleOnAllWorkspaces(true);
    }

    function hideAssistant() {
        main.webContents.executeJavaScript('cancelCurrentConversation()');
        if (!$parameters.debug)
            main.hide();
    }

    main.on('error', console.error);

    main.on('ready-to-show', () => {
        console.log('Ready to show');

        main.setHasShadow(false);

        main.on('blur', () => {
            hideAssistant();
        });

        main.webContents.on('before-input-event', (event, input) => {
            if (input.code == 'Escape') {
                hideAssistant();
            }
            event.preventDefault();
        });

        main.webContents.on('console-message', (event, level, message, line, sourceId) => {
            if ($parameters.debug)
                console.log(message, line, sourceId);
        });

        main.webContents.on('new-window', function (event, url) {
            event.preventDefault();
            shell.openExternal(url);
        });

        $store.onDidChange('launchAssistant', function (value, oldValue) {
            try {
                globalShortcut.unregister(oldValue, showAssistant);
                globalShortcut.register(value, showAssistant);
            } catch (e) {
                console.error(e);
            }
        })

        globalShortcut.register($store.get('launchAssistant'), showAssistant);
    });

    main.loadFile('./view/assistant/view.html');   




    var closeTimeout;
    function showAssistant () {
        if (!main.isVisible()) {
            if ($parameters.debug)
                main.webContents.openDevTools();



            function resize(height, width) {
                var cursorPoint = screen.getCursorScreenPoint();

                let displays = screen.getAllDisplays()
                let currentDisplay = displays.find((display) => {
                    return ((display.bounds.x < cursorPoint.x && (display.bounds.width + display.bounds.x) > cursorPoint.x)
                        && (display.bounds.y < cursorPoint.y && (display.bounds.height + display.bounds.y) > cursorPoint.y))
                });

                main.setBounds({
                    x: Math.round(currentDisplay.bounds.x + (currentDisplay.bounds.width - width) / 2),
                    y: Math.round(currentDisplay.bounds.y + (currentDisplay.bounds.height - height) / 2),
                    height: Math.round(height),
                    width: Math.round(width)
                }, true);

            }

            function eventHandler(event, height, width) {
                resize(height, width);
            }

            ipcMain.on('resize-dialog', eventHandler);
            var bounds = main.getBounds();
            resize(bounds.height, bounds.width);

            main.once('hide', () => {
                main.webContents.removeListener('resize-dialog', eventHandler);
            });
            main.show();
        }

        clearTimeout(closeTimeout);
        main.webContents.executeJavaScript('startAssistant()')
            .then(() => {
                closeTimeout = setTimeout(function () {
                    hideAssistant();
                }, 5000);
            }, console.error);
    };
}