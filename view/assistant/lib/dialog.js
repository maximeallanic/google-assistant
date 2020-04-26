/*
 * Copyright 2020 Allanic.me ISC License License
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 * Created by Maxime Allanic <maxime@allanic.me> at 22/04/2020
 */

const $anime = require('animejs');
const $elements = require('./elements');
const Wrapper = require('./wrapper');
const { ipcRenderer } = require('electron');

var animation = $anime({
    duration: 750,
    easing: 'cubicBezier(0.01, 0.58, 0.81, 0.99)',
    targets: $elements.dialog,
    autoplay: false,
    keyframes: [
        {
            opacity: 0,
            translateY: '32px'
        },
        {
            opacity: 1,
            translateY: 0
        }
    ]
});

module.exports = new Wrapper(animation);

var previousText;
var textAnimation;
module.exports.setText = function (text) {
    if (text == previousText)
        return;

    text = text.replace(/(\\n|\n)/g, '</br>');
    text = text.replace(/(https?:\/\/[^\)\s]+)/g, '<a href="$1" target="_blank">$1</a>')
    var span = $elements.dialog.querySelector('span');

    var c = document.createElement('span');
    //c.style = span.style;
    c.style.visibility = 'hidden';
    c.style[ 'font-size' ] = '20px';
    c.style[ 'white-space' ] = 'pre-wrap';
    c.style[ 'font-weight' ] = 'bolder';
    c.style[ 'position' ] = 'absolute';
    c.innerHTML = text;
    document.body.appendChild(c);
    var maxHeight = c.offsetHeight
    var maxWidth = c.offsetWidth;
    document.body.removeChild(c);
    if (textAnimation)
        textAnimation.pause();

    var isSimilarText = previousText && text.match(new RegExp(previousText));
    textAnimation = $anime.timeline({
        easing: 'easeInOutCubic'
    })
        .add({
            targets: span,
            keyframes: [
                {
                    opacity: isSimilarText ? 0.5 : 0,
                    duration: 100
                },
                {
                    height: maxHeight,
                    width: maxWidth + 3,
                    duration: 300
                },
                {
                    opacity: 1,
                    delay: 200,
                    duration: 100
                }
            ],
            update: function (anim) {
                if (anim.progress >= 60)
                    span.innerHTML = text;
            }
        }, 0);
    maxWidth = maxWidth * 1.5;
    maxHeight = maxHeight * 1.5 + 200;
    if (maxWidth < 300)
        maxWidth = 300;
    if (maxHeight < 250)
        maxHeight = 250;


    ipcRenderer.send('resize-dialog', Math.round(maxHeight), Math.round(maxWidth))

    previousText = text;
}