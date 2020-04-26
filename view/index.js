/*
 * Copyright 2020 Allanic.me ISC License License
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 * Created by Maxime Allanic <maxime@allanic.me> at 25/04/2020
 */

module.exports = async (app, $parameters, tray) => {
    await require('./parameter')(app, $parameters, tray);
    await require('./assistant')(app, $parameters, tray);
};