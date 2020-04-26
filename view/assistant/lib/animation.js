/*
 * Copyright 2020 Allanic.me ISC License License
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 * Created by Maxime Allanic <maxime@allanic.me> at 22/04/2020
 */


const $processingAnimation = require('./processing');
const $attemptingAnimation = require('./attempting');
const $dialogAnimation = require('./dialog');

module.exports = {
    setProcessing: async function () {
        return $processingAnimation.start();
    },
    setAttempting: async function () {
        await $processingAnimation.stop();
        await $attemptingAnimation.reverse();
    },
    clearAttempting: async function () {
        await $processingAnimation.stop();
        await $attemptingAnimation.start();
    },
    clearHelp: async function () {
        await $helperAnimation.reverse();
    },
    setDialogText: async function (text) {
        await $dialogAnimation.setText(text);
    },
    showDialog: async function (text) {
        module.exports.setDialogText(text);
        if (!$dialogAnimation.isComplete())
            await $dialogAnimation.start();
    },
    clearDialog: async function () {
        await $dialogAnimation.reverse();
        $dialogAnimation.setText('');
    }
}