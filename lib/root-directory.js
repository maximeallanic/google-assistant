/*
 * Copyright 2020 Allanic.me ISC License License
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 * Created by Maxime Allanic <maxime@allanic.me> at 25/04/2020
 */
const appRootDir = require('app-root-dir');
const $path = require('path');
var { app, remote } = require('electron');
if (!app)
    app = remote.app;

module.exports = app.isPackaged ? $path.dirname(process.resourcesPath) : appRootDir.get();