/*
 * Copyright 2020 Allanic.me ISC License License
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 * Created by Maxime Allanic <maxime@allanic.me> at 21/04/2020
 */

'use strict';

const $auth = require('./auth');
const SpeakerHelper = require('./speaker-helper');
const GoogleAssistant = require('google-assistant');
const process = require('process');
const getLocation = require('electron-get-location');
const rootDirectory = require('../root-directory');
// Include sox binary
process.env.PATH = rootDirectory + '/binary/sox-14.4.2:' + process.env.PATH;
console.log(process.env.PATH);
const record = require('node-record-lpcm16');



const startConversation = (conversation, config) => {
    let openMicAgain = false;

    // pass the mic audio to the assistant
    const mic = record.record({ threshold: 0 });
    mic.stream()
        .on('data', data => {
            if (!conversation.complete)
                conversation.write(data)
        })
        .on('error', error => conversation.emit('error', error));

    var isAttempingOutput = false;
    // setup the conversation
    conversation
        // send the audio buffer to the speaker
        .on('audio-data', (data) => {
            isAttempingOutput = true;
            speaker.update(data);
        })
        // done speaking, close the mic
        .on('end-of-utterance', (e) => {
            mic.stop();
        })
        // once the conversation is ended, see if we need to follow up
        .on('ended', (error, continueConversation) => {
            if (error)
                console.log('Conversation Ended Error:', error);
            else if (continueConversation)
                openMicAgain = true;

            mic.stop();
            if (!isAttempingOutput)
                conversation.emit('complete', continueConversation);
        })
        // catch any errors
        .on('error', () => {
            speaker.close();
            mic.stop();
            conversation.emit('complete', false);
        });


    const speaker = new SpeakerHelper({
        channels: 1,
        sampleRate: config.audio.sampleRateOut,
    });

    speaker
        .on('open', () => {
            conversation.emit('speak-start');
        })
        .on('close', () => {
            conversation.emit('complete', openMicAgain);
        })
        .on('error', (error) => {
            conversation.emit('error', error)
        });

    conversation.cancel = () => {
        conversation.end();
        speaker.close(false);
        mic.stop();
        conversation.emit('complete', false);
    };

    return conversation;
};

module.exports.start = async function () {
    var lang = navigator.language;
    if (!lang.match(/[a-z]+\-[A-Z]+/)) {
        lang = lang + '-' + lang.toUpperCase()
    }
    var authclient = await $auth.getAuthenticatedClient();

    var location = await getLocation();
    const config = {
        auth: {
            oauth2Client: authclient
        },
        conversation: {
            audio: {
                //encodingIn: 'FLAC',
                sampleRateIn: 24000,
                sampleRateOut: 24000, // defaults to 24000
            },
            deviceId: 'action.devices.types.PHONE',
            deviceLocation: {
                coordinates: {
                    latitude: location.latitude,
                    longitude: location.longitude
                }
            },
            isNew: true,
            lang: lang, // defaults to en-US, but try other ones, it's fun!
        },
    };
    // setup the assistant
    const assistant = new GoogleAssistant(config.auth);

    assistant
        .on('started', (conversation) => {
            startConversation(conversation, config.conversation);
            assistant.emit('new-conversation', conversation);
        })
        .on('new-conversation', (conversation) => {
            conversation.once('complete', (continueConversation) => {
                conversation.complete = true;
                if (continueConversation) {
                    assistant.start(config.conversation);
                }
                else
                    assistant.emit('end');
            });
            conversation.on('error', (error) => {
                if (!conversation.complete)
                    assistant.emit('error', error);
            });

            conversation.on('device-action', (action) => {
                console.log(action);
            })
        });

    return assistant;
}

console.log(module.exports);