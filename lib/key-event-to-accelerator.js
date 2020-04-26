/*
 * Copyright 2020 Allanic.me ISC License License
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 * Created by Maxime Allanic <maxime@allanic.me> at 26/04/2020
 */

module.exports = function (keyEvent) {
    console.log(keyEvent)
    var keys = [];
    if (keyEvent.control)
        keys.push('CommandOrControl');
    if (keyEvent.alt)
        keys.push('Alt');
    if (keyEvent.meta)
        keys.push('Super');
    if (keyEvent.shift)
        keys.push('Shift');

    var keyLetterMatch = keyEvent.code.match(/Key([A-Za-z])/);
    switch (true) {
        case !!keyLetterMatch:
            keys.push(keyLetterMatch[1].toUpperCase());
            break;
        default:
            keys.push(keyEvent.code);
            break;
    }

    return keys.join('+');
}