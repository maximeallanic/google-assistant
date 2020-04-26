/*
 * Copyright 2020 Allanic.me ISC License License
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 * Created by Maxime Allanic <maxime@allanic.me> at 25/04/2020
 */

const { app, globalShortcut } = require('electron');
const $q = require('q');

var callbacks = [];
module.exports = (callback) => {
    callbacks.push(callback);
};

module.exports.close = () => {
    process.emit('beforeExit');
};

([
    'SIGINT',
    'SIGTERM',
    'SIGQUIT',
    'SIGUSR2',
    'uncaughtExceptionMonitor',
    'unhandledRejection',
    'uncaughtException',
    'beforeExit'
]).forEach((eventName) => {
    process.on(eventName, async (code, error) => {
        try {
            if (error instanceof Error) {
                console.error(error);
            }
            await $q.all(callbacks.map((callback) => callback()));
            await globalShortcut.unregisterAll();
            await app.quit();
        } catch (error) {
            console.error(error);
        }
        process.exit(code);
    });
});