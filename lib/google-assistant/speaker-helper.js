/*
 * Copyright 2020 Allanic.me ISC License License
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 * Created by Maxime Allanic <maxime@allanic.me> at 21/04/2020
 */
const Speaker = require('speaker');

module.exports = class SpeakerHelper extends Speaker {
    constructor (config) {
        super(config);
        this.on('open', () => {
            try {
                if (this._speakerTimer)
                    clearTimeout(this._speakerTimer);
                this._spokenResponseLength = 0;
                this._speakerOpenTime = new Date().getTime();
            } catch (e) {
                console.error(e);
            }
        });

        this.on('close', () => {
            //this.close();
        });
    }

    update(data) {
        if (this._closed)
            return;

        const now = new Date().getTime();
        this.write(data);

        // kill the speaker after enough data has been sent to it and then let it flush out
        this._spokenResponseLength += data.length;
        const audioTime = this._spokenResponseLength / (24000 * 16 / 8) * 1000;
        clearTimeout(this._speakerTimer);
        this._speakerTimer = setTimeout(() => {
            this.end();
        }, audioTime - Math.max(0, now - this._speakerOpenTime));
    }
};