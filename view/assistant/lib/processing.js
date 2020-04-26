/*
 * Copyright 2020 Allanic.me ISC License License
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 * Created by Maxime Allanic <maxime@allanic.me> at 22/04/2020
 */

const $anime = require('animejs');
const $elements = require('./elements');
const Wrapper = require('./wrapper');

var animation = $anime.timeline({
    loop: true,
    duration: 1000,
    easing: 'linear',
    autoplay: false
});
var offset = 0;
Object.values($elements.dots).forEach(dot => {
    animation.add({
        targets: dot,
        'marginTop': [
            {
                value: 0
            },
            {
                value: 0,
                duration: 500
            },
            {
                value: '-22px',
                duration: 125
            },
            {
                value: '18px',
                duration: 125
            },
            {
                value: 0,
                duration: 250
            }
        ]
    }, offset);
    offset += 100;
});

module.exports = new Wrapper(animation);