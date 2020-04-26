/*
 * Copyright 2020 Allanic.me ISC License License
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 * Created by Maxime Allanic <maxime@allanic.me> at 25/04/2020
 */

const $lodash = require('lodash');
const Store = require('electron-store');
const $fs = require('fs');

class Parameters extends Store {
    constructor () {
        super({
            watch: true,
            defaults: {
                launchAssistant: 'CommandOrControl+U'
            }
        });
    }

    $setDefault(key, value) {
        if (!$lodash.has(this, key))
            $lodash.set(this, key, value);
    }

    _watch() {
		this._ensureDirectory();

		if (!$fs.existsSync(this.path)) {
			this._write({});
		}

		$fs.watchFile(this.path, { persistent: false, interval: 100 }, () => {
			this.events.emit('change');
		});
	}
}

module.exports = new Parameters();