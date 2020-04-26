/*
 * Copyright 2020 Allanic.me ISC License License
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 * Created by Maxime Allanic <maxime@allanic.me> at 21/04/2020
 */

const $animation = require('./lib/animation');
const $googleAssistant = require('../../lib/google-assistant');

var currentConversation;
function cancelCurrentConversation() {
    if (currentConversation) {
        console.log('canceled');
        currentConversation.cancel();
        currentConversation = null;
        isStarted = false;
    }
}

var isStarted = false;
var assistant;

async function getAssistant() {
    if (!assistant) {
        console.log('init assistant');
        console.log($googleAssistant);
        assistant = await $googleAssistant.start();

        assistant.on('new-conversation', async function (conversation) {

            var responseHandled = false;
            currentConversation = conversation;
            console.log('new-conversation', currentConversation);
            var isContinuingConversation;

            currentConversation.on('transcription', function (transcription) {
                if (!responseHandled)
                    $animation.showDialog(transcription.transcription);
            });

            currentConversation.on('ended', function () {
                $animation.clearAttempting();
            });

            currentConversation.on('complete', async function (continueConversation) {
                if (!continueConversation) {
                    $animation.clearAttempting();
                    $animation.clearDialog();
                }
            })

            currentConversation.on('response', async function (response) {
                if (response.trim().length > 0) {
                    $animation.clearAttempting();
                    responseHandled = true;
                    await $animation.showDialog(response);
                }
            });

            currentConversation.on('error', function (error) {
                console.error(error);
                currentConversation = null;
                isStarted = false;
            });

            await $animation.setAttempting();
            await $animation.setProcessing();
        });

        assistant.on('error', function (error) {
            $animation.clearAttempting();
            console.error(error);
            currentConversation = null;
            isStarted = false;
        })

        assistant.on('end', function () {
            currentConversation = null;
            isStarted = false;
        });
    }


    return assistant;
}

function startAssistant() {
    cancelCurrentConversation();

    return new Promise(async function (resolve, reject) {
        if (isStarted)
            return reject(new Error('Already started'));

        isStarted = true;

        var localAssistant = await getAssistant();
        localAssistant.once('error', reject);
        localAssistant.once('end', resolve);
        localAssistant.start();

        $animation.setAttempting();
        $animation.setProcessing();
    });
}
