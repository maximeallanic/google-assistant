/*
 * Copyright 2020 Allanic.me ISC License License
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 * Created by Maxime Allanic <maxime@allanic.me> at 25/04/2020
 */

const $store = require('../../lib/parameters');
const $keyEventToAccelerator = require('../../lib/key-event-to-accelerator');
const { remote } = require('electron');

//http://davidwalsh.name/javascript-debounce-function
function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

$(document)
    .ready(() => {
        var registerInputCommandDebounce = debounce(function (event, input) {

            var accelerator = $keyEventToAccelerator(input);
            $store.set('launchAssistant', accelerator);
            $('#command').val(accelerator);
        }, 500);
        var registerInputCommand = function (event, input) {
            if (input.type !== 'keyDown')
                return;
            registerInputCommandDebounce(event, input);
        };
        $('#command').focus(() => {
            remote.getCurrentWebContents().addListener('before-input-event', registerInputCommand);
        });

        $('#command').blur(() => {
            remote.getCurrentWebContents().removeListener('before-input-event', registerInputCommand);
        });
        $('#command').keypress(function (event) {
            event.preventDefault();
        });

        $('#command').keyup(function (event) {
            event.preventDefault();

            //

        });
        $('#command').val($store.get('launchAssistant'));
    })
