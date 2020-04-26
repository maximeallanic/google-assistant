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
    duration: 800,
    autoplay: false,
    easing: 'cubicBezier(0.01, 0.58, 0.81, 0.99)'
});

animation.add({
    targets: $elements.dots.cornflowerBlue,
    keyframes: [
        {
            duration: 400,
            translateX: 0,
            translateY: '-14px',
            width: '28px',
            height: '28px'
        },
        {
            duration: 40,
            translateX: 0,
            translateY: '10px'
        },
        {
            duration: 40,
            translateX: 0,
            translateY: '2px',
            height: '69.6px',
            width: '69.6px'
        },
        {
            duration: 80,
            translateX: '40px',
            translateY: '2px'
        },
        {
            duration: 200,
            translateX: '36px',
            translateY: '-60.8px'
        }
    ]
}, 0);


animation.add({
    targets: $elements.dots.flamingo,
    keyframes: [
        {
            duration: 400,
            translateX: '57.12px',
            translateY: '-14px',
            width: '28px',
            height: '28px'
        },
        {
            duration: 40,
            translateX: 0,
            translateY: '8px'
        },
        {
            duration: 40,
            translateX: '100px',
            translateY: '-18px'
        },
        {
            duration: 320,
            translateX: '112px',
            translateY: '-26px',
            width: '35.2px',
            height: '35.2px'
        }
    ]
}, 0);

animation.add({
    targets: $elements.dots.moonYellow,
    keyframes: [
        {
            duration: 400,
            translateX: '114.24px',
            translateY: '-14px',
            height: '28px',
            width: '28px'
        },
        {
            duration: 80,
            translateX: '122.24px',
            translateY: '4.4px',
            height: '32px',
            width: '32px'
        },
        {
            duration: 120,
            translateX: '126.24px',
            translateY: '4.4px',
        },
        {
            duration: 200,
            translateX: '109.6px',
            translateY: '16.4px',
            height: '40px',
            width: '40px'
        }
    ]
}, 0);

animation.add({
    targets: $elements.dots.emerald,
    keyframes: [
        {
            duration: 400,
            translateX: '171.36px',
            translateY: '-14px',
            width: '28px',
            height: '28px'
        },
        {
            duration: 200,
            translateX: '163.36px',
            translateY: '-36.8px',
            height: '17.2px',
            width: '17.2px'
        },
        {
            duration: 200,
            translateX: '148px',
            translateY: '-36.8px',
            height: '17.2px',
            width: '17.2px'
        }
    ]
}, 0)

module.exports = new Wrapper(animation);