/*
 * Copyright 2020 Allanic.me ISC License License
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 * Created by Maxime Allanic <maxime@allanic.me> at 22/04/2020
 */

const $lodash = require('lodash');
const $q = require('q');

module.exports = class Wrapper {
    constructor (animation) {
        this._animation = animation;

        this._onComplete = [];
        this._animation.loopComplete = () => {
            $lodash.over(this._onComplete)();
        }
    }

    start() {
        var deffered = $q.defer();
        var completedOnReverse = this._animation.direction == 'reverse' && this._animation.completed;
        if (this._animation.direction == 'reverse')
            this._animation.reverse();

        if (this._animation.paused &&
            (this._animation.loop === true
            || !this._animation.completed
            || completedOnReverse)) {
            this._animation.play();
        }

        this.onceComplete(() => {
            deffered.resolve();
        });

        return deffered.promise;
    }

    reverse() {
        var deffered = $q.defer();
        var completedOnReverse = this._animation.direction != 'reverse' && this._animation.completed;
        if (this._animation.direction != 'reverse')
            this._animation.reverse();

        if (this._animation.paused &&
            (this._animation.loop === true
                || !this._animation.completed
                || completedOnReverse)) {
            this._animation.play();
        }

        this.onceComplete(() => {
            deffered.resolve();
        });
        return deffered.promise;
    }

    stop() {
        if (this._animation.complete
            || this._animation.paused) {
            this._animation.pause();
            return $q.resolve();
        }

        var deffered = $q.defer();
        this.onceComplete(() => {
            this._animation.pause();
            deffered.resolve();
        });
        return deffered.promise;
    }

    isComplete() {
        return this._animation.complete;
    }

    onceComplete(callback) {
        if (this._animation.complete)
            return callback();
        var onComplete = () => {
            callback();
            $lodash.remove(this._onComplete, (c) => {
                return c === onComplete;
            });
        };
        this._onComplete.push(onComplete);
    }
}