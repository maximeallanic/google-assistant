/*
 * Copyright 2020 Allanic.me ISC License License
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 * Created by Maxime Allanic <maxime@allanic.me> at 23/04/2020
 */

const googleAuthLibrary = require('google-auth-library');
const OAuth2 = (new googleAuthLibrary()).OAuth2;
const http = require('http');
const url = require('url');
const open = require('open');
const os = require('os');
const $path = require('path');
const $fs = require('fs');
const $q = require('q');
const $parameters = require('../../lib/parameters');
// Download your OAuth2 configuration from the Google
const keys = require('../../google_oauth.json');
const tokenFile = $path.join(os.homedir(), '.gassistant.json');

async function setTokens(tokens) {
    $parameters.set('google-tokens', tokens);
}

async function getTokens() {

    try {
        return $parameters.get('google-tokens');
    } catch (err) {
        return null;
    }
}

/**
 * Create a new OAuth2Client, and go through the OAuth2 content
 * workflow.  Return the full client to the callback.
 */
function getAuthenticatedClient() {
    return new Promise(async (resolve, reject) => {
        // create an oAuth client to authorize the API call.  Secrets are kept in a `keys.json` file,
        // which should be downloaded from the Google Developers Console.
        const oAuth2Client = new OAuth2(
            keys.installed.client_id,
            keys.installed.client_secret,
            keys.installed.redirect_uris[1]
        );

        var tokens = await getTokens();
        if (tokens) {
            oAuth2Client.setCredentials(tokens);
            return resolve(oAuth2Client);
        }

        // Generate the url that will be used for the consent dialog.
        const authorizeUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: ['https://www.googleapis.com/auth/assistant-sdk-prototype'],
        });



        // Open an http server to accept the oauth callback. In this simple example, the
        // only request to our webserver is to /oauth2callback?code=<code>
        const server = http
            .createServer(async (req, res) => {
                try {
                    if (req.url.indexOf('/oauth2callback') > -1) {
                        // acquire the code from the querystring, and close the web server.
                        const qs = new url.URL(req.url, 'http://localhost:3000').searchParams;
                        const code = qs.get('code');
                        res.end("Please close the window");
                        server.close();

                        // Now that we have the code, use that to acquire tokens.
                        oAuth2Client.getToken(code, (error, tokens) => {
                            try {
                                setTokens(tokens);
                                oAuth2Client.setCredentials(tokens);
                                resolve(oAuth2Client);
                            } catch (e) {
                                reject(e);
                            }
                        });
                        // Make sure to set the credentials on the OAuth2 client.

                    }
                } catch (e) {
                    reject(e);
                }
        })
        .listen(3000, () => {
            // open the browser to the authorize url to start the workflow
            open(authorizeUrl, {wait: false}).then(cp => cp.unref());
        });
    });
}

module.exports = {
    getAuthenticatedClient
};